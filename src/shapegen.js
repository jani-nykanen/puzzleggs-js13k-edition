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
        let end = n * 3;
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
}
