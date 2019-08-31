import { Player } from "./player.js";
import { Egg } from "./egg.js";

//
// Game object manager
//


export class ObjectManager {


    //
    // Constructor
    //
    constructor() {

        this.player = null;
        this.eggs = [];
        this.eggFollowers = [];
    }


    //
    // Create a player object
    //
    createPlayer(x, y) {

        if (this.player != null) 
            return;

        this.player = new Player(x, y);
    }


    //
    // Create an egg
    //
    createEgg(x, y) {

        this.eggs.push(new Egg(x, y));
    }

    //
    // Update game objects
    //
    update(stage, ev) {

        // Update player
        if (this.player != null) {

            this.player.update(stage, ev);
        }

        // Update eggs
        for (let i = 0; i < this.eggs.length; ++ i) {

            this.eggs[i].update(stage, ev);
            this.eggs[i].playerCollision(
                this.player, this.eggFollowers);
        }
    }


    //
    // Draw game objects
    //
    draw(c) {

        // Draw eggs
        for (let i = 0; i < this.eggs.length; ++ i) {

            this.eggs[i].draw(c);
        }

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
