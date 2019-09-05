import { Movable, MOVE_TIME } from "./movable.js";
import { Tile } from "./stage.js";
import { Shape } from "./canvas.js";

//
// Mo... mo... monster!
// (c) 2019 Jani Nykänen
//


export class Monster extends Movable {


    //
    // Constructor
    //
    constructor(x, y, dir) {

        super(x, y);
        this.dir = dir;

        // To make this other than null,
        // the moving timer is not changed
        // when the frame is updated
        this.follow = 1;
        
    }


    // 
    // Find target
    //
    findTarget(stage) {

        const DIR_X = [0, 1, 0, -1];
        const DIR_Y = [-1, 0, 1, 0];
        const NEXT_DIR = [2, 3, 0, 1];

        let tx = this.pos.x;
        let ty = this.pos.y;

        tx += DIR_X[this.dir];
        ty += DIR_Y[this.dir];

        let d;
        if (stage.isSolid(tx, ty)) {

            d = NEXT_DIR[this.dir];
            tx = this.pos.x + DIR_X[d];
            ty = this.pos.y + DIR_Y[d];

            if (stage.isSolid(tx, ty))
                return;
            this.dir = d;
        }

        this.target.x = tx;
        this.target.y = ty;
        this.moving = true;

        stage.updateSolid(this.pos.x, this.pos.y, 0);
    }


    //
    // Update
    //
    update(pl, stage, ev) {
    
        if (this.moving && 
            stage.isSolid(this.target.x, this.target.y)) {

            this.moving = false;
            this.target = this.pos.clone();
        }

        // Move
        this.moveTimer = pl.moveTimer;
        this.move(ev);

        if (!this.moving) {

            stage.updateSolid(this.pos.x, this.pos.y, 2);

            if (pl.moving)
                this.findTarget(stage);
        }

        
        

        // ...
        
    }


    //
    // Draw
    //
    draw(c) {

        const MIN_ANGLE = Math.PI / 16.0;
        const MAX_ANGLE = Math.PI / 3.0;
        const RADIUS = 24;
        const OUTLINE = 3;

        let t = this.moveTimer / MOVE_TIME;
        let angle = MIN_ANGLE + (MAX_ANGLE-MIN_ANGLE)*Math.abs(t-0.5);

        c.push();
        c.translate(this.rpos.x + Tile.Width/2, 
            this.rpos.y + Tile.Height/2 );
        c.rotate(Math.PI / 2 * (this.dir-1));
        c.useTransform();

        c.setColor(1, 0, 0);

        for (let j = 1; j >= 0; -- j) {

            if (j == 0)
                c.setColor(1, 0, 0);
            else
                c.setColor(0, 0, 0);

            for (let i = 0; i < 2; ++ i) {

                c.push();
                c.rotate(angle * (1 - 2*i));
                c.useTransform();
                c.fillShape(Shape.HalfCircle, 
                    -RADIUS*i - OUTLINE*j*i, -RADIUS*i - OUTLINE*j*i, 
                    RADIUS-2*RADIUS*i + OUTLINE*j * (1-2*i), 
                    RADIUS-2*RADIUS*i + OUTLINE*j * (1-2*i));
                c.pop();
            }
        }

        c.pop();
    }
}
