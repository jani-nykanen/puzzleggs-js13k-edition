import { Player } from "./player.js";
import { Egg } from "./egg.js";
import { Star } from "./star.js";
import { Monster } from "./monster.js";

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
        this.monsters = [];
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
    // Create a monster
    //
    createMonster(x, y, dir) {

        this.monsters.push(new Monster(x, y, dir));
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
    // Creates a gol... ehm, star showers.
    // Shower of stars, you know.
    //
    createStarShower(x, y, speed, n, r, d, col) {

        const STAR_GRAV_BONUS = 4.0;

        // Create stars
        let angle = Math.random() * Math.PI * 2;
        let step = Math.PI * 2 / n;    

        for (let i = 0; i < n; ++ i) {

            this.createStar(
                    x, y,
                    Math.cos(angle) * speed, 
                    Math.sin(angle) * speed - STAR_GRAV_BONUS, 
                    r, 1, col, d);

            angle += step;
        }
    }


    //
    // Sort objects by depth
    //
    sortObjects() {

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

            this.player.update(stage, this, ev);
        }

        // Update eggs
        for (let i = 0; i < this.eggs.length; ++ i) {

            this.eggs[i].playerCollision(
                this.player, this.eggFollowers,
                this, stage);
        }
        // We want to update egg in a specific order
        // to make dying work as intended
        for (let i = this.eggFollowers.length-1; i >= 0; -- i ) {
            this.eggFollowers[i].update(stage, ev);
        }

        // Update monsters
        for (let i = 0; i < this.monsters.length; ++ i) {

            this.monsters[i].update(this.player, stage, ev);
        }

        // Check if stuck, or maybe reached the
        // goal tile
        if (this.player != null &&
            !(this.eggsCollected() && 
            this.player.finish(stage, this)) &&
            this.player.isStuck(stage, game)) {
                
            game.restartTransition(1);
            return;
        }

        // Check if eggs are in the goal tile
        // (Have to be done separately than the
        //  basic update)
        for (let i = this.eggFollowers.length-1; i >= 0; -- i ) {

            this.eggFollowers[i].finish(stage, this);
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

        // Draw monsters (no need for sorting)
        for (let i = 0; i < this.monsters.length; ++ i) {

            this.monsters[i].draw(c);
        }

        // Draw sorted objects
        for (let i = 0; i < this.depthList.length; ++ i) {

            this.depthList[i].draw(c);
        }
    }
    

    //
    // Is something moving etc
    //
    isActive() {

        return this.player.moving || 
            this.player.dying || 
            !this.player.exist;
    }


    //
    // Are the eggs collected
    //
    eggsCollected() {

        return this.player.eggCount == this.eggCount;
    }


    //
    // Is the stage finished
    //
    stageFinished() {

        return this.eggFollowers.length > 0 &&
               !this.eggFollowers[0].exist;
    }


    //
    // Get player key count
    //
    getPlayerKeyCount() {

        return this.player.keyCount;
    }

}
