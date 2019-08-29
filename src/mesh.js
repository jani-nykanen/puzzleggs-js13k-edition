//
// Mesh
// (c) 2019 Jani Nykänen
//


export class Mesh {


    //
    // Constructor
    //
    constructor(gl, vertices, uvs, indices) {

        this.elementCount = indices.length;

        // Create buffers
        this.vertexBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
    
        // Pass data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 
            new Float32Array(vertices),
            gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
                    new Uint16Array(indices),
                    gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 
                new Float32Array(uvs),
                gl.STATIC_DRAW);

    }


    //
    // Bind
    //
    bind(gl) {

        // Bind buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer( 0, 2, gl.FLOAT, gl.FALSE,0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE,0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
    }


    //
    // Draw
    //
    draw(gl) {

        gl.drawElements(gl.TRIANGLES,
            this.elementCount, 
            gl.UNSIGNED_SHORT, 0);
    }
}
