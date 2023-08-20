//ease in ease out
var VSHADER_SOURCE = 
`attribute vec4 a_Position;
 attribute vec4 a_Color;
 uniform mat4 u_ProjMatrix;
 uniform mat4 u_ViewMatrix;
 varying vec4 v_Color;
 void main() {
   gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
   gl_PointSize = 10.0;
   v_Color = a_Color;
 }`;	


 var FSHADER_SOURCE = 
 `precision mediump float;
  uniform float u_Width;
  uniform float u_Height;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
    
  }`

//gl_FragColor = v_Color;
var g_isDrag=false;		// mouse-drag: true when user holds down mouse button
var g_xMclik=0.0;			// last mouse button-down position (in CVV coords)
var g_yMclik=0.0;   
var g_xMdragTot=0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var g_yMdragTot=0.0; 
var g_digits=5;			// DIAGNOSTICS: # of digits to print in console.log (
                                      //    console.log('xVal:', xVal.toFixed(g_digits)); // print 5 digits
      
var g_EyeX = 3;
var g_EyeY = 1;
var g_EyeZ = 1; 

var canvas;	
var gl;

var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();




var u_ViewMatrix;
var u_ProjMatrix;
var floatsPerVertex = 7;

var g_lastMS = Date.now();



function main(){
    canvas = document.getElementById('webgl');
    canvas.width = window.innerWidth;
    canvas.height = (window.innerHeight/3)*2;

    gl = getWebGLContext(canvas);
    
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
      }



    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var g_nVerts = initVertexBuffers();	
    if (g_nVerts < 0) {
      console.log('Failed to load vertices into the GPU');
      return;
    }
 


    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(0.0); 
    gl.depthFunc(gl.GREATER); 
    //gl.enable(gl.CULL_FACE);



    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if (!u_ViewMatrix || !u_ProjMatrix) { 
      console.log('Failed to get u_ViewMatrix or u_ProjMatrix');
      return;
    }

    window.addEventListener('resize', sizeCanvas(gl.canvas));
    window.addEventListener("mousedown", myMouseDown); 
    window.addEventListener("mousemove", myMouseMove); 
    window.addEventListener("mouseup", myMouseUp);	
    window.addEventListener("mousemove", myMouseOver); 
    document.onkeydown= function(ev){keydown(ev)};



    projMatrix.setPerspective(30, canvas.width/canvas.height, .1, 100);



    var tick = function() {
        gl.clearColor(0, 0, 0, 1); //red, green, blue, transparency
        //gl.clear(gl.COLOR_BUFFER_BIT);
    
    
        animate(); 
        drawAll();
        requestAnimationFrame(tick, canvas); 
    }
    
    tick();

}

function initVertexBuffers(){
    buildHippocampus();
    colorHippoCampus();


    var shapeBufferID = gl.createBuffer()
    if (!shapeBufferID) {
        console.log('Failed to create the buffer object');
        return -1;	// error code
      }

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferID);

    gl.bufferData(gl.ARRAY_BUFFER, hippShapes, gl.STATIC_DRAW);

    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -2;  // error code
    }

    var FSIZE = hippShapes.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * floatsPerVertex, 0);
	
    gl.enableVertexAttribArray(aLoc_Position);

    /*var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    // Use handle to specify how to retrieve **COLOR** data from our VBO:
    gl.vertexAttribPointer(
        a_Color, 				// choose Vertex Shader attribute to fill with data
        3, 							// how many values? 1,2,3 or 4. (we're using R,G,B)
        gl.FLOAT, 			// data type for each value: usually gl.FLOAT
        false, 					// did we supply fixed-point data AND it needs normalizing?
        FSIZE * 7, 			// Stride -- how many bytes used to store each vertex?
                                        // (x,y,z,w, r,g,b) * bytes/value
        FSIZE * 4);			// Offset -- how many bytes from START of buffer to the
                                        // value we will actually use?  Need to skip over x,y,z,w
                                        
    gl.enableVertexAttribArray(a_Color);
    */
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    return hippCampusSize/floatsPerVertex;

}


function colorHippoCampus(){
  //horn = 0.662, 0.920, 0.877
  //body = 0.257, 0.570, 0.533
  //hooves 0.0780, 0.0854, 0.520


}

function animate(){
  var nowMS = Date.now();
  var elapsedMS = nowMS - g_lastMS;
  g_lastMS = nowMS;  
  if(elapsedMS > 1000.0) {            
      elapsedMS = 1000.0/30.0;
  }


}

function drawAll(){
    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    viewMatrix.setIdentity();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);	
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);


    dist = Math.sqrt(g_xMdragTot*g_xMdragTot + g_yMdragTot*g_yMdragTot);
    viewMatrix.rotate(dist*120.0, -g_yMdragTot+0.0001, g_xMdragTot+0.0001, 0.0);

    drawHead();
    drawNeck();
    drawHorso();
    drawArms();
    drawTail();
}

function drawHead(){
  pushMatrix(viewMatrix);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, hornStart/floatsPerVertex, hornVerts.length/floatsPerVertex);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, rightEarStart/floatsPerVertex, rightEarVerts.length/floatsPerVertex);


  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, leftEarStart/floatsPerVertex, leftEarVerts.length/floatsPerVertex);


  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, headBaseStart/floatsPerVertex, headBaseLength/floatsPerVertex);

  viewMatrix = popMatrix();
}

function drawNeck(){
  pushMatrix(viewMatrix);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, neckStart/floatsPerVertex, neckLength/floatsPerVertex);

  viewMatrix = popMatrix();

}

function drawHorso(){
  pushMatrix(viewMatrix);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, torsoStart/floatsPerVertex, torsoLength/floatsPerVertex);

  viewMatrix = popMatrix();
}


function drawArms(){
  pushMatrix(viewMatrix);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, rightArmStart/floatsPerVertex, rightArmVerts.length/floatsPerVertex);
  viewMatrix = popMatrix();

  pushMatrix(viewMatrix);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, leftArmStart/floatsPerVertex, leftArmVerts.length/floatsPerVertex);
  viewMatrix = popMatrix();

}

function drawTail(){
  pushMatrix(viewMatrix);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, tailStart/floatsPerVertex, tailVerts.length/floatsPerVertex);
  viewMatrix = popMatrix();

}


//finds mouse position
function getRelativeMousePosition(event, target) {
    target = target || event.target;
    var rect = target.getBoundingClientRect();
  
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
}

      
function myMouseDown(ev) {
	g_isDrag = true;											// set our mouse-dragging flag

    var pos = getRelativeMousePosition(ev);
    g_xMclik = pos.x / gl.canvas.width  *  2 - 1;
    g_yMclik = pos.y / gl.canvas.height * -2 + 1;
 
};


function myMouseMove(ev) {
	if(g_isDrag==false) return;			

    var pos = getRelativeMousePosition(ev);
    x = pos.x / gl.canvas.width  *  2 - 1;
    y = pos.y / gl.canvas.height * -2 + 1;

//	console.log('myMouseMove(CVV coords  ):  x, y=\t',x,',\t',y);

	// find how far we dragged the mouse:
	g_xMdragTot += (x - g_xMclik);			// Accumulate change-in-mouse-position,&
	g_yMdragTot += (y - g_yMclik);



	g_xMclik = x;											// Make next drag-measurement from here.
	g_yMclik = y;
};

function myMouseUp(ev) {
	// Convert to Canonical View Volume (CVV) coordinates too:
    var pos = getRelativeMousePosition(ev);
    x = pos.x / gl.canvas.width  *  2 - 1;
    y = pos.y / gl.canvas.height * -2 + 1;
	
	g_isDrag = false;											// CLEAR our mouse-dragging flag, and
	// accumulate any final bit of mouse-dragging we did:
	g_xMdragTot += (x - g_xMclik);
	g_yMdragTot += (y - g_yMclik);

};




function myMouseOver(ev){
    const rect = canvas.getBoundingClientRect();
    mouseX = ev.clientX - rect.left;
    mouseY = ev.clientY - rect.top;
}

//resizes canvas (Need to resize creature)
function sizeCanvas(canvas){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    //drawAll(); 
}


//perspective change
function keydown(ev) {
    //------------------------------------------------------
    //HTML calls this'Event handler' or 'callback function' when we press a key:
    
        if(ev.keyCode == 39) { // The right arrow key was pressed
    //      g_EyeX += 0.01;
                    g_EyeX += 0.1;		// INCREASED for perspective camera)
        } else 
        if (ev.keyCode == 37) { // The left arrow key was pressed
    //      g_EyeX -= 0.01;
                    g_EyeX -= 0.1;		// INCREASED for perspective camera)
        }else if (ev.keyCode == 38){
            g_EyeZ += 0.1;
        }else if(ev.keyCode == 40){
            g_EyeZ -= 0.1;
        }
        else { return; } // Prevent the unnecessary drawing
        drawAll();    
    }
    