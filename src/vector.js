//
// Vector types
// (c) 2019 Jani Nykänen
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


export class Vector3 {

    
    //
    // Constructor
    //
    constructor(x, y, z) {

        this.x = x == null ? 0 : x; 
        this.y = y == null ? 0 : y;
        this.z = z == null ? 0 : z;
    }


    //
    // Normalize
    //
    normalize() {

        const EPS = 0.001;

        let len = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        if (len < EPS) return;

        this.x /= len;
        this.y /= len;
        this.z /= len;
    }


    //
    // Clone
    //
    clone() { return new Vector3(this.x, this.y, this.z); }

}
