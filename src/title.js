import { Menu, Button } from "./menu.js";
import { BG_COLOR } from "./game.js";
import { State, Action } from "./input.js";
import { PasswordGen } from "./passwordgen.js";
import { Shape } from "./canvas.js";
import { Bitmap } from "./bitmap.js";

//
// Title screen scene
// (c) 2019 Jani Nykänen
//


export class TitleScreen {

    //
    // Constructor
    //
    constructor(ev, c) {

        // Menu
        this.menuShort = new Menu();
        this.menuLong = new Menu();
        // Active menu
        this.menu = this.menuShort;

        // Add buttons
        let buttons = [ 
            new Button("New Game", () => {
                this.errorTimer = 0;
                ev.tr.activate(true, 0.5, ...BG_COLOR,
                () => {
                    ev.tr.speed = 2.0;
                    ev.changeScene("game", 0);
                }
            );
            }),
            new Button("Continue", () => {
                this.errorTimer = 0;
                ev.tr.activate(true, 1.0, ...BG_COLOR,
                    () => {
                        ev.tr.speed = 2.0;
                        ev.changeScene("game");
                    }
                );
                }),
            new Button("Password", 
            () => {
                this.pword = "";
                this.phase = 2;
            }),];
        this.menuShort.addButton(buttons[0], buttons[2]);
        this.menuLong.addButton(buttons[0], buttons[1], buttons[2]);

        // Phase
        this.phase = 0;
        // Enter wave 
        this.enterWave = 0;

        // Password
        this.pgen = new PasswordGen();
        this.pword = "";

        // Error timer
        this.errorTimer = 0;
        // Wait timer (could use just one timer, true)
        this.waitTimer = 0;

        // Vortex
        this.vortexTimer = 0;
        this.vphase = 0;

        // Scaling
        this.scale = 1.0;
        // Alpha for logo, menu etc
        this.alpha = 1.0;
    
        // Create logo
        this.bmpLogo = this.createLogo(c);
    }


    //
    // Create logo
    //
    createLogo(cn) {

        const W = 1024;
        const H = 256;

        // Create a canvas
        let canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        let c = canvas.getContext("2d");
        c.font = "bold 172px sans-serif";
        
        c.textAlign = "center";

        let x = W/2;
        let y = H/2;

        for (let j = 1; j < 5; ++ j) {

            c.fillStyle = "rgb(170, 85, 0)";
            c.fillText("PUZZLEggs", x+j*2, y+j*2);
            c.fillRect(x - 480 + j*2, y + 16+j*2, 640, 16);
        }
        c.fillStyle = "rgb(255, 255, 85)";
        c.fillText("PUZZLEggs", x, y);

        c.fillRect(x - 480, y + 16, 640, 16);

        // Create texture from the canvas content
        let gl = cn.gl;
        let t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        // Remove canvases
        canvas.remove();

        // Create a font bitmap
        return new Bitmap(t, W, H);
    }


    //
    // Update scene
    //
    update(ev) {

        const ERR_TIME = 120;
        const WAVE_SPEED = 0.05;
        const VORTEX_SPEED = 0.0125;

        let id;
        this.alpha = 1;
        this.scale = 1;

        // Do not check input if transition active
        if (ev.tr.active)  {

            if (ev.tr.fadeIn) {

                this.alpha = 1.0 - ev.tr.getScaledTime();
                this.scale = 1.0 + 9*ev.tr.getScaledTime();
            }
            return;
        }

        // Update vortex
        this.vortexTimer = 
            (this.vortexTimer += VORTEX_SPEED*ev.step);
        if (this.vortexTimer >= 1.0) {

            this.vortexTimer -= 1.0;
            this.vphase = (this.vphase+1) % 2;
        }

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

                        ev.tr.activate(true, 1.0, ...BG_COLOR,
                            () => {
                                ev.tr.speed = 2.0;
                                ev.changeScene("game", id);
                            }
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
    // Draw vortex
    // 
    drawVortex(c) {

        const LOOP = 8;
        const RADIUS = 720.0;

        let mx = c.viewport.x / 2;
        let my = c.viewport.y / 2;
        
        c.push();
        c.translate(mx, my);
        c.useTransform();

        let t;
        let step = 1.0 / LOOP;
        for (let i = 0; i < LOOP; ++ i) {

            t = 1.0 - ((step * i + this.vortexTimer * step) % 1.0);
            t *= t;

            c.push();
            c.rotate(Math.PI*2 * t * 
                (this.vphase == 0 ? 1 : -1) * (1 - 2* (i % 2)) )  ;
            c.scale(this.scale, this.scale);
            c.useTransform();

            c.setColor(
                BG_COLOR[0] * t, 
                BG_COLOR[1] * t, 
                BG_COLOR[2] * t);

            c.fillShape(Shape.Hexagon, 
                0, 0, 
                t * RADIUS, 
                t * RADIUS);
                
            c.pop();
        }

        c.pop();
    }


    //
    // Draw scene
    //
    draw(c) {

        const VIEW_TARGET = 720.0;
        const TEXT_SCALE = 48;
        const ENTER_SCALE = 64;
        const PW_GUIDE_SCALE = 32;
        const CENTER_SHIFT = 192;
        const COPYRIGHT_SCALE = 32;
        const COPYRIGHT_OFF = -8;
        const SHADOW_OFF_1 = 8;
        const SHADOW_OFF_2 = 4;
        const LOGO_OUTLINE = 4;
        const LOGO_W = 600;
        const LOGO_H = 360;
        const LOGO_Y = -224;

        c.clear(...BG_COLOR);

        let mx = c.viewport.x / 2;
        let my = c.viewport.y / 2;
        let str = "";

        // Reset view
        c.loadIdentity();
        c.fitViewToDimension(c.w, c.h, VIEW_TARGET);
        c.useTransform();

        // Draw background vortex
        c.toggleTexturing(false);
        this.drawVortex(c);
        c.toggleTexturing(true);

        c.setGlobalAlpha(this.alpha);

        // Shift
        c.translate(0, CENTER_SHIFT);
        c.useTransform();

        if (this.phase == 0) {

            c.drawScaledText("Press Enter", mx, my-ENTER_SCALE/2,
                -20, 0, ENTER_SCALE, ENTER_SCALE, true,
                Math.PI*2/6, 8, this.enterWave,
                SHADOW_OFF_1, 0.25, [1, 1, 0.5]);
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

            c.drawScaledText("Enter password and press enter:", 
                mx, my-TEXT_SCALE/2,
                -24, 0, PW_GUIDE_SCALE, PW_GUIDE_SCALE, true,
                null, null, null,
                SHADOW_OFF_2, 0.25, [1, 1, 0.5]);

            c.drawScaledText(str, 
                mx, my-TEXT_SCALE/2 + TEXT_SCALE,
                -20, 0, TEXT_SCALE, TEXT_SCALE, true,
                null, null, null,
                SHADOW_OFF_2, 0.25, [1, 1, 0.5]);    
        }


        // Copyright
        c.loadIdentity();
        c.useTransform();
        c.drawScaledText("(c)2019 Jani Nyk#nen", 
            mx, c.viewport.y-COPYRIGHT_SCALE+COPYRIGHT_OFF,
            -20, 0, COPYRIGHT_SCALE, COPYRIGHT_SCALE, true,
            null, null, null,
            SHADOW_OFF_2, 0.25, [1, 1, 1]);

        // Draw logo
        for (let y = -LOGO_OUTLINE; y <= LOGO_OUTLINE; ++ y) {

            for (let x = -LOGO_OUTLINE; x <= LOGO_OUTLINE; ++ x) {

                if (Math.abs(x) < LOGO_OUTLINE && Math.abs(y) < LOGO_OUTLINE)
                    continue;

                c.setColor(0, 0, 0);
                c.drawScaledBitmap(this.bmpLogo, 
                    mx-LOGO_W/2 + x, my + LOGO_Y + y, 
                    LOGO_W, LOGO_H);
            }
        }

        c.setColor(1, 1, 1);
        c.drawScaledBitmap(this.bmpLogo, 
            mx-LOGO_W/2, my + LOGO_Y, LOGO_W, LOGO_H);

        c.setGlobalAlpha(1);
    }


    //
    // Change event
    //
    onChange(p) {

        this.phase = 1;
        this.errorTimer = 0;
        this.scale = 1;

        if (p != null)
            this.menu = this.menuLong;

        this.menu.cursorPos = (p == null ? 0 : 1);
    }

}
