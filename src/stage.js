import { MapData } from "./mapdata.js";
import { Shape } from "./canvas.js";
import { Vector2 } from "./vector.js";
import { ShapeRenderer } from "./shaperenderer.js";

//
// Stage
// (c) 2019 Jani Nykänen
//


// Tile dimensions
export const Tile = {Width: 64, Height: 64};

// Local constants
const PORTAL_APPEAR_TIME = 30.0;
const ARROW_TIME = 60;
const WALL_COLORS_BLUE = [
    [0.90, 0.95, 1.00],
    [0.60, 0.80, 1.00], 
    
    [0.05, 0.25, 0.60],
    [0.15, 0.45, 0.80],
    [0.33, 0.67, 1.00],
];
const WALL_COLORS_RED = [
    [1.00, 0.90, 0.95],
    [1.00, 0.60, 0.80], 
    
    [0.60, 0.05, 0.25],
    [0.80, 0.15, 0.45],
    [1.00, 0.33, 0.67],
];
const WALL_COLORS_GRAY = [
    [0.95, 0.95, 0.95],
    [0.80, 0.80, 0.80], 
    
    [0.30, 0.30, 0.30],
    [0.46, 0.46, 0.46],
    [0.67, 0.67, 0.67],
];
const BUTTON_COLOR_PURPLE = [
    [0.80, 0.15, 0.45],
    [0.60, 0.05, 0.25],
    [1.00, 0.33, 0.67],
];
const BUTTON_COLOR_GREEN = [
    [0.33, 1.0, 0.33],
    [0.00, 0.67, 0.00],
    [0.67, 1.00, 0.67],
];


//
// Stage class
//
export class Stage {


    //
    // Constructor
    //
    constructor(id, o) {

        let src = MapData[id -1];
        this.id = id;

        // Decode RLE-packed data
        this.data = new Array(src.w * src.h);
        this.data.fill(1);
        for (let y = 0; y < src.h-2; ++ y) {

            for (let x = 0; x < src.w-2; ++ x) {

                this.data[(y+1)*src.w+(x+1)] = 
                    src.data[y*(src.w-2) + x];
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

        // Timer for arrow animation
        this.arrowTimer = 0;

        // Key height timer
        this.keyHeightTimer = 0.0;

        // Create a shape renderer
        this.srend = new ShapeRenderer(Tile.Width, Tile.Height);

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
    isSolid(x, y, dir, egg, keys) {

        let s = this.solid[y * this.w + x];
        let t = this.getTile(x, y);
        if (dir != null) {

            if (t >= 4 && t <= 7 &&
                dir == t-4) 
                return true;
        }

        if (egg && s < 0)
            return true;
        if (keys != null && keys > 0 &&
            t == 16) {

            return false;
        }
        return s > 0;
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
                case 8:
                case 16:
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
                    this.updateSolid(x, y, -1);
                    o.createEgg(x, y);
                    break;

                // Monster
                case 12:
                case 13:
                case 14:
                case 15:
                case 20:

                    this.updateSolid(x, y, 2);
                    o.createMonster(x, y, Math.min(t-12,4));
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
        let tx = 0;
        let ty = 0;

        if (c.w/c.h >= 1)
            tx = c.viewport.x / 2 - mx;
        else 
            ty = c.viewport.y / 2 - my;

        if (dx != null) mx = dx;
        if (dy != null) my = dy;
        
        // Scale to middle
        c.translate(tx, ty);

        // Scale & rotate around the 
        // given center point
        c.translate(mx, my);
        if (angle != null) {

            c.rotate(angle * (this.id % 2 == 0 ? -1 : 1));
        }
        c.scale(s, s);
        c.translate(-mx, -my); 

        c.useTransform();
    }


    //
    // Draw a wall tile
    //
    drawWallTile(c, x, y, id, colors) {

        const LEFT = 0;
        const TOP = 1;
        const RIGHT = 2;
        const BOTTOM = 3;

        let lw = Tile.Width/5;
        let lh = Tile.Height/5;

        let empty = [
            this.getTile(x-1, y) != id, // Left,
            this.getTile(x, y-1) != id, // Top
            this.getTile(x+1, y) != id, // Right,
            this.getTile(x, y+1) != id, // Bottom
        ]

        // Base shape
        c.setColor(...colors[4]);
        c.fillShape(Shape.Rect,
            x * Tile.Width, y * Tile.Height,
            Tile.Width, Tile.Height);

        // Right empty
        if (empty[RIGHT]) {

            c.setColor(...colors[RIGHT]);
            c.fillShape(Shape.Rect,
                x * Tile.Width + (Tile.Width-lw), 
                y * Tile.Height,
                lw, Tile.Height);
        }
        // Bottom empty
        if (empty[BOTTOM]) {

            c.setColor(...colors[BOTTOM]);
            c.fillShape(Shape.Rect,
                x * Tile.Width , 
                y * Tile.Height + (Tile.Height-lh),
                Tile.Width, lh);

            // Right empty
            if (empty[RIGHT]) {

                c.setColor(...colors[RIGHT]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width + (Tile.Width-lw), 
                    y * Tile.Height + (Tile.Height-lh),
                    -lw, -lh);
            }
        }
        // Left empty
        if (empty[LEFT]) {

            c.setColor(...colors[LEFT]);
            c.fillShape(Shape.Rect,
                x * Tile.Width, 
                y * Tile.Height,
                lw, Tile.Height);

            // Bottom empty
            if (empty[BOTTOM]) {

                c.setColor(...colors[BOTTOM]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width, 
                    y * Tile.Height + (Tile.Height-lh),
                    -lw, lh);
            }
        }
        // Top empty
        if (empty[TOP]) {

            c.setColor(...colors[TOP]);
            c.fillShape(Shape.Rect,
                x * Tile.Width , 
                y * Tile.Height,
                Tile.Width, lh);

            // Left empty
            if (empty[LEFT]) {

                c.setColor(...colors[LEFT]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width , 
                    y * Tile.Height,
                    lw, lh);
            }
            // Right empty
            if (empty[RIGHT]) {

                c.setColor(...colors[RIGHT]);
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
                this.getTile(x - 1 + 2 * k, y - 1 + 2 * m) != id) {

                c.setColor(...colors[i]);
                c.fillShape(Shape.RAngledTriangle,
                    x * Tile.Width + (Tile.Width-lw) * k, 
                    y * Tile.Height + (Tile.Height-lh) * m,
                    lw * FX[i], lh * FY[i]);

                c.setColor(...colors[(i+1) % 4]);
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

    }

    //
    // Draw floor "decorations"
    // 
    drawFloorDecorations(c, x, y) {

        const OUTLINE = 3.0;
        const SHADOW_ALPHA = 0.25;
        const SHADOW_LENGTH = 0.25;

        // For laziness
        let w = Tile.Width;
        let h = Tile.Height;

        // Empty tiles
        let empty = [
            this.getSolid(x-1, y) != 1, // Left,
            this.getSolid(x, y-1) != 1, // Top
            this.getSolid(x+1, y) != 1, // Right,
            this.getSolid(x, y+1) != 1, // Bottom
        ];

        //
        // Draw shadows
        //
        c.setColor(0, 0, 0, SHADOW_ALPHA);
        let corner = this.getSolid(x-1, y-1) == 1;
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
                this.getSolid(x - 1 + 2 * k, y - 1 + 2 * m) == 1) {

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
        const OUTLINE = 0;

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
    // Draw arrows
    //
    drawArrows(c, x, y, dir) {

        const OUTLINE = 4;
        const WIDTH = 36 - OUTLINE;
        const HEIGHT = 14 - OUTLINE;
        const POS_Y = -14;
        const Y_OFF = 26;
        const COLOR = [ [0.67, 1, 0.67], [0.0, 0.67, 0.0] ];

        c.push();
        c.translate((x+0.5) * Tile.Width, 
            (y+0.5) * Tile.Height);
        c.rotate(dir * Math.PI/2);
        c.useTransform();

        // Determine color position
        let cpos = this.arrowTimer <= ARROW_TIME/2 ? 0 : 1;

        // Draw arrow signs
        for (let i = 0; i < 2; ++ i) {

            c.setColor(...[0, 0.33, 0]);
            c.fillShape(Shape.EquilTriangle, 
                0, POS_Y + Y_OFF * i, 
                WIDTH+OUTLINE, HEIGHT+OUTLINE);

            c.setColor(...COLOR[(i+cpos)%2]);
            c.fillShape(Shape.EquilTriangle, 
                0, POS_Y + Y_OFF * i, 
                WIDTH-OUTLINE*2, HEIGHT);    
        }

        c.pop();
    }


    //
    // Draw dash-lined tile
    //
    drawDashLinedTile(c, x, y) {

        const OUTLINE = 8;
        const WIDTH = 16;
        const OFFSET = 8;
        
        let dx = x * Tile.Width;
        let dy = y * Tile.Height;

        c.setColor(0.60, 0.05, 0.25);
        for (let j = 0; j < 2; ++ j) {
            for (let i = 0; i <= 2; ++ i) {

                // Horizontal
                c.fillShape(Shape.Rect,
                    dx + (WIDTH+OFFSET)*i,
                    dy + (Tile.Height-OUTLINE)*j,
                    WIDTH, OUTLINE);

                // Vertical
                c.fillShape(Shape.Rect,
                    dx + (Tile.Width-OUTLINE)*j,
                    dy + (WIDTH+OFFSET)*i,
                    OUTLINE, WIDTH);
            }
        }
    }


    //
    // Draw lock
    //
    drawLock(c, x, y) {

        const CIRCLE_Y = -8;
        const BOTTOM_Y = 4;
        const CIRCLE_RADIUS = 8;
        const BOTTOM_W = 12;
        const BOTTOM_H = 16;

        let mx = (x + 0.5) * Tile.Width;
        let my = (y + 0.5) * Tile.Height;

        // Draw background tile
        this.drawWallTile(c, x, y, -1, WALL_COLORS_GRAY);

        // Draw keyhole
        c.setColor(0, 0, 0);
        c.fillShape(Shape.Ellipse, 
            mx, my+CIRCLE_Y, 
            CIRCLE_RADIUS, CIRCLE_RADIUS);
        c.fillShape(Shape.EquilTriangle, 
            mx, my+BOTTOM_Y, 
            BOTTOM_W, BOTTOM_H);
    }


    //
    // Draw tiles (and some objects)
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
                    this.drawWallTile(c, x, y, 1, WALL_COLORS_BLUE);
                    break;

                // Red wall, on
                case 8:
                    this.drawWallTile(c, x, y, 8, WALL_COLORS_RED);
                    break;

                // Lock
                case 16:
                    this.drawLock(c, x, y);
                    break;

                // Floor
                default:

                    // Draw base floor tile
                    this.drawFloorPiece(c, x, y);

                    // 
                    // TODO: Nested switch? Own function for these?
                    // NOPE! HAHAHAHAHH I'm fucking lazy
                    //
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
                    // Draw arrow
                    else if (t >= 4 && t <= 7) {

                        this.drawArrows(c, x, y, t-4);
                    }
                    // Draw dashed line
                    else if (t == 9) {

                        this.drawDashLinedTile(c, x, y);
                    }
                    // Draw button (pressed)
                    // Purple
                    else if (t == 11) {

                        this.srend.drawButton(c, x, y, true, 
                            BUTTON_COLOR_PURPLE)
                    }
                    // Green
                    else if (t == 19) {

                        this.srend.drawButton(c, x, y, true, 
                            BUTTON_COLOR_GREEN)
                    }

                    // Draw "decorations"
                    this.drawFloorDecorations(c, x, y);

                    // Draw button (not pressed)
                    // Purple
                    if (t == 10 ) {

                        this.srend.drawButton(c, x, y, false,
                            BUTTON_COLOR_PURPLE)
                    }
                    // Green
                    else if (t == 18 ) {

                        this.srend.drawButton(c, x, y, false,
                            BUTTON_COLOR_GREEN)
                    }
                    // Draw key
                    else if(t == 17) {

                        //this.drawKey(c, x, y);
                        this.srend.drawKey(c, 
                            (x+0.5)*Tile.Width, (y+0.5)*Tile.Height, 
                            this.keyHeightTimer + (x+y)*Math.PI*2/this.w);
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
        const KEY_HEIGHT_DELTA = 0.05;

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

        // Update arrows
        this.arrowTimer = 
            (this.arrowTimer + ev.step) % ARROW_TIME;

        // Update key heights
        this.keyHeightTimer = 
            (this.keyHeightTimer + KEY_HEIGHT_DELTA*ev.step) % 
            (Math.PI*2);
    }


    //
    // Update solid
    //
    updateSolid(x, y, s) {

        let b = false;
        if (s == 2 && this.getTile(x, y) == 16) {

            this.data[y * this.w + x] = 0;
            b = true;
        }

        this.solid[y * this.w + x] = s;
        return b;
    }


    //
    // Is in the start position
    //
    isStartPos(x, y) {

        return this.getTile(x, y) == 2;
    }


    //
    // Get automatic movement (and other auto-stuff)
    //
    autoMovement(o, objm) {

        const LOCK_STAR_COUNT = 4;
        const LOCK_STAR_SPEED = 4;
        const LOCK_STAR_RADIUS = 12;

        let t = null;
        let id = this.getTile(o.pos.x, o.pos.y);
        
        // Arrows
        if (id >= 4 && id <= 7) {

            t = new Vector2(o.pos.x, o.pos.y);
            t.x += [0, 1, 0, -1] [id-4];
            t.y += [-1, 0, 1, 0] [id-4];

            if (this.isSolid(t.x, t.y)) return null;
        }
        // Button
        else if (id == 10 || id == 18) {

            if (id == 18)
                this.arrowTimer = (this.arrowTimer + ARROW_TIME) % ARROW_TIME;

            for (let i = 0; i < this.w*this.h; ++ i) {

                // Toggle buttons
                if (this.data[i] == id || this.data[i] == id+1) {
                    
                    this.data[i] = (this.data[i] == id) ? id+1 : id;
                }
                // Toggle walls (if no egg there)
                else if(id == 10 &&
                    this.solid[i] != 2 && 
                    (this.data[i] == 8 || this.data[i] == 9)) {

                    this.data[i] = (this.data[i] == 8) ? 9 : 8;
                    this.solid[i] = !this.solid[i];
                }
                // Turn arrow floors around
                else if(id == 18 &&
                    this.data[i] >= 4 && this.data[i] <= 7) {

                    this.data[i] = 4 + (((this.data[i]-4)+2)%4);
                }
            }
            return null;
        }
        // Key
        else if (objm != null && id == 17) {

            this.data[o.pos.y*this.w + o.pos.x] = 0;
            ++ o.keyCount;

            objm.createStarShower(
                o.rpos.x+Tile.Width/2,o.rpos.y+Tile.Height/2,
                LOCK_STAR_SPEED, LOCK_STAR_COUNT, 
                LOCK_STAR_RADIUS, 1, [1, 1, 0.5]);
        }

        return t;
    }
}
