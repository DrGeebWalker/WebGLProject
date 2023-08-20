//ease in ease out
var VSHADER_SOURCE = 
`attribute vec4 a_Position;
 uniform mat4 u_ProjMatrix;
 uniform mat4 u_MVMatrix;
 attribute vec2 a_TextCoord;
 varying vec2 v_TextCoord;
 void main() {
   gl_Position = u_ProjMatrix * u_MVMatrix * a_Position;
   v_TextCoord = a_TextCoord;

 }`;	


 var FSHADER_SOURCE = 
 `precision mediump float;
  uniform sampler2D u_SamplerH;
  varying vec2 v_TextCoord;
  void main() {
    //vec4 colorH = texture2D(u_SamplerH, v_TextCoord);
    gl_FragColor = texture2D(u_SamplerH, v_TextCoord);
    
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

var mvMatrix = new Matrix4();
var projMatrix = new Matrix4();




var u_MVMatrix;
var u_ProjMatrix;
var floatsPerVertex = 4;

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



    u_MVMatrix = gl.getUniformLocation(gl.program, 'u_MVMatrix');
    u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if (!u_MVMatrix || !u_ProjMatrix) { 
      console.log('Failed to get u_MVMatrix or u_ProjMatrix');
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
       // initTextures();
        drawAll();
        requestAnimationFrame(tick, canvas); 
    }
    
    tick();

}

function initVertexBuffers(){
    buildHippocampus();

    n = hippCampusSize/floatsPerVertex;

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



    var a_TextCoord = gl.getAttribLocation(gl.program, 'a_TextCoord');
    if (a_TextCoord < 0) {
      console.log('Failed to get the storage location of a_TextCoord');
      return -1;
    }


  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TextCoord);  // Enable the assignment of the buffer object



  return n;

}



//calls all textures
function initTextures(){
  initHornTexture();
}


function initHornTexture(){
  var hornTexture = gl.createTexture();

  var u_SamplerH = gl.getUniformLocation(gl.program, 'u_SamplerH');

  var hornImage = new Image();
  if (!hornImage) {
    console.log('Failed to create the image object');
    return false;
  }

  hornImage.onload = function(){
    loadTexture(hornTexture, u_SamplerH,
      hornImage); };

  hornImage.src = 'hornAlpha.png';
}

//loads textures
function loadTexture(texture, u_Sampler, 
        image){

  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>



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
    mvMatrix.setIdentity();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    mvMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);	
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);


    dist = Math.sqrt(g_xMdragTot*g_xMdragTot + g_yMdragTot*g_yMdragTot);
    mvMatrix.rotate(dist*120.0, -g_yMdragTot+0.0001, g_xMdragTot+0.0001, 0.0);

    drawHead();
    drawNeck();
    drawHorso();
    drawArms();
    drawTail();
}

function drawHead(){
  pushMatrix(mvMatrix);

  
  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, hornStart/floatsPerVertex, hornVerts.length/floatsPerVertex);

  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, rightEarStart/floatsPerVertex, rightEarVerts.length/floatsPerVertex);


  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, leftEarStart/floatsPerVertex, leftEarVerts.length/floatsPerVertex);


  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, headBaseStart/floatsPerVertex, headBaseLength/floatsPerVertex);

  mvMatrix = popMatrix();
}

function drawNeck(){
  pushMatrix(mvMatrix);
  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, neckStart/floatsPerVertex, neckLength/floatsPerVertex);

  mvMatrix = popMatrix();

}

function drawHorso(){
  pushMatrix(mvMatrix);
  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, torsoStart/floatsPerVertex, torsoLength/floatsPerVertex);

  mvMatrix = popMatrix();
}


function drawArms(){
  pushMatrix(mvMatrix);
  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, rightArmStart/floatsPerVertex, rightArmVerts.length/floatsPerVertex);
  mvMatrix = popMatrix();

  pushMatrix(mvMatrix);
  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, leftArmStart/floatsPerVertex, leftArmVerts.length/floatsPerVertex);
  mvMatrix = popMatrix();

}

function drawTail(){
  pushMatrix(mvMatrix);
  gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, tailStart/floatsPerVertex, tailVerts.length/floatsPerVertex);
  mvMatrix = popMatrix();

}



//EVENTS START
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
    