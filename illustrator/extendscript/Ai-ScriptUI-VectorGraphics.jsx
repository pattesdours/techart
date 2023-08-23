
/*

    adapted from https://github.com/adamplouff/scriptui-battlestyle




*/

#target illustrator;

// add image resource from SVG code
// var graphics = dialog.addVectorGraphics( { shapes: ["77 45 0 0 0 89 77 45"] });
Object.prototype.addVectorGraphics = function ( obj )
{
    var obj = obj != undefined ? obj : {};
    obj.hexValue = obj.hexValue != undefined ? obj.hexValue : "FFFFFF";
    obj.textHexValue = obj.textHexValue != undefined ? obj.textHexValue : "000000";

    if(!obj.shapes) obj.shapes =  ["77 45 0 0 0 89 77 45" ]; // default reference triangle

    var containerGroup = this.add('group');
    containerGroup.alignment = ['fill', 'fill'];
    containerGroup.alignChildren = ['fill', 'fill'];

    var c = containerGroup.add('iconbutton', undefined, undefined, { name: "svg-graphics", style: 'toolbutton'});

    c.size = [ !isNaN(obj.width) ? obj.width : 128, !isNaN(obj.height) ? obj.height : 128 ];
    c.artSize = [ !isNaN(obj.width) ? obj.width : 128, !isNaN(obj.height) ? obj.height : 128 ];

    if(app.name == "Adobe Photoshop")
    {
        var rectCol = new SolidColor();
        rectCol.rgb.hexValue = obj.hexValue;
    
        var textCol = new SolidColor();
        textCol.rgb.hexValue = obj.textHexValue;

        var rectRed = rectCol.rgb.red/255;
        var rectGreen = rectCol.rgb.green/255; 
        var rectBlue = rectCol.rgb.blue/255; 

        var textRed = textCol.rgb.red/255;
        var textGreen = textCol.rgb.green/255; 
        var textBlue = textCol.rgb.blue/255; 
    }
    else if(app.name == "Adobe Illustrator")
    {
        // hex color objects require more finesse with Illustrator
        var rectRed = HexToR(obj.hexValue)/255;
        var rectGreen = HexToG(obj.hexValue)/255;
        var rectBlue = HexToB(obj.hexValue)/255;

        var textRed = HexToR(obj.textHexValue)/255;
        var textGreen = HexToG(obj.textHexValue)/255;
        var textBlue = HexToB(obj.textHexValue)/255;
    }

    c.fillBrush = c.graphics.newBrush( c.graphics.BrushType.SOLID_COLOR, [ rectRed, rectGreen, rectBlue, 1] );
	c.text = obj.text != undefined ? obj.text : "";
	if(c.text) c.textPen = c.graphics.newPen (c.graphics.PenType.SOLID_COLOR,[ textRed, textGreen, textBlue ], 1);
	c.onDraw = customDraw;

    // var shapesArr =  [ "123 106.3333 97.3333 104 83.3333 125 76.3333 101.6667 53 94.6667 74 80.6667 74 55 92.6667 71.3333 116 64.3333 109 85.3333 123 106.3333" ];

    function vecToPoints(vecCoord) {
		var points = [];
		var n;
		for (var i = 0; i < vecCoord.length; i++) {
			var eachNum = vecCoord[i].split(/[\s,]/);
			var coordinates = [];
			var sets = [];
			for (var k = 0; k < eachNum.length; k += 2) {
				sets.push(eachNum[k] + "," + eachNum[k + 1]);
			}
			for (var j = 0; j < sets.length; j++) {
				n = sets[j].split(",");
				coordinates[j] = n;
				coordinates[j][0] = (parseFloat(coordinates[j][0]));
				coordinates[j][1] = (parseFloat(coordinates[j][1]));
			}
			points.push(coordinates);
		}
		return points;
	}

    function customDraw()
	{ 
		with( this )
		{
			graphics.drawOSControl();
			graphics.rectPath( 0, 0, size[0], size[1]);
			// graphics.fillPath( fillBrush );
			var fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, hexToArray('#000035'));
			graphics.fillPath( fillBrush );

            try {
				if($.level) $.writeln("obj.shapes: " + obj.shapes );
				if($.level) $.writeln("0: " + obj.shapes[0] );
                for (var i = 0; i < obj.shapes.length; i++) {
                    var line = obj.shapes[i];
                    graphics.newPath();
					// if($.level) $.writeln("line[0][0]: " + line[0][0] + "  line[0][1]: " + line[0][1] );
					if($.level) $.writeln("line[0]: " + line[0] + "  line[1]: " + line[1] );
                    // graphics.moveTo(line[0][0] + (size[0] / 2 - artSize[0] / 2), line[0][1] + (size[1] / 2 - artSize[1] / 2));
                    // graphics.moveTo(line[0][0] + (size[0] / 2 - artSize[0] / 2), line[0][1] + (size[1] / 2 - artSize[1] / 2));
					// graphics.moveTo(line[0] + (size[0] / 2 - artSize[0] / 2), line[1] + (size[1] / 2 - artSize[1] / 2));
                    graphics.moveTo(line[0] + (size[0] / 2 - artSize[0] / 2), line[1] + (size[1] / 2 - artSize[1] / 2));
					
                    for (var j = 0; j < line.length; j++) {
						if($.level) $.writeln("line[j][0]:" + line[j][0] + "line[j][1]:" + line[j][1] );
                        graphics.lineTo(line[j][0] + (size[0] / 2 - artSize[0] / 2), line[j][1] + (size[1] / 2 - artSize[1] / 2));
                    }
                    // graphics.fillPath( fillBrush );
                    graphics.fillPath( fillBrush );
                }
            } catch (e) {
                if($.level)
                {
                    $.writeln( "customDraw - " + e );
                }
            }
		}
	}

	
	function vecDraw() {
		this.graphics.drawOSControl();
		this.graphics.rectPath(0, 0, this.size[0], this.size[1]);
		this.graphics.fillPath(this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0, 0, 0, 0.15]));
		try {
			for (var i = 0; i < this.coord.length; i++) {
				var line = this.coord[i];
				this.graphics.newPath();
				this.graphics.moveTo(line[0][0] + (this.size[0] / 2 - this.artSize[0] / 2), line[0][1] + (this.size[1] / 2 - this.artSize[1] / 2));
				for (var j = 0; j < line.length; j++) {
					this.graphics.lineTo(line[j][0] + (this.size[0] / 2 - this.artSize[0] / 2), line[j][1] + (this.size[1] / 2 - this.artSize[1] / 2));
				}
				this.graphics.fillPath(this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, hexToArray(this.iconColor)));
			}
		} catch (e) {
			if($.level)
			{
				$.writeln("vecDraw error:\n\n" + e );
			}
		}
	}

    function buttonColorVector(parentObj, iconVec, size, staticColor, hoverColor) {
		// var btn = parentObj.add("button", [0, 0, size[0], size[1], undefined]);
		var btn = parentObj.add("button", [0, 0, size[0], size[1]], undefined, undefined);
			btn.coord = vecToPoints(iconVec);
			btn.iconColor = staticColor;
			btn.artSize = size;
			btn.onDraw = customDraw;

        if (hoverColor) {
    		try {
    			btn.addEventListener("mouseover", function() {
    				updateVectorButtonOnHover(this, iconVec, hoverColor, size);
    			});
    			btn.addEventListener("mouseout", function() {
    				updateVectorButtonOnHover(this, iconVec, staticColor, size);
    			});
    		}
    		catch(err) {
    			// fail silently
    		}
        }
        // btn.onDraw();
        // updateVectorButtonOnHover(this, iconVec, hoverColor, size);
		return btn;
	}

	function updateVectorButtonOnHover(btn, iconVec, iconColor, size) {
		btn.coord = vecToPoints(iconVec);
		btn.iconColor = iconColor;
		btn.artSize = size;
		btn.onDraw = vecDraw;
		return btn;
	}

    c.updateGraphics = function(container)
    {
		if (container.children.length > 0) {
			container.remove(container.children[container.children.length-1]); // remove the last element in group
		}

	    var btn_reference = buttonColorVector(container, obj.shapes, [128, 128], "#BA0080", '#baeff6'); // draw button with new values

    }

    c.updateGraphics(containerGroup);

    return c;
}

/////
/// styled color button

function hexToArray(hexString) {
	var hexColor = hexString.replace('#', '');
	var r = parseInt(hexColor.slice(0, 2), 16) / 255;
	var g = parseInt(hexColor.slice(2, 4), 16) / 255;
	var b = parseInt(hexColor.slice(4, 6), 16) / 255;
	return [r, g, b, 1];
}

function txtDraw() {
	this.graphics.drawOSControl();
	this.graphics.rectPath(0, 0, this.size[0], this.size[1]);
	this.graphics.fillPath(this.fillBrush);
	if (this.text) {
		this.graphics.drawString(
			this.text,
			this.textPen,
			(this.size[0] - this.graphics.measureString(this.text, this.graphics.font, this.size[0])[0]) / 2,
			(this.size[1] - this.graphics.measureString(this.text, this.graphics.font, this.size[0])[1]) / 1.75,
			this.graphics.font);
	}
}

function buttonColorText(parentObj, buttonText, staticColor, hoverColor) {
	var btn = parentObj.add('button', undefined, '', {name: 'ok'});    // add a basic button to style
		btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, hexToArray(staticColor));
		btn.text = buttonText.toUpperCase();
		btn.textPen = btn.graphics.newPen(btn.graphics.PenType.SOLID_COLOR, hexToArray('#ffffff'), 1);
		btn.onDraw = txtDraw;

	if (hoverColor) {
		try {
			btn.addEventListener("mouseover", function() {
				updateTextButtonOnHover(this, buttonText, hoverColor, "#FFFFFF");
			});
			btn.addEventListener("mouseout", function() {
				updateTextButtonOnHover(this, buttonText, staticColor, "#FFFFFF");
			});
			btn.addEventListener("mousedown", function() {
				updateTextButtonOnHover(this, buttonText, "#FFFFFF", "#000000");
			});
		} catch (err) {
			// fail silently
		}
	}

	return btn;
}

function updateTextButtonOnHover(btn, buttonText, backgroundColor, textColor) {
	btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, hexToArray(backgroundColor));
	btn.text = buttonText.toUpperCase();
	btn.textPen = btn.graphics.newPen(btn.graphics.PenType.SOLID_COLOR, hexToArray(textColor), 1);
	btn.onDraw = txtDraw;
	return btn;
}

// hex RGB related
function cutHex(h)
{
	if(h.charAt(0)=="#") h = h.substring(1,7); 
	else if(h.charAt(0)=="0" && h.charAt(1)=="x") h = h.substring(2,8); 
	return h;
}

function HexToR(h) 
{
	return parseInt((cutHex(h)).substring(0,2), 16);
}

function HexToG(h) 
{
	return parseInt((cutHex(h)).substring(2,4), 16);
}

function HexToB(h)
{
	return parseInt((cutHex(h)).substring(4,6), 16);
}

////

Main();

function Main()
{
	var win = new Window( 'dialog', "ScriptUI Graphics", undefined, { closeButton: true });
	win.alignChildren = "fill";
	win.margins = 20;
	win.spacing = 15;

    // win.addStaticText( { text: "Convert SVG to ScriptUI graphics!" } );

    // var shapesArr = ["105 16 107 15 107 16 109 14 105 5 87 5 79 13 81 17 79 20 76 18 74 23 76 24 80 21 83 20 86 16 90 17 96 19 103 20 103 11", "109 14 107 16 107 24 105 18 103 20 90 17 90 22 84 24 83 20 80 21 80 25 76 24 74 23 72 30 80 35 89 25 95 27 90 27 88 28 93 34 106 34 114 24" ];
    // var shapesArr = ["22 102 22 23 65 5 107 23 107 102 22 102" ];
    // var shapesArr = ["65 5 107 23 107 102 22 102 22 23 65 5" ]; // pentagon
    // var shapesArr = ["107 67 3 23 3 112 107 67" ]; // triangle
    // var shapesArr = ["77 45 0 0 0 89 77 45" ]; // triangle
    var shapesArr = ["95 53 99 49 1 44 97 37 89 34 82 36 78 43 73 43 65 33 64 37 59 34 6 38 55 37 58 43 5 43 47 37 39 34 31 37 28 44 3 49 33 53 26 77 31 92 53 107 75 107 97 92 101 77 1 63 98 58 96 55 95 53" ]; // teddybear

   var vecBtn = win.addVectorGraphics( { shapes: shapesArr });

   // dark-dark UI blue button: 46A0F5
   var btn = buttonColorText(win, "Close", '#0F67D2', '#46A0F5');
   btn.onClick = function(){ win.close(); }

//    var closeBtn = win.add('button', undefined, "Close", { name: "ok" });
//    closeBtn.preferredSize.width = 150;
//    closeBtn.preferredSize.height = 44;
//    closeBtn.onClick = function(){ win.close(); }

    win.show();

}
