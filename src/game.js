import { Shape } from "./canvas.js";
import { Stage, Tile } from "./stage.js";
import { ObjectManager } from "./objects.js";
import { MOVE_TIME } from "./movable.js";
import { Transition } from "./transition.js";
import { Action, State } from "./input.js";
import { negMod, clamp } from "./util.js";
import { ShapeRenderer } from "./shaperenderer.js";
import { Menu, Button } from "./menu.js";
import { MapData } from "./mapdata.js";
import { PasswordGen } from "./passwordgen.js";

//
// Game scene
// (c) 2019 Jani Nykänen
//


// Background color
export const BG_COLOR = [0.33, 0.67, 1.00];

// Local constants
const KEY_APPEAR_TIME = 30;
const INITIAL_MESSAGE_TIME = 120;


//
// Game scene class
//
export class Game {


    //
    // Constructor
    // 
    constructor(ev) {

        this.id = 1;

        // Password stuff
        this.pgen = new PasswordGen();
        this.pword = "";

        // "Restart"
        this.objMan = null;
        this.stage = null;
        this.restart();

        // Cog angle
        this.cogAngle = 0.0;
        // Floating text value
        this.textFloatValue = 0.0;

        // Local transition manager
        this.localTr = new Transition();
        this.localTr.activate(false, 1.0, ...BG_COLOR);

        // Is stuck
        this.stuck = 0;
        // Stuck wave
        this.stuckWave = 0.0;

        // Shape renderer
        this.srend = new ShapeRenderer();

        // Old key count & appearance timer
        this.oldKeyCount = 0;
        this.keyAppearTimer = 0;
        this.appearDir = 0;

        // Pause menu
        this.pauseMenu = new Menu();
        this.paused = false;

        // Add menu buttons
        this.pauseMenu.addButton(
            new Button("Resume", () => {this.paused = false;}),
            new Button("Restart", () => {
                this.paused = false;
                this.restartTransition();
            }),
            new Button("Quit", () => {

                ev.tr.activate(true, 2.0, ...BG_COLOR,
                    () => {ev.changeScene("title", 1);}
                );
            }),
        );

        // Initial message timer
        this.msgTimer = INITIAL_MESSAGE_TIME;
    }


    //
    // Restart stage
    //
    restart(id) {

        if (id != null && id > 0)
            this.id = id;

        // Generate password
        this.pword = this.pgen.genPassword(this.id);

        // (Re)create an object manager
        this.objMan = new ObjectManager();
        // (Re)create a stage
        this.stage = new Stage(this.id, this.objMan);
    }


    //
    // Set restart transitoin
    //
    restartTransition(stuck, ev) {

        const STUCK_DELAY = 30;

        if (stuck == 2) {

            ++ this.id;
            if (this.id > MapData.length) {

                ev.tr.activate(true, 0.5, 1, 1, 1,
                    () => {

                        ev.changeScene("ending");
                    });

                return;
            }
        }
        
        this.localTr.activate(
            true, stuck ? (3.0-stuck) : 2, 
            ...BG_COLOR, () => 
                {this.restart();
                },
            STUCK_DELAY * stuck
        );

        this.stuck = stuck;
    }


    //
    // Update the game scene
    //
    update(ev) {

        const COG_SPEED = Math.PI/2.0 / MOVE_TIME;
        const FLOAT_SPEED = 0.05;
        const STUCK_WAVE_SPEED = 0.025;

        // Update message timer
        if (this.msgTimer >= 0) {

            this.msgTimer -= ev.step;
        }

        if (ev.tr.active) return;
        

        // Update floating text
        this.textFloatValue += FLOAT_SPEED * ev.step;
        
        // Update pause menu (and nothing else!)
        if (this.paused) {

            this.pauseMenu.update(ev);
            return;
        }

        if (this.objMan.isActive() ||
            this.localTr.active) {

            // Update cog angle
            this.cogAngle = negMod(
                this.cogAngle + COG_SPEED * 
                (this.localTr.active ? -1 : 1) * ev.step ,
                (Math.PI / 2));
        }
        else {

            this.cogAngle = 0;
        }

        if (this.msgTimer >= 60.0) {

            return;
        }

        // Update local transition, if active
        if (this.localTr.active) {

            if (this.stuck > 0) {

                this.stuckWave = 
                    (this.stuckWave + STUCK_WAVE_SPEED*ev.step) % 
                    (Math.PI*2);
            }

            this.localTr.update(ev);
            return;
        }
        this.msgTimer = -1; // Just in case

        // Check if enter pressed for pausing the game
        if (ev.input.getKey(Action.Start) == State.Pressed) {

            this.paused = true;
            this.pauseMenu.cursorPos = 0;
            return;
        }

        // Update key appearing timer
        if (this.appearDir != 0 && 
            ( (this.keyAppearTimer -= ev.step) <= 0)) {

            this.appearDir = 0;
            this.keyAppearTimer = 0.0;
        }

        // Update stage
        this.stage.update(this.objMan.eggsCollected(), ev);

        // Update objects
        this.objMan.update(this.stage, this, ev);

        // Go to the next stage, if stage finished
        if (this.objMan.stageFinished()) {

            this.restartTransition(2, ev);
            return;
        }

        // Check restart key
        if (ev.input.getKey(Action.Reset) == State.Pressed) {

            this.restartTransition();
        }
    }


    //
    // Draw a single cog
    //
    drawCog(c, dx, dy, r, outline, angle, sx, sy, salpha) {

        const COLOR_OUTLINE = [0.5, 0.5, 0.5];
        const COLOR_BASE = [0.75, 0.75, 0.75];

        // Draw shadow
        if (sx != null) {

            c.push();
            c.translate(dx + sx, dy + sy);
            c.rotate(angle);
            c.useTransform();

            c.setColor(0, 0, 0, salpha);
            c.fillShape(Shape.Cog, 0, 0, r, r);

            c.pop();
        }

        // Draw the actual cog
        c.push();
        c.translate(dx, dy);
        c.rotate(angle);
        c.useTransform();

        // Draw base color
        c.setColor(...COLOR_OUTLINE);
        c.fillShape(Shape.Cog, 0, 0, r, r);

        // Draw base color
        c.setColor(...COLOR_BASE);
        c.fillShape(Shape.Cog, 0, 0, r - outline, r - outline);

        c.pop();
    }


    //
    // Draw cogs
    //
    drawCogs(c) {

        // Top-left corner
        this.drawCog(c, 0, 0, 128, 8, 
                this.cogAngle,
                16, 8, 0.25);

        // Top-right corner
        this.drawCog(c, c.viewport.x, 0, 96, 8, 
            -this.cogAngle,
            16, 8, 0.25);

        // Bottom-left corner
        this.drawCog(c, 0, c.viewport.y, 
            96, 8, 
            -this.cogAngle,
            16, 8, 0.25);

        // Bottom-right corner
        this.drawCog(c, c.viewport.x, c.viewport.y, 
            128, 8, 
            this.cogAngle,
            16, 8, 0.25);
    }


    //
    // Draw stage info
    //
    drawStageInfo(c) {

        const TEXT = 
            ["STAGE " + String(Math.min(MapData.length ,this.id)), 
            "Password: " + this.pword];

        const POS_Y = 4;

        const FONT_SIZE = [64, 48];
        const AMPLITUDE = [6.0, 4.0];
        const PERIOD = [Math.PI/3, Math.PI/6];

        const SHADOW_ALPHA = 0.25;
        const SHADOW_OFF = [6, 4];

        const COLOR = [1, 1, 0.5];

        c.toggleTexturing(true);

        // Draw stage text
        let y, top;
        for (let j = 0; j < 2; ++ j) {

            // F**king beautiful, isn't it
            top = (this.stuck == 2 && this.localTr.active) ? 
                (Math.max(this.localTr.getScaledTime(), 
                    this.localTr.getScaledDelayTime()) * 
                (AMPLITUDE[j] + FONT_SIZE[j])) : 0;

            if (j == 0)
                y = POS_Y + Tile.Height/2;
            else
                y = c.viewport.y - POS_Y - Tile.Height/2;

            y -= FONT_SIZE[j]/2;
            y -= (1 - 2*j) * top;

            c.drawScaledText(TEXT[j], 
                c.viewport.x/2, y,
                -16, 0, 
                FONT_SIZE[j], FONT_SIZE[j], true, 
                PERIOD[j], AMPLITUDE[j],
                this.textFloatValue,
                SHADOW_OFF[j], SHADOW_ALPHA, COLOR);
        }
    }


    //
    // Draw stuck text
    //
    drawStuck(c) {

        const FONT_SCALE = [88, 72] [this.stuck -1];
        const OFFSET = [72, 56] [this.stuck -1];
        const STR = ["STUCK", "STAGE CLEAR"] [this.stuck -1];
        const MOVE = 64;
        const WAVE_AMPLITUDE = -16;
        const COLOR = [ [1, 0.4, 0.0], [1, 1, 0.5]] [this.stuck -1];
        const SHADOW_OFF = 8;
        const SHADOW_ALPHA = 0.25;

        let mx = c.viewport.x/2;
        let my = c.viewport.y/2;

        let left = mx - (STR.length-1) * OFFSET / 2; 

        c.toggleTexturing(true);

        let t = this.localTr.getScaledTime();
        if (this.localTr.fadeIn) {

            t = this.localTr.getScaledDelayTime();;
        }
        
        let p = 0;
        let d = 1.0/STR.length;
        let y;
        
        for (let i = 0; i < STR.length; ++ i) {

            p = (t-d*(this.localTr.fadeIn ? i : (STR.length-1)-i))/d;
            p = clamp(p, 0, 1);
            y = -MOVE + MOVE*p + 
                Math.sin(this.stuckWave + i * Math.PI*2/STR.length) * 
                WAVE_AMPLITUDE;

            c.setGlobalAlpha(p);

            c.drawScaledText(STR.charAt(i), 
                left + i * OFFSET, 
                my - FONT_SCALE/2 + y,
                0, 0, 
                FONT_SCALE, FONT_SCALE, true,
                null, null, null,
                SHADOW_OFF, SHADOW_ALPHA, COLOR);
        }

        c.toggleTexturing(false);
        c.setGlobalAlpha(1);
    }


    //
    // Draw keys
    //
    drawKeys(c) {

        const WIDTH = 128;
        const HEIGHT = 128;

        let sx = WIDTH / Tile.Width;
        let sy = HEIGHT / Tile.Height;

        let dx = 64;
        let dy = c.viewport.y / 3;
        let n =  this.objMan.getPlayerKeyCount();
        
        // If key count changed, appearing time!
        if (n != this.oldKeyCount && 
            this.appearDir == 0) {

            this.appearDir = n < this.oldKeyCount ? -1 : 1;
            this.keyAppearTimer = KEY_APPEAR_TIME;
        }
        // Store old key count
        this.oldKeyCount = n;

        // Stop here, if nothing to draw
        if (n <= 0 && this.appearDir == 0) return;

        // Draw one extra key if something is
        // disappearing
        if (this.appearDir == -1)
            ++ n;

        c.toggleTexturing(false);

        // Compute alpha
        let alpha =  1.0;
        if (this.appearDir != 0) {

            alpha = this.keyAppearTimer / KEY_APPEAR_TIME;
            if (this.appearDir == 1)
                alpha = 1.0 - alpha;
        }
        
        // Draw keys
        for (let i = 0; i < n; ++ i) {

            c.setGlobalAlpha(i == n-1 ? alpha : 1);

            this.srend.drawKey(c, 
                dx, dy + i * WIDTH, 0, 
                sx, sy);
        }

        c.setGlobalAlpha(1);
        c.toggleTexturing(true);
   
    }


    //
    // Draw the game scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;
        const SCALE_TARGET = 0.25;
        const VICTORY_SCALE = 8;
        const VICTORY_ANGLE = Math.PI / 3;
        const PAUSE_TEXT_SIZE = 48;
        const STORY_FONT_SCALE = 32;
        const STORY_SCALE = 3;

        c.clear(...BG_COLOR);

        // No textures
        c.toggleTexturing(false);

        // Scale world, maybe
        let s = 1;
        let m = 1;
        let dx = null;
        let dy = null;
        let angle = null;
        if (this.localTr.active) {

            // Set camera zoom target
            if (this.stuck == 2 && this.localTr.fadeIn) {

                dx = this.stage.startPos.x;
                dy = this.stage.startPos.y;   
                m = VICTORY_SCALE;
                angle = -VICTORY_ANGLE * this.localTr.getScaledTime();
            }

            s = this.localTr.getScaledTime();
            s = 1.0 + s * m * SCALE_TARGET* (this.localTr.fadeIn ? 1 : -1);
        }


        this.stage.setStageView(c, s, dx, dy, angle);

        // Draw stage
        this.stage.drawTiles(c, this.objMan.eggsCollected());

        // Draw game objects
        this.objMan.draw(c);

        // Reset view
        c.loadIdentity();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        // Draw local transition
        this.localTr.draw(c);
        if (this.localTr.active && this.stuck > 0) {

            this.drawStuck(c);
        }

        // Draw cogs
        this.drawCogs(c);

        // Draw stage info
        this.drawStageInfo(c);
    
        // Draw keys
        this.drawKeys(c);

        // Draw pause menu
        if (this.paused) {

            this.pauseMenu.draw(c, PAUSE_TEXT_SIZE, 
                [0.33, 0.67, 1.00, 0.75]);
        }

        // Draw "story" message
        if (this.msgTimer > 0.0) {

            // Compute scale
            s = this.msgTimer / INITIAL_MESSAGE_TIME;
            s = 1.0 + STORY_SCALE*s;

            c.setGlobalAlpha(clamp(this.msgTimer/60.0, 0, 1));

            c.drawScaledText("Save the unborn!", 
                c.viewport.x/2, 
                c.viewport.y/2 - STORY_FONT_SCALE*s/2,
                -24, 0, STORY_FONT_SCALE * s, 
                STORY_FONT_SCALE * s, true,
                null, null, null, 
                2*s, 0.25, [1, 0.75, 0.33]);

            c.setGlobalAlpha(1);
        }
    }


    //
    // Called when this scene is made active
    //
    onChange(id) {

        if (id == 0) {
            
            this.msgTimer = INITIAL_MESSAGE_TIME;
            id = 1;
        }
        else
            this.msgTimer = 0;

        this.restart(id);

        // Set initial values
        this.paused = false;
        this.stuck = 0;

        this.localTr.activate(false, 1.0, ...BG_COLOR);
    }
}
