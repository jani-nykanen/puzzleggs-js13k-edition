import { Shader } from "./shader.js";
import { Transform } from "./transform.js";
import { Bitmap } from "./bitmap.js";
import { ShapeGen } from "./shapegen.js";
import { clamp } from "./util.js";

//
// Canvas
// (c) 2019 Jani Nykänen
//


// Shader sources
const VERTEX_SRC = 
`
attribute vec2 v;
attribute vec2 uvp;
   
uniform mat3 transform;

uniform vec2 pos;
uniform vec2 size;

varying vec2 uv;
   
void main() {

    vec3 op = transform * vec3(v * size + pos, 1);
    gl_Position = vec4(op, 1);
    uv = uvp;
}`;

// Fragment sources
const FRAG_SRC_LEFT =
`
precision mediump float;
 
uniform sampler2D t0;
uniform vec4 color;

uniform vec2 texPos;
uniform vec2 texSize;

varying vec2 uv;

void main() {
`;
const FRAG_SRC_RIGHT_NO_TEX =
`
    gl_FragColor = color;
}
`;
const FRAG_SRC_RIGHT_TEX =
`      
    const float DELTA = 0.001;
    vec2 tex = uv;    
    tex.x *= texSize.x;
    tex.y *= texSize.y;
    tex += texPos;
    vec4 res = color * texture2D(t0, tex);
    if(res.a <= DELTA) {
        discard;
    }
    gl_FragColor = res;
}
`;


//
// Shape enums
//
export const Shape = {
    
    Rect: 0,
    RAngledTriangle: 1,
    EquilTriangle: 2,
    Ellipse: 3,
    Cog: 4,
    Egg: 5,
    Star: 6,
    HalfCircle: 7,
    Hexagon: 8,
};


//
// Canvas class
//
export class Canvas extends Transform {


    //
    // Constructor
    //
    constructor() {
        
        super();

        // Create an Html5 canvas and append it
        // to a div

        let cdiv = document.createElement("div");
        cdiv.setAttribute("style", 
            "position: absolute; top: 0; left: 0; z-index: -1");

        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvas.setAttribute(
            "style", 
            "position: absolute; top: 0; left: 0; z-index: -1");
        this.canvas.hidden = true;
        cdiv.appendChild(this.canvas);
        document.body.appendChild(cdiv);

        // Initialize GL
        this.gl = null;
        this.initGL();

        // Create shapes
        this.shapes = null;
        this.createShapes();

        // Build shaders
        this.shaderNoTex= new Shader(this.gl, 
            VERTEX_SRC,
            FRAG_SRC_LEFT + FRAG_SRC_RIGHT_NO_TEX);
        this.shaderTex = new Shader(this.gl, 
            VERTEX_SRC,
            FRAG_SRC_LEFT + FRAG_SRC_RIGHT_TEX);

        this.activeShader = this.shaderTex;
        this.activeShader.use();

        // Generate font
        this.genFont();

        // Bound objects
        this.boundMesh = null;
        this.boundTex = null;

        // Resize now
        this.resize(window.innerWidth, 
            window.innerHeight);

        // Global alpha
        this.globalAlpha = 1.0;
    }


    //
    // Show canvas
    //
    show() {
        
        this.canvas.hidden = false;
    }


    //
    // Create shapes
    //
    createShapes() {

        const CIRCLE_PREC = 32;
        const COG_TOOTH_WAIT = 2;
        const COG_TOOTH = 0.25;
        const EGG_PREC = 24;
        const STAR_JUMP = 1.0;

        // Create shapes
        let sgen = new ShapeGen(this.gl);
        this.shapes = [

            sgen.rect(), // Rectangle
            sgen.rightAngledTriangle(), // Right-angled triangle
            sgen.equilTriangle(), // Equilateral triangle
            sgen.regPoly(CIRCLE_PREC), // Ellipse
            sgen.regPoly(CIRCLE_PREC, 
                null, COG_TOOTH_WAIT, COG_TOOTH, 0.33), // Cog
            sgen.filledCurve(t => 
                [Math.cos( 1.25 * (t-Math.PI)/4) * Math.sin(t-Math.PI), 
                Math.cos(t-Math.PI)], 
                EGG_PREC), // Egg
            sgen.star(5, STAR_JUMP), // Star
            sgen.regPoly(CIRCLE_PREC, CIRCLE_PREC/2), // Half a circle
            sgen.regPoly(6), // Hexagon 
        ];
    }


    // 
    // Initialize OpenGL
    //
    initGL() {

        // Get OpenGL context
        this.gl = this.canvas.getContext("webgl", {alpha:false});
    
        let gl = this.gl;
        if (gl === null) {
    
            throw "Failed to initialize WebGL.";
        }
    
        // Set OpenGL settings
        gl.activeTexture(gl.TEXTURE0);
        gl.disable(gl.DEPTH_TEST);
        gl.enable( gl.BLEND );
        gl.blendFuncSeparate(gl.SRC_ALPHA, 
            gl.ONE_MINUS_SRC_ALPHA, gl.ONE, 
            gl.ONE_MINUS_SRC_ALPHA);

        // Enable attribute arrays
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
    }


    //
    // Generate font texture
    //
    genFont() {

        const OUTLINE = 3;
        const START = 33;
        const END = 123;

        // Create a canvas
        let canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;

        // Draw characters to the canvas
        let c = canvas.getContext("2d");
        c.font = "bold 56px sans-serif";
        
        c.textAlign = "center";
        let x, y;
        let str;
        
        for (let i = START; i < END; ++ i) {

            x = i % 16;
            y = (i / 16) | 0;

            // Black background
            c.fillStyle = "#000000";

            str = String.fromCharCode(i);
            if (i == 35) 
                str = String.fromCharCode(228);
            else if (i == 36) 
                str = String.fromCharCode(169);
            

            for (let m = -OUTLINE; m <= OUTLINE; ++ m) {

                for (let n = -OUTLINE; n <= OUTLINE; ++ n) {

                    if (Math.abs(m) < OUTLINE && Math.abs(n) < OUTLINE) 
                        continue;

                    for (let j = -1; j <= 1; ++ j) {

                        c.fillText(
                            str, 
                            x * 64 + 32 + j + m, y * 64 + 48 + n);
                    }
                }
            }

            // Base color
            c.fillStyle = "#FFFFFF";
            for (let j = -1; j <= 1; ++ j) {

                c.fillText(str, 
                    x * 64 + 32 + j, y * 64 + 48);
            }
        }

        // Create texture from the canvas content
        let gl = this.gl;
        let t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

        // Bye bye canvas
        canvas.remove();

        // Create a font bitmap
        this.bmpFont = new Bitmap(t, 1024, 1024);
    }


    //
    // Resize
    // 
    resize(w, h) {

        this.canvas.width = w;
        this.canvas.height = h;

        // Set viewport
        this.gl.viewport(0, 0, w, h);

        // Store viewport size
        this.w = this.canvas.width;
        this.h = this.canvas.height;

        // Store top-left corner position
        this.top = -1.0;
        this.left = -this.w / this.h;
    }


    //
    // Clear screen with a color
    //
    clear(r, g, b) {

        let gl = this.gl;

        gl.clearColor(r, g, b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }


    //
    // Draw a filled shape
    //
    fillShape(shape, x, y, w, h, col) {

        if (col != null) {
            
            this.activeShader.setColor(
                col[0], col[1], col[2], col[3]);
        }

        // Check if need for flip
        if (w < 0) {

            x -= w;
        }
        if (h < 0) {

            y -= h;
        }

        // Determine shape
        let m = this.shapes[ clamp(shape | 0, 0, this.shapes.length-1) ];

        // Draw mesh to the screen
        this.drawMesh(m, null, 
            x, y, w, h);
    }


    //
    // Draw a scaled bitmap region
    //
    drawScaledBitmapRegion(bmp, sx, sy, sw, sh, dx, dy, dw, dh) {

        this.activeShader.setVertexTransform(dx, dy, dw, dh);
        this.activeShader.setFragTransform(
            sx/bmp.w, sy/bmp.h, 
            sw/bmp.w, sh/bmp.h);

        this.drawMesh(this.shapes[Shape.Rect], bmp);
    }


    //
    // Draw a scaled bitmap
    //
    drawScaledBitmap(bmp, dx, dy, dw, dh) {

        this.drawScaledBitmapRegion(bmp, 
                0, 0, bmp.w, bmp.h,
                dx, dy, dw, dh);
    }


    //
    // Draw scaled text
    //
    drawScaledText(str, dx, dy, xoff, yoff, sx, sy, 
        center, period, amplitude, start,
        shadowOff, alpha, col) {

        let cw = this.bmpFont.w / 16;
        let ch = cw;

        let x = dx;
        let y = dy;
        let c;

        // "Uniform scaling"
        let usx = sx / 64;
        let usy = sy / 64;

        if (center) {

            dx -= (str.length* (cw + xoff) * usx)/ 2.0 ;
            x = dx;
        }

        let jump = 0;   
        
        let loop = shadowOff ? 1 : 0;
        if (shadowOff == null)
            shadowOff = 0;

        for (let j = loop; j >= 0; -- j) {

            x = dx;
            y = dy;

            if (j == 0 && col) 
                this.setColor(...col);
            else if (j == 1)
                this.setColor(0, 0, 0, alpha);

            // Draw every character
            for (let i = 0; i < str.length; ++ i) {

                c = str.charCodeAt(i);
                if (c == '\n'.charCodeAt(0)) {

                    x = dx;
                    y += (ch + yoff) * usy;
                    continue;
                }

                // Make it float
                if (period != null) {

                    jump = Math.sin(start + i * period) * amplitude;
                }
                // Draw current character
                this.drawScaledBitmapRegion(
                    this.bmpFont, 
                    (c % 16) * cw, ((c/16)|0) * ch,
                    cw, ch, 
                    x + shadowOff*j, 
                    y + shadowOff*j + jump, 
                    sx, sy
                );

                x += (cw + xoff) * usx;
            }
        }
    }
    

    //
    // Draw a mesh
    //
    drawMesh(m, tex, x, y, sx, sy) {

        let gl = this.gl;

        if (x != null) {

            this.activeShader.setVertexTransform(
                x, y, sx, sy);
        }

        if (this.boundMesh != m) {

            m.bind(gl);
            this.boundMesh = m;
        }

        if (this.boundTex != tex) {

            tex.bind(gl);
        }

        m.draw(gl);
    }


    //
    // Set global rendering color
    //
    setColor(r, g, b, a) {

        if (r == null) r = 1;
        if (g == null) g = 1;
        if (b == null) b = 1;
        if (a == null) a = 1;

        this.activeShader.setColor(r, g, b, a * this.globalAlpha);
    }


    //
    // Toggle texturing
    //
    toggleTexturing(state) {

        let b = this.activeShader == this.shaderTex;

        this.activeShader = 
            state ? this.shaderTex : this.shaderNoTex;

        this.activeShader.use();
        this.setColor(1, 1, 1, 1);
        this.useTransform();

        return b;
    }


    //
    // Set global alpha
    //
    setGlobalAlpha(a) {

        this.globalAlpha = clamp(a, 0, 1);
    }
}
