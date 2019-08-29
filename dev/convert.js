

let fs = require('fs');

// Perform RLE
let RLE = (data, layer) => {

    let out = "{w: " + 
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
    out += String(len) + "," + String(d) + "]},";

    return out;
}


let outStr = "export const MapData = [";
// Read files in the map folder
fs.readdir("out", (e, items) => {

    let data, layer;
    for (let i in items) {
        
        data = JSON.parse(fs.readFileSync("out/" + items[i], 'utf8'));
        layer = data.layers[0].data;
    
        outStr += RLE(data, layer);
    }

    outStr += "];";
    // Store output
    fs.writeFile("../src/mapdata.js", outStr, (e) => {});
});


