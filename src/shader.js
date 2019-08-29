import { Matrix3 } from "./matrix.js";

//
// Shader
// (c) 2019 Jani Nykänen
//


export class Shader {

    //
    // Constructor
    //
    constructor(gl, vertex, frag) {

        // Store reference to the gl context
        this.gl = gl;

        // Shader program
        this.program = null;

        // Let's build some stuff, shall we?
        this.buildShader(vertex, frag);

        //
        // Get uniforms
        //

        // General uniforms
        this.unifTransform = gl.getUniformLocation(this.program, "transform");
        this.unifColor = gl.getUniformLocation(this.program, "color");

        // Texture uniforms
        this.unifTex0 = gl.getUniformLocation(this.program, "t0");

        // Position & size uniforms. Makes 2D rendering much easier
        // (and faster, versus matrix multiplication for, say, every
        //  character in a rendered string)
        this.unifPos = gl.getUniformLocation(this.program, "pos");
        this.unifSize = gl.getUniformLocation(this.program, "size");
        this.unifTexPos = gl.getUniformLocation(this.program, "texPos");
        this.unifTexSize = gl.getUniformLocation(this.program, "texSize");

    }


    //
    // Creates a shader
    //
    createShader(src, type) {

        let gl = this.gl
    
        // Create & compile
        let shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
    
        // Check for errors
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    
            throw "Shader error:\n" + 
                gl.getShaderInfoLog(shader);
                
        }
    
        return shader;
    }


    //
    // Build shader
    //
    buildShader(vertexSrc, fragSrc) {

        let gl = this.gl;
    
        // Create shader components
        let vertex = this.createShader(vertexSrc, gl.VERTEX_SHADER);
        let frag = this.createShader(fragSrc, gl.FRAGMENT_SHADER);
    
        // Create a program
        this.program = gl.createProgram();
        // Attach components
        gl.attachShader(this.program, vertex);
        gl.attachShader(this.program, frag);
    
        // Bind locations
        this.bindLocations();
    
        // Link
        gl.linkProgram(this.program);
    
        // Check for errors
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
    
            throw "Shader error: " + 
                gl.getProgramInfoLog(this.program);
        }
    
    }


    //
    // Bind default locations
    //
    bindLocations() {

        let gl = this.gl;

        gl.bindAttribLocation(this.program, 0, "v");
        gl.bindAttribLocation(this.program, 1, "uvp");
    }


    //
    // Use this shader
    //
    use() {

        let gl = this.gl;
    
        gl.useProgram(this.program);
    
        // Set default uniforms
        gl.uniform1i(this.unifTex0, 0);
        this.setVertexTransform(
            0, 0, 1, 1);
        this.setFragTransform(0, 0, 1, 1);
        this.setMatrixTransform(new Matrix3());
    }


    //
    // Set vertex transform
    //
    setVertexTransform(x, y, w, h) {

        let gl = this.gl;

        gl.uniform2f(this.unifPos, x, y);
        gl.uniform2f(this.unifSize, w, h);
    }


    //
    // Set fragment transform
    //
    setFragTransform(x, y, w, h) {

        let gl = this.gl;

        gl.uniform2f(this.unifTexPos, x, y);
        gl.uniform2f(this.unifTexSize, w, h);
    }


    //
    // Set color uniform
    //
    setColor(r, g, b, a) {

        let gl = this.gl;
        gl.uniform4f(this.unifColor, r, g, b, a);
    }
    

    //
    // Set matrix uniform
    //
    setMatrixTransform(mat) {

        let gl = this.gl;

        gl.uniformMatrix3fv(this.unifTransform, 
            false, mat.transpose().m);
    }
}
