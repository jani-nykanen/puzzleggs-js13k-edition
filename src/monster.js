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

        // Height timer
        this.heightTimer = Math.random() * Math.PI*2;
        
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
    
        const HEIGHT_MOD_SPEED = 0.025;

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

        // Update height
        this.heightTimer = 
            (this.heightTimer + HEIGHT_MOD_SPEED) % (Math.PI*2);
    }


    //
    // Draw body
    //
    drawBody(c, dx, dy, overrideColor) {

        const MIN_ANGLE = Math.PI / 16.0;
        const MAX_ANGLE = Math.PI / 4.0;
        const RADIUS = 24;
        const OUTLINE = 3;
        const EYE_X = -12;
        const EYE_Y = 10;
        const EYE_RADIUS = 7;
        const REFLECTION_RADIUS = 2.5;
        const REFL_X = [-2, -2, 2, 2] [this.dir];
        const REFL_Y = [2, -2, -2, 2] [this.dir];

        let t = this.moving ? this.moveTimer / MOVE_TIME : 0;
        let mouthAngle = 
            MIN_ANGLE + (MAX_ANGLE-MIN_ANGLE)*(Math.abs(t-0.5)/0.5);
        let swimAngle = Math.sin(t * Math.PI) * Math.PI / 6;
        if (this.pos.x % 2 == this.pos.y % 2)
            swimAngle *= -1;


        c.push();
        c.translate(this.rpos.x + Tile.Width/2 + dx, 
            this.rpos.y + Tile.Height/2 + dy);
        c.rotate(swimAngle + Math.PI / 2 * (this.dir-1));
        c.scale(-1, 1);
        c.useTransform();

        if (overrideColor)
            c.setColor(...overrideColor);

        for (let j = 1; j >= 0; -- j) {

            if (!overrideColor) {

                if (j == 0)
                    c.setColor(0.80, 0.67, 1.0);
                else
                    c.setColor(0, 0, 0);
            }

            for (let i = 0; i < 2; ++ i) {

                // Draw head half
                c.push();
                c.rotate(mouthAngle * (1 - 2*i));
                c.useTransform();

                // Bottom for outline
                if (j == 1) {

                    c.fillShape(Shape.Rect, -RADIUS-OUTLINE, -OUTLINE * (1-i), 
                        RADIUS*2+OUTLINE*2, OUTLINE);
                }

                // Halfed circle
                c.fillShape(Shape.HalfCircle, 
                    -RADIUS*i - OUTLINE*j*i, -RADIUS*i - OUTLINE*j*i, 
                    RADIUS-2*RADIUS*i + OUTLINE*j * (1-2*i), 
                    RADIUS-2*RADIUS*i + OUTLINE*j * (1-2*i));

                c.pop();
            }
        }

        if (!overrideColor) {

            // Draw eyes
            for (let i = 0; i < 2; ++ i) {
                
                c.setColor(0, 0, 0);
                c.fillShape(Shape.Ellipse, 
                    EYE_X, (-1 + i*2)*EYE_Y, 
                    EYE_RADIUS, EYE_RADIUS);

                c.setColor();
                c.fillShape(Shape.Ellipse, 
                    EYE_X + REFL_X, 
                    (-1 + i*2)*EYE_Y + REFL_Y, 
                    REFLECTION_RADIUS,
                    REFLECTION_RADIUS);
            }
        }

        c.pop();
    }


    //
    // Draw
    //
    draw(c) {

        let h = 3 - Math.sin(this.heightTimer);

        this.drawBody(c, 0, 0, [0,0,0]);
        this.drawBody(c, -h, -h);
        
    }
}
