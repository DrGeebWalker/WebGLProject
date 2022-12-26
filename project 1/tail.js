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



//tail movement
//shoulder movement
var t_brake = 1.0;
var t_angle = 0.0;
var t_anglerate = -10.0;       // init Rotation angle rate, in degrees/second.
var t_min  = -20.0;       // init min, max allowed angle, in degrees.
var t_max  =  5.0;

//end from shoulder


//tail movement
//shoulder movement
var t2_angle = 0.0;
var t2_anglerate = -10.0;       // init Rotation angle rate, in degrees/second.
var t2_min  = -2.0;       // init min, max allowed angle, in degrees.
var t2_max  =  50.0;



var t3_angle = 0.0;
var t3_anglerate = -11.0;       // init Rotation angle rate, in degrees/second.
var t3_min  = -50.0;       // init min, max allowed angle, in degrees.
var t3_max  =  60.0;



var canvas;	
var gl;
var modelMatrix;
var g_ModelMatrixLoc;
var floatsPerVertex = 7;
var g_lastMS = Date.now();	


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


function getTail(){
    return tailShapes;
}
function initVertexBuffers(){
    makeSmooth0();
    makeSmooth1();
    makeSmooth2();
    makeSmooth3();
    makeSmooth4();
    makeSmooth5();
    makeSmooth6();
    makeSmooth7();
    makeSmooth8();
    makeSmooth9();
    makeSmooth10();
    makeSmooth11();
    makeLeftFin();
    makeRightFin();


    //unmovingTail();

    var mySiz = smooth0Verts.length +
    smooth1Verts.length + 
    smooth2Verts.length + 
    smooth3Verts.length + 
    smooth4Verts.length + 
    smooth5Verts.length + 
    smooth6Verts.length + 
    smooth7Verts.length + 
    smooth8Verts.length +
    smooth9Verts.length +
    smooth10Verts.length+
    smooth11Verts.length
    + leftFinVert.length + rightFinVert.length;

    nn = mySiz / floatsPerVertex;

    var tailShapes = new Float32Array(mySiz);

    startPoint = 0;
    for(i=0, j=0; j < smooth0Verts.length; i++,j++){
        tailShapes[i] = smooth0Verts[j];
    }

    smooth1Start = i;
    for(j=0; j < smooth1Verts.length; i++,j++){
        tailShapes[i] = smooth1Verts[j];
    }
    smooth2Start = i;
    for(j=0; j < smooth2Verts.length; i++,j++){
        tailShapes[i] = smooth2Verts[j];
    }

    smooth3Start = i;
    for(j=0; j < smooth3Verts.length; i++,j++){
        tailShapes[i] = smooth3Verts[j];
    }
    smooth4Start = i;
    for(j=0; j < smooth4Verts.length; i++,j++){
        tailShapes[i] = smooth4Verts[j];
    }

    smooth5Start = i;
    for(j=0; j < smooth5Verts.length; i++,j++){
        tailShapes[i] = smooth5Verts[j];
    }

    smooth6Start = i;
    for(j=0; j < smooth6Verts.length; i++,j++){
        tailShapes[i] = smooth6Verts[j];
    }

    smooth7Start = i;
    for(j=0; j < smooth7Verts.length; i++,j++){
        tailShapes[i] = smooth7Verts[j];
    }

    smooth8Start = i;
    for(j=0; j < smooth8Verts.length; i++,j++){
        tailShapes[i] = smooth8Verts[j];
    }

    smooth9Start = i;
    for(j=0; j < smooth9Verts.length; i++,j++){
        tailShapes[i] = smooth9Verts[j];
    }
    smooth10Start = i;
    for(j=0; j < smooth10Verts.length; i++,j++){
        tailShapes[i] = smooth10Verts[j];
    }

    smooth11Start = i;
    for(j=0; j < smooth11Verts.length; i++,j++){
        tailShapes[i] = smooth11Verts[j];
    }

    finsStart = i;
    for(j=0; j < leftFinVert.length; i++,j++){
        tailShapes[i] = leftFinVert[j];
    }
    for(j=0; j < rightFinVert.length; i++,j++){
        tailShapes[i] = rightFinVert[j];
    }

    endPoint = i;
    

    var shapeBufferID = gl.createBuffer()
    if (!shapeBufferID) {
        console.log('Failed to create the buffer object');
        return -1;	// error code
      }

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferID);

    gl.bufferData(gl.ARRAY_BUFFER, tailShapes, gl.STATIC_DRAW);

    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -2;  // error code
    }

    var FSIZE = tailShapes.BYTES_PER_ELEMENT;

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

function makeSmooth0(){
        smooth0Verts = makeSphere2(13, 17, 8.1, 8.3, -.36, -.15, 0,
            0.06, -.06, .05, -.05);
}
// x1Stretch=0, x2Stretch=0, y1Stretch=0, y2Stretch=0)


function makeSmooth1(){
    smooth1Verts = makeSphere2(13, 17, 8.3, 8.4, -.53, -.3, 0,
        0.08, .01, .07, 0);
}

function makeSmooth2(){
    smooth2Verts = makeSphere2(13, 17, 8.4, 8.5, -.53, -.39, 0,
        0.01, -.01, .07, -0.1);
}

function makeSmooth3(){
    smooth3Verts = makeSphere2(13, 17, 8.5, 8.6, -.44, -.55, 0,
        -0.1, .02, .06, -0.1);
}

function makeSmooth4(){
    smooth4Verts = makeSphere2(13, 17, 8.6, 8.7, -.3, -.73, 0,
        -0.1, .05, .07, 0.01);
}

function makeSmooth5(){
    smooth5Verts = makeSphere2(13, 17, 8.7, 8.8, -.1, -.8, 0,
        -0.1, .05, .07, 0.13);
}

function makeSmooth6(){
    smooth6Verts = makeSphere2(13, 17, 8.8, 8.9, .01, -.71, 0,
        -0.1, .04, .03, 0.09);
}

function makeSmooth7(){
    smooth7Verts = makeSphere2(13, 17, 9, 10, .25, -.63, 1.5,
        -0.14, -.05, .03, 0.14);
}


function makeSmooth8(){
    smooth8Verts = makeSphere2(13, 17, 10, 14, .25, -.50, 1.5,
        -0.05, -.01,  0, 0.13);
}

function makeSmooth9(){
    smooth9Verts = makeSphere2(13, 17, 14, 18, .28, -.3, 1.5,
        -0.03, -.01,  -.01, 0.05);
}

function makeSmooth10(){
    smooth10Verts = makeSphere2(13, 17, 18, 25, .37, -.14, 1.5,
        -0.1, -.09,  -.1, -.01);
}

function makeSmooth11(){
    smooth11Verts = makeSphere2(13, 17, 25, 40, .4, 0, 1.5,
        -0.11, -.09,  -.1, -.01);
}







function animate() {
    var nowMS = Date.now();
    var elapsedMS = nowMS - g_lastMS;
    g_lastMS = nowMS;  
    if(elapsedMS > 1000.0) {            
        elapsedMS = 1000.0/30.0;
    }

    t_angle += t_anglerate * t_brake * (elapsedMS * 0.001);	// update.

    if((t_angle >= t_max && t_anglerate > 0) || // going over max, or
    (t_angle <= t_min && t_anglerate < 0)  ) // going under min ?
        t_anglerate *= -1;	// YES: reverse direction.

    if(t_min > t_max){// if min and max don't limit the angle, then
        if(     t_angle< -180.0) t_angle += 360.0;	// go to >= -180.0 or
        else if(t_angle >  180.0) t_angle -= 360.0;	// go to <= +180.0
    }


    t2_angle += t2_anglerate * t_brake * (elapsedMS * 0.001);	// update.

    if((t2_angle >= t2_max && t2_anglerate > 0) || // going over max, or
    (t2_angle <= t2_min && t2_anglerate < 0)  ) // going under min ?
        t2_anglerate *= -1;	// YES: reverse direction.

    if(t2_min > t2_max){// if min and max don't limit the angle, then
        if(     t2_angle< -180.0) t2_angle += 360.0;	// go to >= -180.0 or
        else if(t2_angle >  180.0) t2_angle -= 360.0;	// go to <= +180.0
    }



    t3_angle += t3_anglerate * t_brake * (elapsedMS * 0.001);	// update.

    if((t3_angle >= t3_max && t3_anglerate > 0) || // going over max, or
    (t3_angle <= t3_min && t3_anglerate < 0)  ) // going under min ?
        t3_anglerate *= -1;	// YES: reverse direction.

    if(t3_min > t3_max){// if min and max don't limit the angle, then
        if(     t3_angle< -180.0) t3_angle += 360.0;	// go to >= -180.0 or
        else if(t3_angle >  180.0) t3_angle -= 360.0;	// go to <= +180.0
    }


}

function drawAll() {

    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setIdentity();

    pushMatrix(modelMatrix);

    //modelMatrix.translate(.4, -.1, 0, 0);

    //modelMatrix.rotate(0, 0, 1, 0);

    modelMatrix.translate(-.29, -.1,0, 0);
    modelMatrix.rotate(t_angle, 0, 0, 1);
    modelMatrix.translate(.29,0.1,0, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, startPoint/floatsPerVertex, smooth4Start/floatsPerVertex);

    //pushMatrix(modelMatrix);

    modelMatrix.translate(-.42, -.63,0, 0);
    modelMatrix.rotate(t_angle, 0, 0, 1);
    modelMatrix.translate(.42,0.63,0, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth4Start/floatsPerVertex, smooth3Start/floatsPerVertex);


    modelMatrix.translate(.07, -.67,0,0);
    modelMatrix.rotate(t2_angle, 0, 0, 1);
    modelMatrix.translate(-.07, 0.67,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth7Start/floatsPerVertex, smooth2Start/floatsPerVertex);
   

    // makeSphere(13, 17, 12, 0.24, -0.36, 0);

    modelMatrix.translate(.24, -.36,0,0);
    modelMatrix.rotate(t3_angle, 0, 0, 1);
    modelMatrix.translate(-.24, 0.36,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth9Start/floatsPerVertex, smooth1Start/floatsPerVertex);


    modelMatrix.translate(.27, -.25,0,0);
    modelMatrix.rotate(t3_angle, 0, 0, 1);
    modelMatrix.translate(-.27, 0.25,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth10Start/floatsPerVertex, smooth2Start/floatsPerVertex);


    modelMatrix.translate(0, .25, .5, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, finsStart/floatsPerVertex, smooth2Start/floatsPerVertex);

    modelMatrix = popMatrix();

}




function TAIL_runStop() {
    if(t_brake > 0.5){
        t_brake = 0.0;	// stop, and change button label:
        document.getElementById("Tbutton").value="Tail Movement OFF";
    }
    else{
        t_brake = 1.0;	// Otherwise, go.
        document.getElementById("Tbutton").value="Tail Movement ON";
    }
}

