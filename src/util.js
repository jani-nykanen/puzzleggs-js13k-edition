//
// Utility functions
// (c) 2019 Jani Nykänen
//



//
// Negative modulo
//
export function negMod(m, n) {

    if(m < 0) {

        return n - (-m % n);
    }
    return m % n;
}


//
// Clamp a number to the range [min, max]
//
export function clamp(x, min, max) {

    return Math.max(min, Math.min(x, max));
}


//
// Toggle fullscreen
//
export function toggleFullscreen(canvas) {

    // console.log("No.");

    if(document.webkitIsFullScreen || 
        document.mozFullScreen) {

        if(document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        
        else if(document.mozCancelFullScreen)
            document.mozCancelFullScreen();

        else if(document.exitFullscreen)
            document.exitFullscreen();    
    }
    else {

        if(canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();

        else if(canvas.requestFullscreen) 
            canvas.requestFullscreen();

        else if(canvas.mozRequestFullScreen) 
            canvas.mozRequestFullScreen();
        
    }
}
