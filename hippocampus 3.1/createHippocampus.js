//goals:

//add animation - flip
  //get it into position after flip
  
//add light

//add animation - casual movement

//add texture
//add background

//ease in ease out


var VSHADER_SOURCE = 
`attribute vec4 a_Position;
 uniform mat4 u_MvMatrix;
 attribute vec4 a_Color;
 varying vec4 v_Color;
 void main() {
   gl_Position = u_MvMatrix * a_Position;
   gl_PointSize = 10.0;
   v_Color = a_Color;
 }`;	


 var FSHADER_SOURCE = 
 `precision mediump float;
  uniform float u_Width;
  uniform float u_Height;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
    
    //vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
    
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

var u_MvMatrix;
var u_ProjMatrix;
var floatsPerVertex = 7;

//animation stuff
var g_lastMS = Date.now();

var flip_Trig = false; //has flip been triggered? 

//full body movement
var fullB_anglerate = -10.0; //speed of flip
var fullB_angle = -80.0; //angle


//arms
//gives the arms movement
var sh_anglerate = -10.0;
var sh_angle = -20.0;

var fa_anglerate = -10.0;
var fa_angle = 90.0;

var hoof_anglerate = -10.0;
var hoof_angle = 90.0;


var tailbase_anglerate = -10.0; //speed of flip
var tailbase_angle = 2.0; //angle


var headneck_anglerate = -10.0; //speed of flip
var headneck_angle = -20.0; //angle


var head_anglerate = -10.0; //speed of flip
var head_angle = -10.0; //angle



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



    u_MvMatrix = gl.getUniformLocation(gl.program, 'u_MvMatrix');
    //u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if (!u_MvMatrix){ //|| !u_ProjMatrix) { 
      console.log('Failed to get u_MvMatrix or u_ProjMatrix');
      return;
    }

    window.addEventListener('resize', sizeCanvas(gl.canvas));
    window.addEventListener("mousedown", myMouseDown); 
    window.addEventListener("mousemove", myMouseMove); 
    window.addEventListener("mouseup", myMouseUp);	
    window.addEventListener("mousemove", myMouseOver); 
    //document.onkeydown= function(ev){keydown(ev)};



    //projMatrix.setPerspective(30, canvas.width/canvas.height, .1, 100);



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

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }

    initArrayBuffer(gl, colors, gl.FLOAT, 3, 'a_Color');
   

    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    return hippCampusSize/floatsPerVertex;

}

function initArrayBuffer (gl, data, type, num, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment to a_attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}


//animation section
function animate(){
  var nowMS = Date.now();
  var elapsedMS = nowMS - g_lastMS;
  g_lastMS = nowMS;  
  if(elapsedMS > 1000.0) {            
      elapsedMS = 1000.0/30.0;
  }

  //moveThoseArms(elapsedMS);
  doFlip(elapsedMS);

}



function changeAngleRate(x_angle, x_anglerate, x_min, x_max){
  if((x_angle >= x_max && x_anglerate > 0) || // going over max, or
  (x_angle <= x_min && x_anglerate < 0)  ) // going under min ?
      return -1;	// YES: reverse direction.

  return 1;
}
function changeAngle(x_angle, x_min, x_max){
  if(x_min > x_max){// if min and max don't limit the angle, then
      if(x_angle< -180.0) return 360.0;	// go to >= -180.0 or
      else if(x_angle >  180.0) return -360.0;	// go to <= +180.0
  }
  return 0;

}



function makeThoseArms(elapsedMS){
  fullB_angle += fullB_anglerate * (elapsedMS * 0.01);
  fullB_angle += changeAngle(fullB_angle, -360, 0);
  

}







numC = 0; 
function doFlip(elapsedMS){

  //the head has to bend up
  if(flip_Trig){
    if(numC < 210){

      fullB_angle += fullB_anglerate * (elapsedMS * 0.01);
      fullB_angle += changeAngle(fullB_angle, 360, 0);
      

      //head to upper neck
      if(!(headneck_angle <= -37 && headneck_anglerate < 0)  ){
        headneck_angle += headneck_anglerate * (elapsedMS * 0.01);
      }

      //head tilts up
      if(!(head_angle <= -87 && head_anglerate < 0)  ){
        head_angle += head_anglerate * (elapsedMS * 0.01);
      }

      //tail goes back
      if(!(tailbase_angle >= 1 && tailbase_anglerate < 0)  ){
        tailbase_angle -= tailbase_anglerate * (elapsedMS * 0.01);
      }

      
      numC ++;
    }
    else{
      if(numC < 270){
        //could improve gonna handle arms
        //go back to neutral position
  
        //head to arms goes up

  
        //head to upper neck
        if(!(headneck_angle >= -88 && headneck_anglerate < 0)  ){
          headneck_angle -= headneck_anglerate * (elapsedMS * 0.01);
        }
  
        //head tilts to resting position
        if(!(head_angle >= 12 && head_anglerate < 0)  ){
          head_angle -= head_anglerate * (elapsedMS * 0.01);
        }
  
        //mid torso to tail goes back
        if(!(tailbase_angle >= 1 && tailbase_anglerate < 0)  ){
          tailbase_angle -= tailbase_anglerate * (elapsedMS * 0.01);
        }

        numC++; 
      }
      else{
        flip_Trig = false;
        numC = 0; 
      }

    }

  }
  //after doing a flip go into relaxed poosition.

}


//draw section 
function drawAll(){
    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mvMatrix.setIdentity();
    
    mvMatrix.scale(.4, .4, .4);
    mvMatrix.translate(-.5, 0, 0);

    //gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    //mvMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);	
    //gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);


    dist = Math.sqrt(g_xMdragTot*g_xMdragTot + g_yMdragTot*g_yMdragTot);
    mvMatrix.rotate(dist*120.0, -g_yMdragTot+0.0001, g_xMdragTot+0.0001, 0.0);

    //flip
    mvMatrix.translate(.5, 0.1, 0);
    mvMatrix.rotate(fullB_angle, 0, 0, 1);
    mvMatrix.translate(-0.5, -0.1, 0);



    //FLIP head to neck
    pushMatrix(mvMatrix); 
    mvMatrix.translate(-.5, 0.02, 0);
    mvMatrix.rotate(headneck_angle, 0, 0, 1);
    mvMatrix.translate(.5, -0.02, 0);

    drawHead();
    drawNeck();
    drawHorso();



    drawArms();

    drawLowerBody();
    drawTail();
}

function drawHead(){
  

  //FLIP head tilts up 
  pushMatrix(mvMatrix);
  mvMatrix.translate(-.69, 0, 0);
  mvMatrix.rotate(head_angle, 0, 0, 1);
  mvMatrix.translate(.69, 0, 0);

  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, hornStart/floatsPerVertex, hornVerts.length/floatsPerVertex);


  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, rightEarStart/floatsPerVertex, rightEarVerts.length/floatsPerVertex);


  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, leftEarStart/floatsPerVertex, leftEarVerts.length/floatsPerVertex);





  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, headBaseStart/floatsPerVertex, headBaseLength/floatsPerVertex);
  
  mvMatrix = popMatrix();
}

function drawNeck(){


  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, neckStart/floatsPerVertex, upperNeckVerts.length/floatsPerVertex);

  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, (neckStart+ midNeckStart)/floatsPerVertex, 
                        (midNeckVerts.length) /floatsPerVertex);

  mvMatrix = popMatrix(); //end of head to neck flip



  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, (neckStart+ lowerNeckStart)/floatsPerVertex,  lowerNeckVerts.length/floatsPerVertex);

  

}

function drawHorso(){
  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, torsoStart/floatsPerVertex, ribUpEnd/floatsPerVertex);

}


function drawArms(){

  //reposition arms
  pushMatrix(mvMatrix);

  //rotated on shoulder
  mvMatrix.translate(-.38, 0.07, 2.5);
  mvMatrix.rotate(sh_angle, 0, 0, 1);
  mvMatrix.translate(.38, -0.07, -2.5);
  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 
          rightArmStart/floatsPerVertex, 
          forarmRStart/floatsPerVertex);

  //forarm rotated on elbow
  mvMatrix.translate(-.38, -.34, 2.8);
  mvMatrix.rotate(fa_angle, 0, 0, 1);
  mvMatrix.translate(.38,  .35, -2.8);
  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 
          (forarmRStart+rightArmStart)/floatsPerVertex, 
          (rightHoofStart - forarmRStart)/floatsPerVertex);
  //hoof
  mvMatrix.translate(-.38, -.7, 3.6);
  mvMatrix.rotate(hoof_angle, 0, 0, 1);
  mvMatrix.translate(.38,  .7, -3.6);
  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 
          (rightHoofStart+rightArmStart)/floatsPerVertex, 
          hoofRVerts.length/floatsPerVertex);


  mvMatrix = popMatrix();



  //left arm
  pushMatrix(mvMatrix);


  mvMatrix.translate(-.38, 0.07, -2.5);
  mvMatrix.rotate(sh_angle, 0, 0, 1);
  mvMatrix.translate(.38, -0.07, 2.5);
  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 
          leftArmStart/floatsPerVertex, 
          forarmLStart/floatsPerVertex);

  //forarm rotated on elbow
  mvMatrix.translate(-.38, -.32, -3.1);
  mvMatrix.rotate(fa_angle, 0, 0, 1);
  mvMatrix.translate(.38,  .32, 3.1);
  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 
          (forarmLStart+leftArmStart)/floatsPerVertex, 
          (leftHoofStart - forarmLStart)/floatsPerVertex);
  //hoof
  mvMatrix.translate(-.38, -.7, -4.7);
  mvMatrix.rotate(hoof_angle, 0, 0, 1);
  mvMatrix.translate(.38,  .7, 4.7);
  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, 
          (leftHoofStart+leftArmStart)/floatsPerVertex, 
          hoofLVerts.length/floatsPerVertex);




  mvMatrix = popMatrix();
  //mvMatrix = popMatrix();

  

}

function drawLowerBody(){



  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, (torsoStart + ribUpEnd)/floatsPerVertex, (stomachVerts.length)/floatsPerVertex);



    //tail start


  gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  gl.drawArrays(gl.TRIANGLE_STRIP, (horhipStart + torsoStart)/floatsPerVertex, 
      (horhipsVerts.length)/floatsPerVertex);
      

}
function drawTail(){





  //gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
  //gl.drawArrays(gl.TRIANGLE_STRIP, tailStart/floatsPerVertex, tailVerts.length/floatsPerVertex);
  

  indTail = ((((53 *2 * 57)-2) * floatsPerVertex))

  prevPos = .1;
  for(i = 0; i < indTail*38; i+=indTail){
    if(i == 0){
      gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
      gl.drawArrays(gl.TRIANGLE_STRIP, 
                  (tailStart+i)/floatsPerVertex, 
                  indTail/floatsPerVertex);
      pushMatrix(mvMatrix); 

    
    }
    else if(i >= indTail*34){ //if it's the fins
     
      gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
      gl.drawArrays(gl.TRIANGLE_STRIP, 
                  (tailStart+i)/floatsPerVertex, 
                  indTail/floatsPerVertex);
    }
    else{
      mvMatrix.translate(prevPos, 0, 0);
      mvMatrix.rotate(tailbase_angle, 0, 0, 1);
     mvMatrix.translate(-prevPos, 0, 0);
      gl.uniformMatrix4fv(u_MvMatrix, false, mvMatrix.elements);
      gl.drawArrays(gl.TRIANGLE_STRIP, 
                  (tailStart+i)/floatsPerVertex, 
                  indTail/floatsPerVertex);
      
      prevPos += 0.05; 
     
    }

    
  
  }



  mvMatrix = popMatrix();

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









function FLIP_runStop() {
  if(!flip_Trig){
      flip_Trig = true;
  }
  else{
    flip_Trig = false; 
  }
}

