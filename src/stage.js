import { MapData } from "./mapdata.js";
import { Shape } from "./canvas.js";

//
// Stage
// (c) 2019 Jani Nykänen
//


export class Stage {


    //
    // Constructor
    //
    constructor(id) {

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

        // Tile dimensions (could be any, really)
        this.tileW = 64;
        this.tileH = 64;
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
    // Set stage view
    //
    setStageView(c) {

        // Fit view
        c.fitViewToDimension(c.w, c.h, 
            this.tileH * this.h);

        // Center
        let tx = c.viewport.x / 2 - this.w*this.tileW/2;
        let ty = 0;

        c.setWorldTransform(tx, ty);
        c.useTransform();
    }


    //
    // Draw a wall tile
    //
    drawWallTile(c, x, y) {

        c.setColor();

        let lw = this.tileW/4;
        let lh = this.tileH/4;

        // Base color
        c.fillShape(Shape.Rect,
            x * this.tileW, y * this.tileH,
            this.tileW, this.tileH);

        let empty = [
            this.getTile(x+1, y) != 1, // Right,
            this.getTile(x, y+1) != 1, // Bottom
            this.getTile(x-1, y) != 1, // Left,
            this.getTile(x, y-1) != 1, // Top
        ]

        // Right empty
        if (empty[0]) {

            c.setColor(0.67, 0.67, 0.67);
            c.fillShape(Shape.Rect,
                x * this.tileW + (this.tileW-lw), 
                y * this.tileH,
                lw, this.tileH);
        }
        // Bottom empty
        if (empty[1]) {

            c.setColor(0.33, 0.33, 0.33);
            c.fillShape(Shape.Rect,
                x * this.tileW , 
                y * this.tileH + (this.tileH-lh),
                this.tileW, lh);

            // Right empty
            if (empty[0]) {

                c.setColor(0.67, 0.67, 0.67);
                c.fillShape(Shape.RAngledTriangle,
                    x * this.tileW + (this.tileW-lw), 
                    y * this.tileH + (this.tileH-lh),
                    -lw, -lh);
            }
        }
        // Left empty
        if (empty[2]) {

            c.setColor(0.85, 0.85, 0.85);
            c.fillShape(Shape.Rect,
                x * this.tileW, 
                y * this.tileH,
                lw, this.tileH);

            // Bottom empty
            if (empty[1]) {

                c.setColor(0.33, 0.33, 0.33);
                c.fillShape(Shape.RAngledTriangle,
                    x * this.tileW, 
                    y * this.tileH + (this.tileH-lh),
                    -lw, lh);
            }
        }
        // Top empty
        if (empty[3]) {

            c.setColor(0.50, 0.50, 0.50);
            c.fillShape(Shape.Rect,
                x * this.tileW , 
                y * this.tileH,
                this.tileW, lh);

            // Left empty
            if (empty[2]) {

                c.setColor(0.85, 0.85, 0.85);
                c.fillShape(Shape.RAngledTriangle,
                    x * this.tileW , 
                    y * this.tileH,
                    lw, lh);
            }
            // Right empty
            if (empty[0]) {

                c.setColor(0.67, 0.67, 0.67);
                c.fillShape(Shape.RAngledTriangle,
                    x * this.tileW + (this.tileW-lw), 
                    y * this.tileH,
                    -lw, lh);
            }
        }
    }


    //
    // Draw a piece of floor
    //
    drawFloorPiece(c, x, y) {

        /*
        if (x % 2 == y % 2) {

            c.setColor(0.67, 0.67, 0.67);
        }
        else {

            c.setColor(0.75, 0.75, 0.75);
        }
        */
        c.setColor(0.8, 0.8, 1.0);
        c.fillShape(Shape.Rect,
            x * this.tileW, y * this.tileH,
            this.tileW, this.tileH);
    }


    //
    // Draw tiles
    //
    drawTiles(c) {

        let t = 0;
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
                    this.drawFloorPiece(c, x, y);
                    break;
                }
            }
        }
    }
}
