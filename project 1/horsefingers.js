var VSHADER_SOURCE = 
`uniform mat4 u_ModelMatrix;
 attribute vec4 a_Position;
 attribute vec4 a_Color;
 varying vec4 v_Color;
 void main() {
   gl_Position = u_ModelMatrix * a_Position;
   gl_PointSize = 10.0;
   v_Color = a_Color;
 }`;	


 var FSHADER_SOURCE = 
 `precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }`


//what do I need to make the chest wiggle
//and the belly expand?
//change rbend
//make rbend negative to flip (but this will change position for all)




var canvas;	
var gl;
var modelMatrix;
var g_ModelMatrixLoc;
var floatsPerVertex = 7;
var g_lastMS = Date.now();	

//shoulder movement
var sh_brake = 1.0;
var sh_angle = 0.0;
var sh_anglerate = -10.0;       // init Rotation angle rate, in degrees/second.
var sh_min  = -20.0;       // init min, max allowed angle, in degrees.
var sh_max  =  5.0;

//end from shoulder

//from elbow movement
var el_brake = 1.0;
var el_angle = 0.0;
var el_anglerate = -10.0;       // init Rotation angle rate, in degrees/second.
var el_min  = -20.0;       // init min, max allowed angle, in degrees.
var el_max  =  5.0;

//end from elbow

//hoof movement
var hoof_brake = 1.0;
var hoof_angle = 0.0;
var hoof_anglerate = -10.0;       // init Rotation angle rate, in degrees/second.
var hoof_min  = -90.0;       // init min, max allowed angle, in degrees.
var hoof_max  =  5.0;
//end of hoof movement


function main(){
    canvas = document.getElementById('webgl');
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

    //window.addEventListener("mousemove", myMouseMove); 

    gl.clearColor(0, 0, 0, 1.0); //red, green, blue, transparency

    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(0.0); // each time we 'clear' our depth buffer, set all
    // pixel depths to 0.0 (1.0 is DEFAULT)
    gl.depthFunc(gl.GREATER); // (gl.LESS is DEFAULT; reverse it!)
    // draw a pixel only if its depth value is GREATER
    // than the depth buffer's stored value.

    //gl.enable(gl.CULL_FACE);

    g_ModelMatrixLoc = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!g_ModelMatrixLoc) { 
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }
    
    modelMatrix = new Matrix4();

    
    var tick = function() {
        animate(); 
        drawAll(g_nVerts);
        requestAnimationFrame(tick, canvas); 
    }

    tick();
	

}


function initVertexBuffers(){
    makeLShJnt();
    makeLElJnt();
    makeLWrJnt();
    makeUpperArm();
    makeForeArm();
    makeHoof();

    var mySiz = lshVerts.length +  leVerts.length + lwrVerts.length +
    upperArmVerts.length + foreArmVerts.length + hoofVerts.length;

    var nn = mySiz / floatsPerVertex;

    var colorShapes = new Float32Array(mySiz);

    armStart = 0;
    for(i=0,j=0; j< lshVerts.length; i++,j++){
        colorShapes[i] = lshVerts[j];
    }

    upperArmStart = i;
    for(j=0; j< upperArmVerts.length; i++,j++){
        colorShapes[i] = upperArmVerts[j];
    }
    elbowStart = i;
    for(j=0; j < leVerts.length; i++,j++){
        colorShapes[i] = leVerts[j];
    }
    forearmStart = i;
    for(j=0; j < foreArmVerts.length; i++,j++){
        colorShapes[i] = foreArmVerts[j];
    }

    wristStart = i;
    for(j=0; j < lwrVerts.length; i++,j++){
        colorShapes[i] = lwrVerts[j];
    }

    hoofStart = i;
    for(j=0; j < hoofVerts.length; i++,j++){
        colorShapes[i] = hoofVerts[j];
    }
    endPoint = i;
    

    var shapeBufferID = gl.createBuffer()
    if (!shapeBufferID) {
        console.log('Failed to create the buffer object');
        return -1;	// error code
      }

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferID);

    gl.bufferData(gl.ARRAY_BUFFER, colorShapes, gl.STATIC_DRAW);

    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -2;  // error code
    }

    var FSIZE = colorShapes.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * floatsPerVertex, 0);
	
    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
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

    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    return nn;

}

function makeUpperArm(){
    upperArmVerts = makeCylinderR(16, .3, .2, 90,
         25, 20, -.50, -.39,
         25, 19, .35, .251,
         7, 5, -.04, .118);
  
}


function makeForeArm(){
    foreArmVerts = makeCylinderR(16, .4, .4, 50,
        11, 15, -0.59,-.58,
        27, 25, .35, .1,
        4,9, .256, -.1);
}


function makeHoof(){
    hoofVerts = makeCylinderRWithBottom(16, .3, .7, 180,
        19, 10, -0.62, -.40,
        23, 20, .1, .1,
        10,8, -.043, .1,
        -.48);
}



function animate() {
    var nowMS = Date.now();
    var elapsedMS = nowMS - g_lastMS;
    g_lastMS = nowMS;  
    if(elapsedMS > 1000.0) {            
        elapsedMS = 1000.0/30.0;
    }

    //shoulder movement
    sh_angle += sh_anglerate * sh_brake * (elapsedMS * 0.001);	// update.

    if((sh_angle >= sh_max && sh_anglerate > 0) || // going over max, or
    (sh_angle <= sh_min && sh_anglerate < 0)  ) // going under min ?
        sh_anglerate *= -1;	// YES: reverse direction.

    if(sh_min > sh_max){// if min and max don't limit the angle, then
        if(     sh_angle< -180.0) sh_angle += 360.0;	// go to >= -180.0 or
        else if(sh_angle >  180.0) sh_angle -= 360.0;	// go to <= +180.0
    }

    //elbow movement
    el_angle += el_anglerate * el_brake * (elapsedMS * 0.001);	// update.

    if((el_angle >= el_max && el_anglerate > 0) || // going over max, or
    (el_angle <= sh_min && el_anglerate < 0)  ) // going under min ?
        el_anglerate *= -1;	// YES: reverse direction.

    if(el_min > el_max){// if min and max don't limit the angle, then
        if(     el_angle< -180.0) el_angle += 360.0;	// go to >= -180.0 or
        else if(el_angle >  180.0) el_angle -= 360.0;	// go to <= +180.0
    }

    //hoof movement
    hoof_angle += hoof_anglerate * hoof_brake * (elapsedMS * 0.001);	// update.

    if((hoof_angle >= hoof_max && hoof_anglerate > 0) || // going over max, or
    (hoof_angle <= hoof_min && hoof_anglerate < 0)  ) // going under min ?
        hoof_anglerate *= -1;	// YES: reverse direction.

    if(hoof_min > hoof_max){// if min and max don't limit the angle, then
        if(     hoof_angle< -180.0) hoof_angle += 360.0;	// go to >= -180.0 or
        else if(hoof_angle >  180.0) hoof_angle -= 360.0;	// go to <= +180.0
    }

}
    

//1 get hoof to move up and down on lwrVerts
function drawAll() {

    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setIdentity();

    pushMatrix(modelMatrix);

    drawLeg();
    
    modelMatrix = popMatrix();
    //modelMatrix.translate(.4, -.1, 0, 0);

    //modelMatrix.rotate(0, 0, 1, 0);





  
}


function drawLeg(){
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, armStart/floatsPerVertex,  lshVerts.length/floatsPerVertex);
    pushMatrix(modelMatrix);
    drawUpperArmMovement();
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, elbowStart/floatsPerVertex, leVerts.length/floatsPerVertex);
    drawForeArmMovement();
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, wristStart/floatsPerVertex, lwrVerts.length/floatsPerVertex);
    drawHoofMovement();
    modelMatrix = popMatrix();



}

// lshVerts = makeSphere(-0.33, 0.25, 0.5);
//have upperarm and rest go up and down on lshVerts
function drawUpperArmMovement(){
    modelMatrix.translate(-.33,0.25,0,0)
    modelMatrix.rotate(sh_angle, 0, 0, 1);
    modelMatrix.translate(.33,-0.25,0,0)
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, upperArmStart/floatsPerVertex, upperArmVerts.length/floatsPerVertex);

}

//have forearm move to and from body
//-.55, 0.35, 
function drawForeArmMovement(){
    modelMatrix.translate(-.55,0.35,0,0)
    modelMatrix.rotate(el_angle, 0, 0, 1);
    modelMatrix.translate(.55,-0.35,0,0)
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, forearmStart/floatsPerVertex, foreArmVerts.length/floatsPerVertex);
}

//have hoof move up and down 
// -0.60, 0.10,
function drawHoofMovement(){
    modelMatrix.translate(-.60,0.10,0,0)
    modelMatrix.rotate(hoof_angle, 0, 0, 1);
    modelMatrix.translate(.60,-0.10,0,0)
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, hoofStart/floatsPerVertex, hoofVerts.length/floatsPerVertex);
}




function Arm1_runStop() {
    if(sh_brake > 0.5){
        sh_brake = 0.0;	// stop, and change button label:
        document.getElementById("ARM1button").value="Arm Movement1 OFF";
    }
    else{
        sh_brake = 1.0;	// Otherwise, go.
        document.getElementById("ARM1button").value="Arm Movement1 ON";
    }
}


function Arm2_runStop() {
    //==============================================================================
      if(el_brake > 0.5)	// if running,
      {
          el_brake = 0.0;	// stop, and change button label:
          document.getElementById("ARM2button").value="Arm Movement2 OFF";
        }
      else 
      {
          el_brake = 1.0;	// Otherwise, go.
          document.getElementById("ARM2button").value="Arm Movement2 ON";
        }
}

function Arm3_runStop() {
    //==============================================================================
      if(hoof_brake > 0.5)	// if running,
      {
          hoof_brake = 0.0;	// stop, and change button label:
          document.getElementById("ARM3button").value="Arm Movement3 OFF";
        }
      else 
      {
          hoof_brake = 1.0;	// Otherwise, go.
          document.getElementById("ARM3button").value="Arm Movement3 ON";
        }
}
