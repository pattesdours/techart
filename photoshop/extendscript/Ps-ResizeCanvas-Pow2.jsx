/*
    resize image canvas to powers of 2

*/


#target photoshop;

// add to Number class 

Number.prototype.isPowerOf2 = function()
{
	var n = this.valueOf();
	var abs = Math.abs(n);

  if(Math.floor(n) !== n) return false;
	if(abs !== n) n = abs;
  return n && (n & (n - 1)) === 0;
}

Number.prototype.getNextPow2 = function()
{
	var p = 2;
	var n = Math.floor(this.valueOf());
	if(n.isPowerOf2()) n++;

	while(n > p)
	{
		p = p * 2;
	}
	return p;
}

// main functions

Main()

function Main()
{
    if(!app.documents.length)
    { 
        return;
    }
    
    resizePow2();
// resizePow2(AnchorPosition.TOPLEFT); // add pixels on the right side, bottom of canvas
}

function resizePow2(anchor)
{
    // default anchor value adds pixels around existing artwork
    if(!anchor) anchor = AnchorPosition.MIDDLECENTER;
    var doc = app.activeDocument;

    var w = doc.width.as("px");
    var h = doc.height.as("px");

    var wp2 = w.isPowerOf2() ? w : w.getNextPow2();
    var hp2 = h.isPowerOf2() ? h : h.getNextPow2();

    // if((w != wp2) || (h != hp2)) 
    doc.resizeCanvas(wp2, hp2, anchor);
}


