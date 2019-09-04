import { Mesh } from "./mesh.js";

//
// Shape generator
// (c) 2019 Jani Nykänen
//


export class ShapeGen {


    //
    // Constructor
    //
    constructor(gl) {

        this.gl = gl;
    }


    //
    // Generate a rectangle mesh
    //
    rect() {

        return new Mesh(
            this.gl, 
            [0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,], 
            [0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,], 
            [0,1,2, 
            2,3,0,]
        );
    }


    //
    // Generate a regular polygon
    //
    regPoly(n, m, jump, jumpHeight, min) {

        m = m != null ? Math.min(m, n) : n;

        let step = Math.PI * 2 / n;
        let angle = 0;

        let vertices = new Array();
        let indices = new Array();

        let jumpCount = 0;
        let jumpMode = false;
        let r = 1;

        // Compute vertices
        for (let i = 0; i < m; ++ i) {

            if (jump && ++ jumpCount >= jump) {

                jumpMode = !jumpMode;
                r = jumpMode ? 1 + jumpHeight : 1;

                jumpCount -= jump;
            }

            angle = step * i;

            // Leave hole inside
            if (min) {

                vertices.push(
                    min * Math.cos(angle), min * Math.sin(angle),
                    Math.cos(angle) * r, Math.sin(angle) * r,
                    Math.cos(angle + step) * r, Math.sin(angle + step)* r
                );

                vertices.push(
                    min * Math.cos(angle), min * Math.sin(angle),
                    min * Math.cos(angle+ step), min * Math.sin(angle+ step),
                    Math.cos(angle + step) * r, Math.sin(angle + step)* r
                );
            }
            else {

                vertices.push(
                    0, 0,
                    Math.cos(angle) * r, Math.sin(angle) * r,
                    Math.cos(angle + step) * r, Math.sin(angle + step)* r
                );
            }
        }

        // Compute indices
        let end = m * 3;
        if (min) end *= 2;
        for (let i = 0; i < end; ++ i) {

            indices.push(i);
        }

        return new Mesh(
            this.gl,
            vertices, vertices, indices
        );
    }


    //
    // Generate a filled shape of a curve
    //
    filledCurve(x, n, l) {

        if (l == null)
            l = Math.PI * 2;

        let step = l / n;

        let vertices = new Array();
        let indices = new Array();

        // Compute vertices
        let p1, p2;
        for (let i = 0; i < n; ++ i) {

            p1 = x(step * i);
            p2 = x(step * (i+1));
            vertices.push(
                p1[0], p1[1],
                p2[0], p2[1],
                0, 0
            );
        }

        // Compute indices
        let end = n * 3;
        for (let i = 0; i < end; ++ i) {

            indices.push(i);
        }

        return new Mesh(
            this.gl,
            vertices, vertices, indices
        );
    }


    //
    // Generate a right-angled triangle
    //
    rightAngledTriangle() {

        return new Mesh(
            this.gl, 
            [0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0], 
            [0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0], 
            [0,1,2]
        );
    }


    //
    // Generate a equilateral triangle
    //
    equilTriangle() {

        return new Mesh(
            this.gl, 
            [0.0, -1.0,
            0.71, 0.71,
            -0.71, 0.71], 

            [0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0], 

            [0,1,2]
        );
    }


    //
    // Generate a star
    //
    star(n, jump) {

        n *= 2;

        let step = Math.PI * 2 / n;

        let vertices = new Array();
        let indices = new Array();

        let r1, r2;

        // Compute vertices
        for (let i = 0; i < n; ++ i) {

            r1 = i % 2 == 0 ? 1 : 1 + jump;
            r2 = i % 2 == 0 ? 1 + jump : 1;

            vertices.push(
                Math.cos(step * i) * r1, Math.sin(step * i) *  r1,
                Math.cos(step * (i+1)) * r2, Math.sin(step * (i+1)) * r2,
                0, 0
            );
        }

         // Compute indices
         let end = n * 3;
         for (let i = 0; i < end; ++ i) {
 
             indices.push(i);
         }
 
         return new Mesh(
             this.gl,
             vertices, vertices, indices
         );
    }
}
