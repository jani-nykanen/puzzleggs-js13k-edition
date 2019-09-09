import { Input } from "./input.js";
import { Canvas } from "./canvas.js";
import { Transition } from "./transition.js";

//
// Application core
// (c) 2019 Jani Nykänen
//


export class Core {

    //
    // Constructor
    //
    constructor() {

        this.scenes = [];
        this.activeScene = null;

        this.timeSum = 0.0;
        this.oldTime = 0.0;

        this.frameRate = 30;
        this.target = 0;

        // Create "Initializing" text
        this.pInit = document.createTextNode("Initializing...");
        document.body.style.color = "rgb(255, 255, 170)";
        document.body.appendChild(this.pInit);
        
        // Create a canvas
        this.canvas = new Canvas(128, 96);

        // Put event stuff here. Whatever that means,
        // anyway
        this.ev = {

            // Change scene
            changeScene: (n, p) => {this.changeScene(n, p);},

            // References to managers
            input: new Input(this.canvas.canvas),
            tr: new Transition(),

        };

        // Set events
        window.addEventListener("resize", () =>    
            this.canvas.resize(window.innerWidth, 
                window.innerHeight));
    }


    //
    // Main loop
    //
    loop(ts) {

        const MAX_REFRESH = 5;

        this.timeSum += ts - this.oldTime;

        let loopCount = Math.floor(this.timeSum / this.target) | 0;
        let redraw = loopCount > 0;

        // In the case the window becomes inactive, we do not
        // want the game logic update itself for, say, a hundred
        // times
        if (loopCount > MAX_REFRESH) {

            this.timeSum = MAX_REFRESH * this.target;
            loopCount = MAX_REFRESH;
        }

        // Update game logic
        while ( (loopCount --) > 0) {

            // Call user-defined update function
            if (this.activeScene != null && 
                this.activeScene.update != null) {

                this.activeScene.update(this.ev);
            }

            // Update input
            this.ev.input.update();
            // Update transition
            this.ev.tr.update(this.ev);

            this.timeSum -= this.target;
        }

        // Redraw the frame
        if (redraw) {

            // Call user-defined drawing function
            if (this.activeScene != null && 
                this.activeScene.draw != null) {

                this.activeScene.draw(this.canvas);
            }

            // Draw global transition
            this.ev.tr.draw(this.canvas);
        }

        this.oldTime = ts;

        // Next frame
        window.requestAnimationFrame( 
            (ts) => this.loop(ts) 
        );
    }

    
    //
    // Add a scene
    //
    addScene(scene, name, makeActive) {

        this.scenes[name] = scene;
        if (makeActive) {

            this.activeScene = scene;
        }
    }


    // Change a scene
    changeScene(name, param) {

        if (this.scenes[name] != null)
            this.activeScene = this.scenes[name];

        if (this.activeScene.onChange != null)
            this.activeScene.onChange(param);
    }


    //
    // Run
    //
    run(frameRate) {

        this.frameRate = Math.max(30, frameRate);
        this.ev.step = 60.0 / this.frameRate;
        this.target = 1000.0 / this.frameRate;

        this.pInit.remove();
        this.canvas.show();

        this.loop(0);
    }

}
