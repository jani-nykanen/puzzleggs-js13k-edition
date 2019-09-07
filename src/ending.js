import { Action, State } from "./input.js";

//
// Ending scene
// (c) 2019 Jani Nykänen
// 


// Local constants
const ENDING_TEXT = 
`Congratulations!
      
You managed to save
all your precious
eggs - the children
unborn! Now you can
go back home...
      
...and eat 'em all!
`;


//
// Ending scene class
//
export class Ending {


    //
    // Constructor
    //
    constructor(ev) {

        const WAIT = 300;

        this.charIndex = 0;
        this.charWait = 0;
        this.wave = 0.0;
        this.phase = 0;

        this.waitTime = WAIT;
    }


    //
    // Update scene
    //
    update(ev) {

        const CHAR_TIME = 5;
        const WAVE_SPEED = 0.025;

        // Update wave
        this.wave = (this.wave + WAVE_SPEED) % (Math.PI*2);

        if (this.phase == 1) return;

        // Update character index (unless in the end
        // of the string already)
        if (this.charIndex < ENDING_TEXT.length) {

            if ((this.charWait -= ev.step) <= 0) {

                this.charWait += CHAR_TIME;
                ++ this.charIndex;
            }
        }
        else {

            if (!ev.tr.active && ( (this.waitTime -= ev.step) <= 0 ||
                ev.input.getKey(Action.Start) == State.Pressed)) {

                ev.tr.activate(true, 1.0,
                    0,0,0, () => {++ this.phase;});
            }
        }     

    }


    //
    // Draw scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;
        const FONT_SIZE = [48, 96] [this.phase];
        const FONT_OFF = [-24, -20] [this.phase];
        const AMPLUTIDE = 3.0;
        const PERIOD = Math.PI*2 / ([8, 4] [this.phase]);

        if (this.phase == 0)
            c.clear(1, 1, 1);
        else
            c.clear(0, 0, 0);

        // Reset view
        c.loadIdentity();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        let mx = c.viewport.x / 2;
        let my = c.viewport.y / 2 - FONT_SIZE/2;

        if (this.phase == 0) {

            mx -= 27 * (FONT_SIZE+FONT_OFF) / 2;
            my -= 8*FONT_SIZE/2;
        }
        let str = 
            this.phase == 0 ? ENDING_TEXT.substr(0, this.charIndex) : "The End";

        c.setColor(1, 1, 0.5);
        c.drawScaledText(
            str, 
            mx, my, FONT_OFF, 0, 
            FONT_SIZE, FONT_SIZE, this.phase == 1,
            PERIOD, AMPLUTIDE, this.wave);
    }

}
