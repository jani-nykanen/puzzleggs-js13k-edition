import { Player } from "./player.js";

//
// Game object manager
//


export class ObjectManager {


    //
    // Constructor
    //
    constructor() {

        this.player = null;
    }


    //
    // Create player object
    //
    createPlayer(x, y) {

        if (this.player != null) 
            return;

        this.player = new Player(x, y);
    }


    //
    // Update game objects
    //
    update(stage, ev) {

        // Update player
        if (this.player != null) {

            this.player.update(stage, ev);
        }
    }


    //
    // Draw game objects
    //
    draw(c) {

        // Draw player
        if (this.player != null) {
            
            this.player.draw(c);
        }
    }


    //
    // Is something moving etc
    //
    isActive() {

        return this.player.moving;
    }

}
