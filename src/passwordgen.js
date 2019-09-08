//
// Password generator
// (c) 2019 Jani Nykänen
//


export class PasswordGen {

    //
    // Constructor
    //
    constructor(a, b) {

        const DEFAULT_A = 5;
        const DEFAULT_B = 7;

        this.a = a == null ? DEFAULT_A : a;
        this.b = b == null ? DEFAULT_B : b;
    }


    //
    // Generate password
    //
    genPassword(i) {

        let m = 50 + ((i/2)|0) * this.a * (1 - 2 * (i % 2)); // ID
        let n = i * this.b; // ID check 1
        let k = (i * 7) % 10; // Remainder
        
        let s1, s2;
        s1 = (m < 10 ? "0" : "") + String(m);
        s2 = (n < 10 ? "0" : "") + String(n);

        return s1 + s2 + String(k);
    }

    
    //
    // Decode password
    //
    decodePassword(s) {

        let m = Number(s.substr(0, 2));
        let n = Number(s.substr(2, 2));
        let k = Number(s.substr(4, 1));

        let i;
        if (m <= 50) {

            i = 1 + (((50-m) / this.a ) | 0)*2;
        }
        else {

            i = (((m-50) / this.a ) | 0)*2;
        }

        // Check the ID check 1 and
        // the remainder
        if ((i != (n / this.b) | 0) ||
            ((i*7) % 10 != k) ) 
            return -1;

        return i;
    }

}
