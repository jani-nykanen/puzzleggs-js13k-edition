import { MapData } from "./mapdata.js";
import { Shape } from "./canvas.js";
import { Vector2 } from "./vector.js";

//
// Stage
// (c) 2019 Jani Nykänen
//


// Tile dimensions
export const Tile = {Width: 64, Height: 64};

// Local constants
const PORTAL_APPEAR_TIME = 30.0;


//
// Stage class
//
export class Stage {


    //
    // Constructor
    //
    constructor(id, o) {

        let src = MapData[id -1];

        // Decode RLE-packed data
        this.data = new Array(src.w * src.h);
        let d, len;
        let k = 0;
        for (let i = 0; i < src.data.length -1; i += 2) {

            len = src.data[i];
            d =   src.data[i+1];
            for (let j = 0; j < len; ++ j) {

                this.data[k ++] = d;
            }
        }
        this.w = src.w;
        this.h = src.h;

        // Create an array for solid tile data
        this.solid = new Array(src.w * src.h);
        this.solid.fill(0);

        // Portal timer
        this.portalTimer = 0.0;
        this.portalAppearTimer = PORTAL_APPEAR_TIME;

        // Start position center (rendering-wise)
        this.startPos = new Vector2();

        // Parse objects
        this.parseObjects(o);
    }


    //
    // Get a tile
    //
    getTile(x, y) {

        if (x < 0 || y < 0 || x >= this.w || y >= this.h)
            return 1; // "Wall"
        return this.data[y*this.w + x];
    }


    //
    // Is a tile solid
    //
    isSolid(x, y) {

        return this.solid[y * this.w + x] > 0;
    }


    //
    // Get solid value
    //
    getSolid(x, y) {

        return this.solid[y * this.w + x];
    }


    //
    // Parse objects (and solid data)
    //
    parseObjects(o) {
        
        let t;
        for (let y = 0; y < this.h; ++ y) {

            for (let x = 0; x < this.w; ++ x) {

                t = this.getTile(x, y);

                switch(t) {

                // Wall
                case 1:
                    this.updateSolid(x, y, 1);
                    break;

                // Player
                case 2:
                    o.createPlayer(x, y);
                    
                    this.startPos.x = (x + 0.5) * Tile.Width;
                    this.startPos.y = (y + 0.5) * Tile.Height;

                    break;

                // Egg
                case 3:
                    o.createEgg(x, y);
                    break;
            
                default:
                    break;
                }

                
            }
        }
    }


    //
    // Set stage view
    //
    setStageView(c, s, dx, dy, angle) {

        // Fit view
        c.fitViewToDimension(c.w, c.h, 
            Tile.Height * this.h);

        let mx = this.w*Tile.Width/2;
        let my = this.h*Tile.Height/2;

        // Center
        let tx = c.viewport.x / 2 - mx;
        let ty = 0;

        if (dx != null) mx = dx;
        if (dy != null) my = dy;
        
        // Scale to middle
        c.translate(tx, ty);

        // Scale & rotate around the 
        // given center point
        c.translate(mx, my);
        if (angle != null) {

            c.rotate(angle);
        }
        c.scale(s, s);
        c.translate(-mx, -my); 

        c.useTransform();
    }


    //
    // Draw a wall tile
    //
    drawWallTile(c, x, y) {

        const LEFT = 0;
        const TOP = 1;
        const RIGHT = 2;
        const BOTTOM = 3;

        const COLORS = [
            [0.90, 0.95, 1.00],
            [0.60, 0.80, 1.00], 
            
            [0.05, 0.25, 0.60],
            [0.15, 0.45, 0.80],
            [0.33, 0.67, 1.00],
        ];

        
        let lw = Tile.Width/5;
        let lh = Tile.Height/5;

        let empty = [
            this.getTile(x-1, y) != 1, // Left,
            this.getTile(x, y-1) != 1, // Top
            this.getTile(x+1, y) != 1, // Right,
            this.getTile(x, y+1) != 1, // Bottom
        ]

        // Base shape
        c.setColor(...COLORS[4]);
        c.fillShape(Shape.Rect,
            x * Tile.Width, y * Tile.Height,
            Tile.Width, Tile.Height);

        // Right empty
        if (empty[RIGHT]) {

            c.setColor(...COLORS[RIGHT]);
            c.fillShape(Shape.Rect,
                x * Tile.Width + (Tile.Width-lw), 
                y * Tile.Height,
                lw, Tile.Height);
        }
        // Bottom empty
        if (empty[BOTTOM]) {

            c.setColor(...COLORS[BOTTOM]);
            c.fillShape(Shape.Rect,
                x * Tile.Width , 
                y * Tile.Height + (Tile.Height-lh),
                Tile.Width, lh);

            // Right empty
            if (empty[RIGHT]) {

                c.setColor(...COLORS[RIGHT]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width + (Tile.Width-lw), 
                    y * Tile.Height + (Tile.Height-lh),
                    -lw, -lh);
            }
        }
        // Left empty
        if (empty[LEFT]) {

            c.setColor(...COLORS[LEFT]);
            c.fillShape(Shape.Rect,
                x * Tile.Width, 
                y * Tile.Height,
                lw, Tile.Height);

            // Bottom empty
            if (empty[BOTTOM]) {

                c.setColor(...COLORS[BOTTOM]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width, 
                    y * Tile.Height + (Tile.Height-lh),
                    -lw, lh);
            }
        }
        // Top empty
        if (empty[TOP]) {

            c.setColor(...COLORS[TOP]);
            c.fillShape(Shape.Rect,
                x * Tile.Width , 
                y * Tile.Height,
                Tile.Width, lh);

            // Left empty
            if (empty[LEFT]) {

                c.setColor(...COLORS[LEFT]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width , 
                    y * Tile.Height,
                    lw, lh);
            }
            // Right empty
            if (empty[RIGHT]) {

                c.setColor(...COLORS[RIGHT]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width + (Tile.Width-lw), 
                    y * Tile.Height,
                    -lw, lh);
            }
        }

        //
        // Corners
        //
        const MX = [0, 1, 1, 0];
        const MY = [0, 0, 1, 1];
        const FX = [-1, -1, 1, 1];
        const FY = [-1, 1, 1, -1];
        let k, m;
        for (let i = 0; i < 4; ++ i) {

            // Check if empty
            k = MX[i];
            m = MY[i];
            if (!empty[i] && !empty[(i+1) % 4] &&
                this.getTile(x - 1 + 2 * k, y - 1 + 2 * m) != 1) {

                c.setColor(...COLORS[i]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width + (Tile.Width-lw) * k, 
                    y * Tile.Height + (Tile.Height-lh) * m,
                    lw * FX[i], lh * FY[i]);

                c.setColor(...COLORS[(i+1) % 4]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width + (Tile.Width-lw) * k, 
                    y * Tile.Height + (Tile.Height-lh) * m,
                    -lw * FX[i], -lh * FY[i]);    
            }
        }

    }


    //
    // Draw a piece of floor
    //
    drawFloorPiece(c, x, y) {

        const OUTLINE = 3.0;
        const SHADOW_ALPHA = 0.25;
        const SHADOW_LENGTH = 0.25;

        // For laziness
        let w = Tile.Width;
        let h = Tile.Height;

        // Empty tiles
        let empty = [
            this.getTile(x-1, y) != 1, // Left,
            this.getTile(x, y-1) != 1, // Top
            this.getTile(x+1, y) != 1, // Right,
            this.getTile(x, y+1) != 1, // Bottom
        ];

        // Draw base tiles
        if (x % 2 == y % 2) {

            c.setColor(0.90, 0.75, 0.50);
        }
        else {

            c.setColor(0.80, 0.55, 0.30);
        }
        c.fillShape(Shape.Rect,
            x * Tile.Width, y * Tile.Height,
            Tile.Width, Tile.Height);


        //
        // Draw shadows
        //
        c.setColor(0, 0, 0, SHADOW_ALPHA);
        let corner = this.getTile(x-1, y-1) == 1;
        let d = SHADOW_LENGTH;
        let md = 1.0 - SHADOW_LENGTH;

        let b = 0.0;
        let s = Shape.Rect;

        let sw = Tile.Width;
        let sh = Tile.Height;

        // Left not empty
        if (!empty[0]) {

            if (empty[1] && !corner) {

                s = Shape.RAngledTriangle;
                b = OUTLINE;
            }

            // Bottom shape
            c.fillShape(Shape.Rect,
                OUTLINE + x * sw, (y + d) * Tile.Height - b,
                sw * d - OUTLINE, Tile.Height * md + b);

            // Upper shape
            c.fillShape(s,
                OUTLINE + x * sw, y * Tile.Height - b,
                sw* d - OUTLINE, Tile.Height * d);

            // Top not empty
            if (!empty[1]) {

                c.fillShape(Shape.Rect,
                    (x + d) * Tile.Width, y * Tile.Height,
                    Tile.Width * md, Tile.Height * d);
            }
        }
        // Top not empty
        else if(!empty[1]) {

            if (empty[0] && !corner) {

                s = Shape.RAngledTriangle;
                b = OUTLINE;
            }

            // Left shape
            c.fillShape(
                (empty[0] && !corner) ? 
                    Shape.RAngledTriangle : Shape.Rect,
                x * Tile.Width - b, OUTLINE + y * Tile.Height,
                -Tile.Width * d, -sh * d + OUTLINE);

            // Right shape
            c.fillShape(Shape.Rect,
                (x+d) * Tile.Width - b, OUTLINE + y * Tile.Height,
                Tile.Width * md + b, sh * d - OUTLINE);
        }
        // Corner
        else if (corner) {

            c.fillShape(Shape.Rect,
                x * Tile.Width, y * Tile.Height,
                sw * d, sh * d);
        }


        //
        // Draw outlines
        //
        c.setColor(0, 0, 0);
        // Left
        if (!empty[0]) {

            c.fillShape(Shape.Rect, x*Tile.Width, y*Tile.Height,
                OUTLINE, h);
        }
        // Top
        if (!empty[1]) {

            c.fillShape(Shape.Rect, x*Tile.Width, y*Tile.Height,
                w, OUTLINE);
        }
        // Right
        if (!empty[2]) {

            c.fillShape(Shape.Rect, (x+1)*Tile.Width-OUTLINE, y*Tile.Height,
                OUTLINE, h);
        }
        // Bottom
        if (!empty[3]) {

            c.fillShape(Shape.Rect, 
                x*Tile.Width, (y+1)*Tile.Height-OUTLINE,
                w, OUTLINE);
        }

        //
        // Corners
        //
        const MX = [0, 1, 1, 0];
        const MY = [0, 0, 1, 1];
        let k, m;
        for (let i = 0; i < 4; ++ i) {

            // Check if empty
            k = MX[i];
            m = MY[i];
            if (empty[i] && empty[(i+1) % 4] &&
                this.getTile(x - 1 + 2 * k, y - 1 + 2 * m) == 1) {

                c.fillShape(Shape.Rect,
                    x*w + k * (w - OUTLINE),
                    y*h + m * (h - OUTLINE),
                    OUTLINE, OUTLINE);
            }
        }
    }


    //
    // Draw starting tile
    //
    drawStartingTile(c, x, y) {

        const SIZE_MOD = 0.80;
        const THICKNESS = 16;

        let w = Tile.Width * SIZE_MOD;
        let h = Tile.Height * SIZE_MOD;

        c.push();
        c.translate( (x+0.5) * Tile.Width, (y+0.5) * Tile.Height);
        c.rotate(Math.PI / 4);
        c.useTransform();

        c.setColor(0.67, 0.0, 0.0);
        c.fillShape(Shape.Rect, -w/2, -THICKNESS/2, w, THICKNESS);
        c.fillShape(Shape.Rect, -THICKNESS/2, -h/2, THICKNESS, h);

        c.pop();
    }


    //
    // Draw portal
    //
    drawPortal(c, x, y, s) {

        const LOOP = 4;
        const OUTLINE = 3;

        let w = Tile.Width - OUTLINE*2;
        let h = Tile.Height - OUTLINE*2;

        let mx = (x+0.5) * Tile.Width;
        let my = (y+0.5) * Tile.Height;

        c.setColor(0.75, 0, 1.0);
        c.fillShape(Shape.Rect, 
            mx - w/2 * s, my - h/2*s,
            w*s, h*s);
        
        let t;
        let step = 1.0 / LOOP;
        for (let i = 0; i < LOOP; ++ i) {

            t = 1.0 - ((step * i + this.portalTimer * step) % 1.0);

            c.setColor(0.75 * t, 0.0, 1.0 * t);
            c.fillShape(Shape.Rect, 
                mx - t * w/2 * s, my - t* h/2 * s, 
                w * t * s, h*t * s);
        }
    }


    //
    // Draw tiles
    //
    drawTiles(c, beaten) {

        let t = 0;
        let s = 0;
        for (let y = 0; y < this.h; ++ y) {

            for (let x = 0; x < this.w; ++ x) {

                t = this.getTile(x, y);
                
                switch(t) {

                // Wall
                case 1:
                    this.drawWallTile(c, x, y);
                    break;

                // Floor
                default:

                    // Draw base floor tile
                    this.drawFloorPiece(c, x, y);
                        
                    // Draw starting/ending tile
                    if (t == 2) {

                        s = this.portalAppearTimer / PORTAL_APPEAR_TIME;

                        if (beaten && s <= 0) {
                            
                            this.drawPortal(c, x, y, 1.0);
                        }
                        else if (!beaten || s > 0) {

                            this.drawStartingTile(c, x, y);
                            this.drawPortal(c, x, y, 1.0 - s);
                        }
                    }

                    break;
                }
            }
        }
    }


    //
    // Update stage
    //
    update(beaten, ev) {

        const PORTAL_SPEED = 0.025;

        // Update portal
        if (beaten) {

            // Update fading
            if (this.portalAppearTimer > 0.0) {

                this.portalAppearTimer -= 1.0 * ev.step;
                this.portalAppearTimer = Math.max(0, this.portalAppearTimer);
            }

            // Update timer
            this.portalTimer = 
                (this.portalTimer + PORTAL_SPEED*ev.step) % 1;
        }
    }


    //
    // Update solid
    //
    updateSolid(x, y, s) {

        this.solid[y * this.w + x] = s;
    }


    //
    // Is in the start position
    //
    isStartPos(x, y) {

        return this.getTile(x, y) == 2;
    }
}
