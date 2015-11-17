/**
 *  @author John O'Grady
 *  @date 10/11/2015
 *  @note custom class for "encrypting" text using different ciphers
 */

// region static variables
/**
 * @type {string[]}
 */
var alphabet = [
    "a", "b", "c", "d", "e", "f", "g",
    "h", "i", "j", "k", "l", "m", "n", 
    "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z"
];

var alphabetCapital = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z'
];

/**
 * @type {Array}
 */
var alphabetArray = [];
alphabetArray["a"] = 0;
alphabetArray["b"] = 1;
alphabetArray["c"] = 2;
alphabetArray["d"] = 3;
alphabetArray["e"] = 4;
alphabetArray["f"] = 5;
alphabetArray["g"] = 6;
alphabetArray["h"] = 7;
alphabetArray["i"] = 8;
alphabetArray["j"] = 9;
alphabetArray["k"] = 10;
alphabetArray["l"] = 11;
alphabetArray["m"] = 12;
alphabetArray["n"] = 13;
alphabetArray["o"] = 14;
alphabetArray["p"] = 15;
alphabetArray["q"] = 16;
alphabetArray["r"] = 17;
alphabetArray["s"] = 18;
alphabetArray["t"] = 19;
alphabetArray["u"] = 20;
alphabetArray["v"] = 21;
alphabetArray["w"] = 22;
alphabetArray["x"] = 23;
alphabetArray["y"] = 24;
alphabetArray["z"] = 25;

/**
 * @param offset
 */
function offset(offset) {
    this.offset = offset;
}

/**
 * @param string
 * @returns {string}
 */
function caesar(string) {
    var enc = '';
    for(var i = 0; i < string.length; i++ ) {
        if (string.charAt(i).match(/\s|\d|[^a-zA-Z]/)) {
            enc += string.charAt(i);
            continue;
        }
        var charPos = alphabetArray[string.charAt(i)];
        if ((charPos + this.offset) >= alphabet.length) {
            charPos = -(alphabet.length - (charPos));
        }
        enc += alphabet[charPos + this.offset];
    }
    return enc;
}

/**
 * @param string
 * @constructor
 */
var Cipher = function(string) {
    this.string = string;
    this.caesar = caesar;
    this.offset = 3;
};

module.exports = Cipher;
