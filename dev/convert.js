

let fs = require('fs');
let data = JSON.parse(fs.readFileSync('out.json', 'utf8'));
let layer = data.layers[0].data;

// Perform RLE
let out = "export const MapData = {w: " + 
    String(data.width) + 
    ", h: " + String(data.height) + 
    ", data: [";
let len = 1;
let d = layer[0];
for (let i = 1; i < layer.length; ++ i) {

    if (layer[i] != d) {

        out += String(len) + "," + String(d) + ",";
        d = layer[i];
        len = 1;
    }
    else {

        ++ len;
    }
}
out += String(len) + "," + String(d) + "]};\n";

// Store output
fs.writeFile("../src/mapdata.js", out, (e) => {});
