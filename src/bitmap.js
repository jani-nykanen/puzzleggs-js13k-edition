//
// Bitmap (texture, really)
// (c) 2019 Jani Nykänen
//

export class Bitmap {


    //
    // Constructor
    //
    constructor(tex, w, h) {

        this.tex = tex;
        this.w = w;
        this.h = h;
    }


    //
    // Bind
    //
    bind(gl) {

        gl.bindTexture(gl.TEXTURE_2D, this.tex);
    }
}
