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
        this.world = new Matrix3();
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
    // Rotate model
    //
    rotate(angle) {

        this.op.rotate(angle);
        this.model = this.model.multiply(this.op);

        this.productComputed = false;
    }


    // 
    // Set world transformation
    //
    setWorldTransform(x, y, sx, sy, angle) {

        this.world.identity();
        this.productComputed = false;

        if (x == null) return;

        // Set world transforms in
        // "TRS" order (should be correct?)
        this.world.translate(x, y);
        if (angle != null) {
            this.op.rotate(angle);
            this.world = this.world.multiply(this.op);
        }
        if (sx != null && sy != null) {
            this.op.scale(sx, sy);
            this.world = this.world.multiply(this.op);
        }
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

        //
        // TODO: Vertical aspect ratio?
        //

        let viewW = w/h * d;
        this.setViewport(viewW, d);
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
            this.world.multiply(this.model)
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

        this.stack.push(this.model.clone());
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
