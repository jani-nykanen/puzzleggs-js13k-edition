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
go home and...
      
...eat 'em all!
`;


//
// Ending scene class
//
export class Ending {


    //
    // Constructor
    //
    constructor(ev) {

        this.charIndex = 0;
        this.charWait = 0;
    }


    //
    // Update scene
    //
    update(ev) {

        const CHAR_TIME = 5;
        if (this.charIndex < ENDING_TEXT.length &&
            (this.charWait -= ev.step) <= 0) {

            this.charWait += CHAR_TIME;
            ++ this.charIndex;
        }

    }


    //
    // Draw scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;
        const FONT_SIZE = 48;
        const FONT_OFF = -24;

        c.clear(1, 1, 1);

        // Reset view
        c.loadIdentity();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        let mx = c.viewport.x / 2 - 
            27 * (FONT_SIZE+FONT_OFF) / 2;
        let my = c.viewport.y / 2;

        c.setColor(1, 1, 0.5);
        c.drawScaledText(ENDING_TEXT.substr(0, this.charIndex), 
            mx, my- 9*FONT_SIZE/2, FONT_OFF, 0, 
            FONT_SIZE, FONT_SIZE);
    }

}
