//
// A simple matrix library for 2D operations
// (c) 2019 Jani Nykänen
//


export class Matrix3 {

    //
    // Constructor
    //
    constructor() {

        this.m = new Float32Array(3*3);
        this.identity();
    }


    //
    // Zeroes
    //
    zeroes() {

        for (let y = 0; y < 3; ++ y) {

            for (let x = 0; x < 3; ++ x) {
    
                this.m[y*3 + x] = 0;
            }
        }
    }


    //
    // Set to an identity matrix
    //
    identity() {

        for (let y = 0; y < 3; ++ y) {

            for (let x = 0; x < 3; ++ x) {
    
                this.m[y*3 + x] = y == x ? 1 : 0;
            }
        }
    }


    //
    // Multiply
    // 
    multiply(M) {

        let out = new Matrix3();
        out.zeroes();

        // Row
        for (let i = 0; i < 3; ++ i) {

            // Column
            for (let j = 0; j < 3; ++ j) {

                for(let k = 0; k < 3; ++ k) {

                    out.m[i*3 + j] += this.m[i*3 + k] * M.m[k*3 + j];
                }
            }
        }
        return out;
    }


    //
    // Set to a translation matrix
    //
    translate(x, y) {

        this.identity();
        this.m[2] = x;
        this.m[3 + 2] = y;
    }


    //
    // Set to a scaling matrix
    //
    scale(x, y) {

        this.identity();
        this.m[0] = x;
        this.m[3 + 1] = y;
    }


    //
    // Set to a rotation matrix
    //
    rotate(angle) {

        let c = Math.cos(angle);
        let s = Math.sin(angle);

        this.identity();

        this.m[0] = c; 
        this.m[1] = -s; 
        this.m[3] = s;
        this.m[4] = c;
    }


    // 
    // Set to the 2D ortho matrix
    //
    ortho2D(left, right, bottom, top) {

        this.identity();

        this.m[0] = 2 / (right - left);
        this.m[2] = -(right + left) / (right - left);

        this.m[3 + 1] = 2 / (bottom - top);
        this.m[3 + 2] = -(bottom + top) / (bottom - top);

        this.m[6 + 2] = 1;
    }


    //
    // Transpose
    //
    transpose() {

        let out = new Matrix3();

        for (let i = 0; i < 3; ++ i) {

            for (let j = 0; j < 3; ++ j) {

                out.m[j*3 + i] = this.m[i*3 + j];
            }
        }
        return out;
    }


    //
    // Clone
    //
    clone() {

        let out = new Matrix3();
        for (let i = 0; i < 9; ++i)
            out.m[i] = this.m[i];

        return out;
    }

}
