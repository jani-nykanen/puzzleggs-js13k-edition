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
        // For sorthing objects
        this.depthList = [];

        // Egg count
        this.eggCount = 0;
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

        ++ this.eggCount;
    }


    //
    // Create a star
    //
    createStar(x, y, sx, sy, scale, ts, col, depth) {

        let s;
        for (let i = 0; i < this.stars.length; ++ i) {

            if (!((s = this.stars[i]).exist) ) {

                s.createSelf(x, y, sx, sy, scale, ts, col, depth);
                return;
            }
        }
    }


    //
    // Sort objects by depth
    //
    sortObjects() {

        // TODO: Make sure this does not leak memory!

        // Push objects to array
        this.depthList = new Array();
        this.depthList.push(this.player);
        for (let i = 0; i < this.eggs.length; ++ i)
            this.depthList.push(this.eggs[i]);
        for (let i = 0; i < this.stars.length; ++ i) {

            if (this.stars[i].exist) {

                this.depthList.push(this.stars[i]);
            }
        }

        // Sort
        this.depthList.sort((a, b) => { return a.depth - b.depth });
    }


    //
    // Update game objects
    //
    update(stage, game, ev) {

        // Update player
        if (this.player != null) {

            this.player.update(stage, ev);
            if (this.player.isStuck(stage, game)) {

                game.restartTransition(true);
                return;
            }
        }

        // Update eggs
        for (let i = 0; i < this.eggs.length; ++ i) {

            this.eggs[i].update(stage, ev);
            this.eggs[i].playerCollision(
                this.player, this.eggFollowers,
                this, stage);
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

        // Sort objects
        this.sortObjects();
        // Draw sorted objects
        for (let i = 0; i < this.depthList.length; ++ i) {

            this.depthList[i].draw(c);
        }
    }
    

    //
    // Is something moving etc
    //
    isActive() {

        return this.player.moving;
    }


    //
    // Are the eggs collected
    //
    eggsCollected() {

        return this.eggCount == this.player.eggCount;
    }

}
