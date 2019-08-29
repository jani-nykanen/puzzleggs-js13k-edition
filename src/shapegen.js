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
    regPoly(n) {

        let step = Math.PI * 2 / n;
        let angle = 0;

        let vertices = new Array();
        let indices = new Array();

        // Compute vertices
        for (let i = 0; i < n; ++ i) {

            angle = step * i;
            vertices.push(
                0, 0,
                Math.cos(angle), Math.sin(angle),
                Math.cos(angle + step), Math.sin(angle + step)
            );
        }

        // Compute indices
        for (let i = 0; i < n * 3; ++ i) {

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
