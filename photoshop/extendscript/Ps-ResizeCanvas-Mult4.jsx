/*
    resize canvas to multiples of 4

*/


#target photoshop;

// add to Number class 

Number.prototype.isMultOf = function(m)
{
	if(m == undefined || isNaN(m))
	{
		return;
	}
	var n = this.valueOf();
	return (Math.ceil(n/m) * m == n);
};

Number.prototype.getNextMultOf = function(m)
{
	var n = this.valueOf();
	if(n.isMultOf(m)) n++;
	return (n % m == 0) ? n : ( n + (m - (n % m)) );
};

// main functions

Main()

function Main()
{ 
    if(!app.documents.length)
    { 
        return;
    }

    resizeMult4();
    // resizeMult4(AnchorPosition.TOPLEFT); // add pixels on the right side, bottom of canvas
}

function resizeMult4(anchor)
{
    // default anchor value adds pixels around existing artwork
    if(!anchor) anchor = AnchorPosition.MIDDLECENTER;
    var doc = app.activeDocument;

    var w = doc.width.as("px");
    var h = doc.height.as("px");

    var w4 = w.isMultOf(4) ? w : w.getNextMultOf(4);
    var h4 = h.isMultOf(4) ? w : h.getNextMultOf(4);

    // if((w != w4) || (h != h4)) 
    doc.resizeCanvas(w4, h4, anchor);
}

