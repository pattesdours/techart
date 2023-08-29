/*  
    Color Manipulation JS library
    Non-Adobe ExtendScript JS
    Goal: support basic color conversion operations

    valid forms for hex RGB expressions:
    - "#ff1080" >> "FF1080"
    - "FF1080"  >> "FF1080"
    - "#f18"    >> "FF1188"
    - 0xff1080  >> "FF1080"
    - xf18      >> "FF1188"

    references:
    https://en.wikipedia.org/wiki/HSL_and_HSV
    https://css-tricks.com/converting-color-spaces-in-javascript/

*/


//
//  extending ECMAScript3
//

// 24-bit hexadecimal string to HSL array
//  ("#FF1080").toHSL() == [ 332, 100, 53.1 ];
String.prototype.toHSL = function (a)
{
    if(!this) return ;
    if(!this.length) return;

    var hex = this.trimHexStr();
    var rgbArr = [];
    if(hex.length = 6)
    {
        rgbArr = hex.toFloatRGBarr();
    }
    else
    {
        return;
    }

    var r = rgbArr[0];
    var g = rgbArr[1];
    var b = rgbArr[2];

    var cmin = Math.min(r,g,b);
    var cmax = Math.max(r,g,b);
    var delta = cmax - cmin;

    var h = 0;
    var s = 0;
    var l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    
    h = Math.round(h * 60);
        
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [ h, s, l, a ];
}


// 24-bit hexadecimal string to HSB array
//  ("#FF1080").toHSB() == [ 332, 93.8, 100];
String.prototype.toHSB = function (a)
{
    if(!this) return;
    if(!this.length) return;

    var hex = this.trimHexStr();
    var hslArr = [];
    if(hex.length = 6)
    {
        hslArr = hex.toHSL();
    }
    else
    {
        return;
    }

    var h = hslArr[0];
    var s = hslArr[1] / 100;
    var l = hslArr[2] / 100;

    var nV = l + s * Math.min(l, (1-l));
    var sV = (nV == 0) ? nV : (2 * (1 - (l/nV))); 

    return [ h, sV*100, nV*100 ];
}

// // RGB array to HSL 
Array.prototype.RGBtoHSL = function(isFloat)
{
    if(!this.length) return;
    if(this.length < 3) return;

    var hex = this.RGBarrtoHex();
    var hslArr = hex.toHSL();
    return hslArr;
}

// // RGB array to HSB 
Array.prototype.RGBtoHSB = function(isFloat)
{
    if(!this.length) return;
    if(this.length < 3) return;

    var hex = this.RGBarrtoHex();
    var hsb = hex.toHSB();

    return hsb;
}


if(String.prototype.padStart === undefined)
{
    String.prototype.padStart = function(num, pad)
    {
        if(!num) num = 6;
        if(!pad) pad = " ";
        num = Math.min(num, this.length)
        var padStr = "";
        if(this.length < num)
        {
            for(var i = 0; i < num; i++)
            {
                padStr += pad;
            }
        }
        return padStr + this;
    }
}

// remove white space from either sides of string
String.prototype.trim = function()
{
    return this.replace(/^[\s]+|[\s]+$/g,'');
}

// trim/sanitize hexadecimal RGB string
// remove "#" or "0x" from 24-bit RGB string if present
String.prototype.trimHexStr = function()
{
    var h = this.trim();

    // these methods will work with a strict 6-char form, 
    // however we need more flexibility in accounting with CSS and RGBA conventions 
    //      if(h.charAt(0)=="#") h = h.substring(1,7); 
    //      else if(h.charAt(0)=="0" && h.charAt(1)=="x") h = h.substring(2,8); 

    var hshIdx = h.indexOf("#");
    if(hshIdx > -1) h = h.substring(hshIdx+1, h.length);

    // var num0x = h.indexOf("0x"); // does not account for 
    // if(num0x > -1) h = h.substring(num0x+2, h.length);

    var xIdx = h.toLowerCase().indexOf("x");
    if(xIdx > -1) h = h.substring(xIdx+1, h.length);
    // if(h.match(/0x/i) h = h.substring(2,8)); // simpler but likely costlier?

    // silently handle 24bit numbers expressed with three characters
    // "f18" becomes "ff1188"
    if(h.length == 3)
    {
        var tmpStr = "";
        for(var i = 0; i < h.length; i++)
        {
            tmpStr += (h[i] + "" + h[i]);
        }
        h = tmpStr;
    }
    return h.toUpperCase();
}

// get red value from 24-bit RGB string as integer
String.prototype.RfromHex = function()
{
    var hex = this.trimHexStr();
    var intNum = parseInt(hex.substring(0,2), 16);
    // alert("red: " + intNum);
    // if(intNum.length == 1)
    return intNum;
}

// get green value from 24-bit RGB string as integer
String.prototype.GfromHex = function()
{
    var hex = this.trimHexStr();
    var intNum = parseInt(hex.substring(2,4), 16);
    return intNum;
}

// get blue value from 24-bit RGB string as integer
String.prototype.BfromHex = function()
{
    var hex = this.trimHexStr();
    var intNum = parseInt(hex.substring(4,6), 16);
    return intNum;
}

// Number to 8bit hex: 
// Integer from 0 to 255 
// 128 becomes "80" 
Number.prototype.toHexStr = function()
{
    var num = this.valueOf();
    num = Math.max(0, Math.min(num, 255));
    return ((1<<8)+num).toString(16).toUpperCase().slice(1);
    // return num.toString(16).toUpperCase().padStart(2, "0");
}

// 8bit hex: Array 
// [255, 0, 128] becomes "FF0080" 
// [255, 0, 128, 255] becomes "FF008000" 
Array.prototype.toHexStr = function()
{
    if(!this.length) return;
    var hexStr = "";
    for(var i = 0; i < this.length; i++)
    {
        var num = this[i];
        num = Math.max(0, Math.min(num, 255));
        hexStr += num.toHexStr();
    }
    return hexStr;
}

// RGB values to hexadecimal string: 
// [255, 16, 128] becomes "FF1080"
Array.prototype.RGBarrtoHex = function()
{
    if(!this.length) return;

    var r = this[0];
    var g = this[1];
    var b = this[2];
    var a;
    if(this[3] != undefined) a = this[3];

    // var hexStr = ((r<<16)+(g<<8)+b).toString(16).toUpperCase().padStart(6, "0"); // fails with zeroes!
    var hexStr = ((1<<24)+(r<<16)+(g<<8)+b).toString(16).toUpperCase().slice(1);

    // alpha value is optional
    if(a != undefined) hexStr += Colorlib.intToHex(a);
    return hexStr;
}

// RGB values to hexadecimal string: 
// [1.0, 0.06274509803922, 0.50196078431373] becomes "FF0080"
Array.prototype.RGBfloatArrtoHex = function()
{
    if(!this.length) return;

    var r = Math.round(this[0]*255);
    var g = Math.round(this[1]*255);
    var b = Math.round(this[2]*255);

    var rgb = [r, g, b];

    if(this[3] != undefined)
    {
        var a = Math.round(this[3]*255);
        rgb.push(a);
    }
    return rgb.RGBarrtoHex();
}

// extra challenge: auto-detection of array items: int vs float

// RGB values to hexadecimal string: 
// [1.0, 0.06274509803922, 0.50196078431373] becomes "FF0080"
// ambiguity: [1.0, 1.0, 1.0] and [1, 1, 1] will both be using floats
// if "010101" is the expectation, go with Array.toHex(false)
Array.prototype.toHex = function(isFloat)
{
    if(!this.length) return;

    var r = this[0];
    var g = this[1];
    var b = this[2];
    var a;

    if(this[3] != undefined)
    {
        a = this[3];
    }

    // if no precise instructions given, attempt to guess with a bit of gymnastics
    // possible false positive: if 8-bit RGB is [1, 1, 1]
    // [0, 0, 0] is valid either way
    if(isFloat == undefined) 
    {
        var allOnes = (r == 1 && g == 1 && b == 1);
        var allIntegers = false;
        var allFloats = false;

        // triple zeroes 
        if(r == 0 && g == 0 && b == 0)
        {
            return this.RGBarrtoHex();
        }

        var r_isInt = (parseInt(r) === r);
        var g_isInt = (parseInt(g) === g);
        var b_isInt = (parseInt(b) === b);

        var allIntegers = r_isInt && g_isInt && b_isInt;
        var allFloats = (!r_isInt) && (!g_isInt) && (!b_isInt);

        if(allIntegers && !allOnes)
        {
            return this.RGBarrtoHex();
        }
        else if(allIntegers && allOnes)
        {
                // ambiguous: these two cases will return "010101"
                // manipulating with .toString() and parseFloat() does not seem to help
            // [ 1, 1, 1 ]
            // [ 1.0, 1.0, 1.0 ]

            // we will have to live with the "010101" edge case, and user will have to go Array.toHex(false) in that case
                        return this.RGBfloatArrtoHex();
        }
        else if(allFloats && allOnes)
        {
            return this.RGBfloatArrtoHex();
        }
        else
        {
            return this.RGBfloatArrtoHex();
        }
    }
    // if we are explicitely told what to use, proceed accordingly
    else
    {
        if(isFloat)
        {
            return this.RGBfloatArrtoHex();
        }
        else
        {
            return this.RGBarrtoHex();   
        }
    }
}

// Get array of floats from 24-bit hexadecimal string
// "#FF1080" becomes [ 1.0, 0.06274509803922, 0.50196078431373 ];
//  ("#FF1080").tofloatRGBarr(1.0) == [ 1.0, 0.06274509803922, 0.50196078431373, 1.0 ] //
String.prototype.toFloatRGBarr = function (a)
{
    var hexRGB = this.trimHexStr();
    var r = parseInt(hexRGB.slice(0, 2), 16) / 255;
    var g = parseInt(hexRGB.slice(2, 4), 16) / 255;
    var b = parseInt(hexRGB.slice(4, 6), 16) / 255;
    var rgbArr = [r, g, b];
    if(a != undefined)
    {
        a = Math.max(0.0, Math.min(a, 1.0));
        rgbArr.push(a);
    }
    
    return rgbArr;
}

// Get array of 8-bit integers from 24-bit hexadecimal string
// "#FF1080" becomes [ 255, 16, 128 ];
//  ("#FF1080").toRGBarr(255) == [  255, 16, 128, 255 ]
String.prototype.toRGBarr = function (a)
{
    var hexRGB = this.trimHexStr();
    var r = parseInt(hexRGB.slice(0, 2), 16);
    var g = parseInt(hexRGB.slice(2, 4), 16);
    var b = parseInt(hexRGB.slice(4, 6), 16);
    var rgbArr = [r, g, b];
    if(a != undefined)
    {
        a = Math.max(0, Math.min(a, 255));
        rgbArr.push(a);
    }
    
    return rgbArr;
}

Array.prototype.HSLtoRGB = function()
{
    if(!this) return;
    if(!this.length) return;

    var h = this[0];
    var s = this[1];
    var l = this[2];

    s /= 100;
    l /= 100;
    
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c/2;
    var r = 0;
    var g = 0;
    var b = 0;

    if (0 <= h && h < 60)
    {
        r = c; 
        g = x; 
        b = 0;  
    } 
    else if (60 <= h && h < 120)
    {
        r = x; 
        g = c; 
        b = 0;
    }
    else if (120 <= h && h < 180)
    {
        r = 0; 
        g = c; 
        b = x;
    } 
    else if (180 <= h && h < 240)
    {
        r = 0; 
        g = x; 
        b = c;
    } 
    else if (240 <= h && h < 300)
    {
        r = x; 
        g = 0; 
        b = c;
    }
    else if (300 <= h && h < 360)
    {
        r = c; 
        g = 0; 
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return [ r, g, b ];
}

Array.prototype.HSBtoRGB = function()
{
    if(!this) return;
    if(!this.length) return;

    var h = this[0];
    var s = this[1] / 100;
    var b = this[2] / 100;

    var l = b * (1 - s/2);
    var nS = (l == 0 || l == 1) ? 0 : ((b - l) / Math.min(l, 1-l));

    var hslArr = [ h, nS*100, l*100 ];
    return hslArr.HSLtoRGB();
}
