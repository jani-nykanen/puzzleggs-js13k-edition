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
