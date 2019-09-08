import { Menu, Button } from "./menu.js";
import { BG_COLOR } from "./game.js";
import { State, Action } from "./input.js";
import { PasswordGen } from "./passwordgen.js";

//
// Title screen scene
// (c) 2019 Jani Nykänen
//


export class TitleScreen {

    //
    // Constructor
    //
    constructor(ev) {

        // Menu
        this.menu = new Menu();
        this.menu.addButton(
            new Button("New Game", () => {
                ev.tr.activate(true, 2.0, ...BG_COLOR,
                    () => {ev.changeScene("game", 1);}
                );
                }),
            new Button("Password", 
                () => {
                    this.pword = "";
                    this.phase = 2;
                }),
        );

        // Phase
        this.phase = 0;
        // Enter wave 
        this.enterWave = 0;

        // Password
        this.pgen = new PasswordGen();
        this.pword = "";

        // Error timer
        this.errorTimer = 0;
    }


    //
    // Update scene
    //
    update(ev) {

        const ERR_TIME = 120;
        const WAVE_SPEED = 0.05;

        let id;

        if (ev.tr.active) return;

        // Press enter
        if (this.phase == 0) {

            if (ev.input.getKey(Action.Start) == State.Pressed) {

                ++ this.phase;
            }

            // Update wave
            this.enterWave += WAVE_SPEED * ev.step;

        }
        // Main menu
        else if (this.phase == 1) {

            this.menu.update(ev);
            
        }
        // Password
        else if (this.phase == 2) {

            // Check backspace
            if (this.pword.length > 0 && 
                ev.input.getKey(8) == State.Pressed) {

                this.pword = this.pword.substr(0, this.pword.length-1);
            }
            // Check numeric keys
            else if (this.pword.length < 5) {

                for (let i = 48; i <= 57; ++ i) {

                    if (ev.input.getKey(i) == State.Pressed) {

                        this.pword += String(i-48);
                    }
                }
            }

            // Check enter
            if (ev.input.getKey(Action.Start) == State.Pressed) {

                if (this.pword.length == 5) {

                    // Check if proper password
                    id = this.pgen.decodePassword(this.pword);
                    if (id == -1) {

                        this.phase = 1;
                        this.errorTimer = ERR_TIME;
                    }
                    else {

                        ev.tr.activate(true, 2.0, ...BG_COLOR,
                            () => {ev.changeScene("game", id);}
                        );
                    }
                }
                else {

                    this.phase = 1;
                    this.errorTimer = ERR_TIME;
                }
            }
        }

        // Update error timer
        if (this.errorTimer > 0)
            this.errorTimer -= ev.step;
    }


    //
    // Draw scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;
        const TEXT_SCALE = 48;
        const PW_GUIDE_SCALE = 32;
        const CENTER_SHIFT = 128;
        const COPYRIGHT_SCALE = 32;
        const COPYRIGHT_OFF = -8;

        c.clear(...BG_COLOR);

        let mx = c.viewport.x / 2;
        let my = c.viewport.y / 2;
        let str = "";

        // Reset view
        c.loadIdentity();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.translate(0, CENTER_SHIFT);
        c.useTransform();

        if (this.phase == 0) {

            c.setColor(1, 1, 0.5);
            c.drawScaledText("Press Enter", mx, my-TEXT_SCALE/2,
                -20, 0, TEXT_SCALE, TEXT_SCALE, true,
                Math.PI*2/11, 4, this.enterWave);
        }
        else if (this.phase == 1) {

            // Draw menu
            this.menu.draw(c, TEXT_SCALE);

            // Draw error
            if (this.errorTimer > 0) {

                c.setColor(1, 0.5, 0);
                c.drawScaledText("Incorrect password!", 
                    mx, my-TEXT_SCALE*2,
                    -20, 0, PW_GUIDE_SCALE, PW_GUIDE_SCALE, true);
            }
        }
        else if (this.phase == 2) {

            for (let i = 0; i < 5; ++ i) {

                str += i >= this.pword.length ? "_" : this.pword.charAt(i);
            }

            c.setColor(1, 1, 0.5);
            c.drawScaledText("Enter password and press enter:", 
                mx, my-TEXT_SCALE/2,
                -24, 0, PW_GUIDE_SCALE, PW_GUIDE_SCALE, true);

            c.drawScaledText(str, 
                mx, my-TEXT_SCALE/2 + TEXT_SCALE,
                -20, 0, TEXT_SCALE, TEXT_SCALE, true);    
        }


        // Copyright
        c.loadIdentity();
        c.useTransform();
        c.setColor(1, 1, 1);
        c.drawScaledText("(c)2019 Jani Nyk#nen", 
            mx, c.viewport.y-COPYRIGHT_SCALE+COPYRIGHT_OFF,
            -20, 0, COPYRIGHT_SCALE, COPYRIGHT_SCALE, true);
    }


    //
    // Change event
    //
    onChange() {

        this.phase = 1;
        this.menu.cursorPos = 0;
    }

}
