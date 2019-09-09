import { Matrix3 } from "./matrix.js";
import { Vector2 } from "./vector.js";

//
// Transformation manager
// (c) 2019 Jani Nykänen
//


export class Transform {

    //
    // Constructor
    //
    constructor() {

        // Matrices
        this.projection = new Matrix3();
        this.model = new Matrix3();
        this.product = new Matrix3();
        this.op = new Matrix3();

        // 2D view size
        this.viewport = new Vector2();

        this.productComputed = false;

        this.activeShader = null;

        // Model stack
        this.stack = [];
    }


    //
    // Translate model
    //
    translate(x, y) {

        this.op.translate(x, y);
        this.model = this.model.multiply(this.op);

        this.productComputed = false;
    }


    //
    // Scale model
    //
    scale(x, y) {

        this.op.scale(x, y);
        this.model = this.model.multiply(this.op);

        this.productComputed = false;
    }


    //
    // Rotate model
    //
    rotate(angle) {

        this.op.rotate(angle);
        this.model = this.model.multiply(this.op);

        this.productComputed = false;
    }


    //
    // Set viewport
    //
    setViewport(w, h) {

        this.projection.ortho2D(0, w, 0, h);

        this.viewport.x = w;
        this.viewport.y = h;

        this.productComputed = false;
    }


    //
    // Fit view to the given dimension 
    //
    fitViewToDimension(w, h, d) {

        if (w/h >= 1.0) {

            this.setViewport( w/h * d, d);
        }
        else {

            this.setViewport( d, h/w * d);
        }
    }


    //
    // Set model transform 
    // to the identity matrix
    //
    loadIdentity() {

        this.model.identity();

        this.productComputed = false;
    }


    //
    // Compute product
    //
    computeProduct() {

        if (this.productComputed)
            return;

        this.product = this.projection.multiply(
            this.model
            );
        this.productComputed = true;
    }


    //
    // Pass transformation data
    //
    useTransform() {

        if (this.activeShader == null)
            return;
        
        this.computeProduct();
        this.activeShader.setMatrixTransform(this.product);
    }


    //
    // Push
    //
    push() {

        const STACK_MAX = 64;

        this.stack.push(this.model.clone());

        // To avoid stack overflows, memory leaks etc.
        if (this.stack.length >= STACK_MAX) {

            throw "Stack overflow!";
        }
    }


    //
    // Pop
    //
    pop() {

        this.model = this.stack.pop().clone();
        this.productComputed = false;
        this.useTransform();
    }

}
