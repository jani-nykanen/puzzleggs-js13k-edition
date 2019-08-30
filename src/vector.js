//
// Vector types
// (c) 2019 Jani Nykänen
//


//
// 2-component real valued vector
//
export class Vector2 {

    
    //
    // Constructor
    //
    constructor(x,y) {

        this.x = x == null ? 0 : x; 
        this.y = y == null ? 0 : y;
    }

    //
    // Normalize
    //
    normalize() {

        const EPS = 0.001;

        let len = Math.hypot(this.x, this.y);
        if (len < EPS) return;

        this.x /= len;
        this.y /= len;
    }


    //
    // Clone
    //
    clone() { return new Vector2(this.x, this.y); }

}
