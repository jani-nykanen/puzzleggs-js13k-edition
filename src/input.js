//
// Input manager
// (c) 2019 Jani Nykänen
//


//
// Button states
//
export const State = {
    Up: 0,
    Down: 1,
    Pressed: 2,
    Released: 3
};


//
// All the buttons we need
//
export const Action = {

    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,

    Run: 16,
    Shoot: 17,
    Activate: 32,

    Start: 13
};


//
// Input manager class
//
export class Input {


    //
    // Constructor
    //
    constructor() {

        this.keys = {};

        // Set listeners
        window.addEventListener("keydown", 
            (e) => {
                e.preventDefault();
                this.keyPressed(e.keyCode)
            });
        window.addEventListener("keyup", 
            (e) => {
                e.preventDefault();
                this.keyReleased(e.keyCode);
            });   
    }


    //
    // Key pressed
    //
    keyPressed(key) {

        if (this.keys[key] != State.Down)
            this.keys[key] = State.Pressed;
    }


    //
    // Key released
    //
    keyReleased(key) {

        if (this.keys[key] != State.Up)
            this.keys[key] = State.Released;
    }


    //
    // Update key data
    //
    update() {

        for (let k in this.keys) {

            if (this.keys[k] == State.Pressed)
                this.keys[k] = State.Down;

            else if(this.keys[k] == State.Released) 
                this.keys[k] = State.Up;
        }
    }


    //
    // Get a key state
    //
    getKey(key) {

        return this.keys[key] | State.Up;
    }

}
