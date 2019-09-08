import { Action, State } from "./input.js";
import { negMod } from "./util.js";
import { Shape } from "./canvas.js";

//
// A simple menu
// (c) 2019 Jani Nykänen
//


//
// Menu button type
// 
export class Button {


    //
    // Constructor
    //
    constructor(text, cb) {

        this.text = text;
        this.cb = cb;
    }
}


//
// Menu type
//
export class Menu {


    //
    // Constructor
    //
    constructor() {

        this.buttons = [];
        this.cursorPos = 0;

        this.maxLen = 0;
    }


    //
    // Add a button
    //
    addButton(b) {

        for (let i = 0; i < arguments.length; ++ i) {

            this.buttons.push(arguments[i]);

            if (arguments[i].text.length > this.maxLen) {

                this.maxLen = arguments[i].text.length;
            }
        }
    }


    //
    // Update menu
    //
    update(ev) {

        // Update cursor position
        let p = 0;
        if (ev.input.getKey(Action.Up) == State.Pressed) {

            -- p;
        }
        else if (ev.input.getKey(Action.Down) == State.Pressed) {

            ++ p;
        }
        this.cursorPos = 
            negMod(this.cursorPos + p, this.buttons.length);

        // Check if enter pressed
        let cb;
        if (ev.input.getKey(Action.Start) == State.Pressed) {

            cb = this.buttons[this.cursorPos].cb;
            if ( (cb = this.buttons[this.cursorPos].cb) != null) {

                cb();
            }
        }
    }


    //
    // Draw
    //
    draw(c, scale, bg) {

        const BUTTON_OFF = scale / 8;
        const TEXT_XOFF = -20;
        const SCALE_PLUS = 0.1;
        const SHADOW_OFF = BUTTON_OFF/2;
        const BG_OFF = BUTTON_OFF*2;
        const COLORS = [[1, 1, 1], [1, 1, 0]];

        let n = this.buttons.length;
        let h = scale + BUTTON_OFF;

        let y = c.viewport.y/2 - (n*h)/2;
        let x = c.viewport.x/2;

        // Draw background, if wanted
        let bx, by, bw, bh;
        if (bg) {

            bw = (this.maxLen+2) * (scale+TEXT_XOFF) + BG_OFF*2;
            bh = (n*h) + BG_OFF*2;

            bx = x - bw/2;
            by = c.viewport.y/2 - bh/2;

            c.toggleTexturing(false);
            c.setColor(...bg);
            c.fillShape(Shape.Rect, bx, by, bw, bh);
            c.toggleTexturing(true);
        }


        // Draw buttons
        let s;
        let col;
        for (let i = 0; i < n; ++ i) {

            if (i == this.cursorPos) {

                s = scale * (1 + SCALE_PLUS);
                col = COLORS[1];
            }
            else {

                s = scale;
                col = COLORS[0];
            }

            c.drawScaledText(this.buttons[i].text,
                x, y + i*h , 
                TEXT_XOFF, 0,
                s, s, true, null, null, null,
                SHADOW_OFF, 0.25, col);
        }

    }
}
