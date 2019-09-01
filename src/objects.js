import { Player } from "./player.js";
import { Egg } from "./egg.js";
import { Star } from "./star.js";

//
// Game object manager
//


export class ObjectManager {


    //
    // Constructor
    //
    constructor() {

        const STAR_COUNT = 16;

        this.player = null;
        this.eggs = [];
        this.eggFollowers = [];

        this.stars = new Array(STAR_COUNT);
        for (let i = 0; i < this.stars.length; ++ i) {

            this.stars[i] = new Star();
        }
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
    // Create a star
    //
    createStar(x, y, sx, sy, scale, ts, col) {

        let s;
        for (let i = 0; i < this.stars.length; ++ i) {

            if (!((s = this.stars[i]).exist) ) {

                s.createSelf(x, y, sx, sy, scale, ts, col);
                return;
            }
        }
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
                this.player, this.eggFollowers,
                this);
        }

        // Update stars
        for (let i = 0; i < this.stars.length; ++ i) {

            this.stars[i].update(ev);
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

        // Draw stars
        for (let i = 0; i < this.stars.length; ++ i) {

            this.stars[i].draw(c);
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
