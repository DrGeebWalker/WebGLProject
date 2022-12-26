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
var modelMatrix = new Matrix4();;
var g_ModelMatrixLoc;
var floatsPerVertex = 7;
var g_lastMS = Date.now();



//head movement
//up and down
var hm_brake = 1.0;
var hm_angle = 0.0;
var hm_anglerate = -11.0;       // init Rotation angle rate, in degrees/second.
var hm_min  = -20.0;       // init min, max allowed angle, in degrees.
var hm_max  =  5.0;


//up and down
var hs_brake = 1.0;
var hs_angle = 0.0;
var hs_anglerate = -70.0;       
var hs_min  = -10.0;       
var hs_max  =  60.0;
//side to side

//end of head movement 


//arm movement
//shoulder movement
var sh_anglerate = -10.0; 
var el_anglerate = -15.0;    
var hoof_anglerate = -20.0; 



var arm_brake = 1.0;
var sh_angle = 0.0; 

// init Rotation angle rate, in degrees/second.
var sh_min  = -10.0;       // init min, max allowed angle, in degrees.
var sh_max  =  10.0;

//end from shoulder

//from elbow movement
var el_angle = 0.0;     
var el_min  = -15.0;    
var el_max  =  5.0;

//end from elbow

//hoof movement
var hoof_angle = 0.0;
var hoof_min  = -90.0;    
var hoof_max  =  5.0;

//end of arms


//tail
var t_brake = 1.0;
var t_angle = 0.0;
var t_anglerate = -10.0;       // init Rotation angle rate, in degrees/second.
var t_min  = -20.0;       // init min, max allowed angle, in degrees.
var t_max  =  5.0;


var t2_angle = 0.0;
var t2_anglerate = -10.0;       // init Rotation angle rate, in degrees/second.
var t2_min  = -2.0;       // init min, max allowed angle, in degrees.
var t2_max  =  50.0;



var t3_angle = 0.0;
var t3_anglerate = -11.0;       // init Rotation angle rate, in degrees/second.
var t3_min  = -50.0;       // init min, max allowed angle, in degrees.
var t3_max  =  60.0;

//fin
var f_brake = 1.0;
var f_angle = 0.0;
var f_anglerate = -250.0;       // init Rotation angle rate, in degrees/second.
var f_min  = -50.0;       // init min, max allowed angle, in degrees.
var f_max  =  180.0;



//end of tail movement

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
    


    window.addEventListener("mousemove", myMouseOver); 

    
    var tick = function() {
        animate(); 
        drawAll(g_nVerts);
        requestAnimationFrame(tick, canvas); 
    }

    tick();
	

}


function initVertexBuffers(){

    //horse head
    makeHead();
    makeSnout();
    makeMuzzle();
    makeHorn();
    makeEarRight();
    makeEarLeft();
    //horse head

    //neck
    makeNeck1();
    makeNeck2();
    //end neck

    //chest 
    makeChest();
    makeUpperStomach();
    //arms
    makeLShJnt();
    makeLElJnt();
    makeLWrJnt();
    makeUpperArm();
    makeForeArm();
    makeHoof();
    //end of arms

    //tail
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
    //end of tail 


    headlength = headVerts.length + snoutVerts.length + muzzleVerts.length +
        hornVerts.length + rightEarVerts.length + leftEarVerts.length + neck1Verts.length
        + neck2Verts.length;
        
    chestLength =  chestVerts.length + lowStomachVerts.length;

    armLength = lshVerts.length +  leVerts.length + lwrVerts.length +
    upperArmVerts.length + foreArmVerts.length + hoofVerts.length;

    tailLength =  smooth0Verts.length +
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

    var mySiz = headlength + armLength + tailLength + chestLength;

    var nn = mySiz / floatsPerVertex;

    var colorShapes = new Float32Array(mySiz);
    
    //head start
    headstart = 0;
    for(i=0,j=0; j< headVerts.length; i++,j++){
        colorShapes[i] = headVerts[j];
    }
    snoutStart = i;
    for(j=0; j< snoutVerts.length; i++,j++){
      colorShapes[i] = snoutVerts[j];
    }
    muzzleStart = i;
    for(j=0; j< muzzleVerts.length; i++,j++){
      colorShapes[i] = muzzleVerts[j];
    }

    hornStart = i;
    for(j=0; j < hornVerts.length; i++,j++){
        colorShapes[i] = hornVerts[j];
    }
    rightEarStart = i;
    for(j=0; j < rightEarVerts.length; i++,j++){
        colorShapes[i] = rightEarVerts[j];
    }
    leftEarStart = i;
    for(j=0; j < leftEarVerts.length; i++,j++){
        colorShapes[i] = leftEarVerts[j];
    }

    neck1Start = i;
    for(j=0; j < neck1Verts.length; i++,j++){
        colorShapes[i] = neck1Verts[j];
    }
    neck2Start = i;
    for(j=0; j < neck2Verts.length; i++,j++){
        colorShapes[i] = neck2Verts[j];
    }
    //head end


    //chest start
    chestStart = i;
    for(j=0; j < chestVerts.length; i++,j++){
        colorShapes[i] = chestVerts[j];
    }
    stomStart = i;
    for(j=0; j < lowStomachVerts.length; i++,j++){
        colorShapes[i] = lowStomachVerts[j];
    }
    chestEnd= i;
    

    //arms
    armStart = i;
    for(j=0; j< lshVerts.length; i++,j++){
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
    //end of arms


    //tail
    tailStart = i;
    for(j=0; j < smooth0Verts.length; i++,j++){
        colorShapes[i] = smooth0Verts[j];
    }

    smooth1Start = i;
    for(j=0; j < smooth1Verts.length; i++,j++){
        colorShapes[i] = smooth1Verts[j];
    }
    smooth2Start = i;
    for(j=0; j < smooth2Verts.length; i++,j++){
        colorShapes[i] = smooth2Verts[j];
    }

    smooth3Start = i;
    for(j=0; j < smooth3Verts.length; i++,j++){
        colorShapes[i] = smooth3Verts[j];
    }
    smooth4Start = i;
    for(j=0; j < smooth4Verts.length; i++,j++){
        colorShapes[i] = smooth4Verts[j];
    }

    smooth5Start = i;
    for(j=0; j < smooth5Verts.length; i++,j++){
        colorShapes[i] = smooth5Verts[j];
    }

    smooth6Start = i;
    for(j=0; j < smooth6Verts.length; i++,j++){
        colorShapes[i] = smooth6Verts[j];
    }

    smooth7Start = i;
    for(j=0; j < smooth7Verts.length; i++,j++){
        colorShapes[i] = smooth7Verts[j];
    }

    smooth8Start = i;
    for(j=0; j < smooth8Verts.length; i++,j++){
        colorShapes[i] = smooth8Verts[j];
    }

    smooth9Start = i;
    for(j=0; j < smooth9Verts.length; i++,j++){
        colorShapes[i] = smooth9Verts[j];
    }
    smooth10Start = i;
    for(j=0; j < smooth10Verts.length; i++,j++){
        colorShapes[i] = smooth10Verts[j];
    }

    smooth11Start = i;
    for(j=0; j < smooth11Verts.length; i++,j++){
        colorShapes[i] = smooth11Verts[j];
    }

    finsStart = i;
    for(j=0; j < leftFinVert.length; i++,j++){
        colorShapes[i] = leftFinVert[j];
    }
    for(j=0; j < rightFinVert.length; i++,j++){
        colorShapes[i] = rightFinVert[j];
    }

    tailEnd = i;
    //skell end


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


function animate() {
    var nowMS = Date.now();
    var elapsedMS = nowMS - g_lastMS;
    g_lastMS = nowMS;  
    if(elapsedMS > 1000.0) {            
        elapsedMS = 1000.0/30.0;
    }

    animateHooves(elapsedMS);
    animateTail(elapsedMS);
    animateFin(elapsedMS);
    animateHead(elapsedMS);
    animateHeadShake(elapsedMS);
}

function animateHead(elapsedMS){

    hm_angle += hm_anglerate * hm_brake * (elapsedMS * 0.001);	// update.

    if((hm_angle >= hm_max && hm_anglerate > 0) || // going over max, or
    (hm_angle <= hm_min && hm_anglerate < 0)  ) // going under min ?
        hm_anglerate *= -1;	// YES: reverse direction.

    if(hm_min > hm_max){// if min and max don't limit the angle, then
        if(hm_angle< -180.0) hm_angle += 360.0;	// go to >= -180.0 or
        else if(hm_angle >  180.0) hm_angle -= 360.0;	// go to <= +180.0
    }

}

function animateHeadShake(elapsedMS){
    hs_angle += hs_anglerate * hs_brake * (elapsedMS * 0.001);	// update.

    if((hs_angle >= hs_max && hs_anglerate > 0) || // going over max, or
    (hs_angle <= hs_min && hs_anglerate < 0)  ) // going under min ?
        hs_anglerate *= -1;	// YES: reverse direction.

    if(hs_min > hs_max){// if min and max don't limit the angle, then
        if(hs_angle< -180.0) hs_angle += 360.0;	// go to >= -180.0 or
        else if(hs_angle >  180.0) hs_angle -= 360.0;	// go to <= +180.0
    }

}



function animateHooves(elapsedMS){
    
    sh_angle += sh_anglerate * arm_brake * (elapsedMS * 0.001);	// update.

    if((sh_angle >= sh_max && sh_anglerate > 0) || // going over max, or
    (sh_angle <= sh_min && sh_anglerate < 0)  ) // going under min ?
        sh_anglerate *= -1;	// YES: reverse direction.

    if(sh_min > sh_max){// if min and max don't limit the angle, then
        if(     sh_angle< -180.0) sh_angle += 360.0;	// go to >= -180.0 or
        else if(sh_angle >  180.0) sh_angle -= 360.0;	// go to <= +180.0
    }

    //elbow movement
    el_angle += el_anglerate * arm_brake * (elapsedMS * 0.001);	// update.

    if((el_angle >= el_max && el_anglerate > 0) || // going over max, or
    (el_angle <= sh_min && el_anglerate < 0)  ) // going under min ?
        el_anglerate *= -1;	// YES: reverse direction.

    if(el_min > el_max){// if min and max don't limit the angle, then
        if(     el_angle< -180.0) el_angle += 360.0;	// go to >= -180.0 or
        else if(el_angle >  180.0) el_angle -= 360.0;	// go to <= +180.0
    }

    //hoof movement
    hoof_angle += hoof_anglerate * arm_brake * (elapsedMS * 0.001);	// update.

    if((hoof_angle >= hoof_max && hoof_anglerate > 0) || // going over max, or
    (hoof_angle <= hoof_min && hoof_anglerate < 0)  ) // going under min ?
        hoof_anglerate *= -1;	// YES: reverse direction.

    if(hoof_min > hoof_max){// if min and max don't limit the angle, then
        if(     hoof_angle< -180.0) hoof_angle += 360.0;	// go to >= -180.0 or
        else if(hoof_angle >  180.0) hoof_angle -= 360.0;	// go to <= +180.0
    }
}

function animateTail(elapsedMS){

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

function animateFin(elapsedMS){
    f_angle += f_anglerate * f_brake * (elapsedMS * 0.001);	// update.

    if((f_angle >= f_max && f_anglerate > 0) || // going over max, or
    (f_angle <= f_min && f_anglerate < 0)  ) // going under min ?
        f_anglerate *= -1;	// YES: reverse direction.

    if(f_min > f_max){// if min and max don't limit the angle, then
        if(     f_angle< -180.0) f_angle += 360.0;	// go to >= -180.0 or
        else if(f_angle >  180.0) f_angle -= 360.0;	// go to <= +180.0
    }
}
//draws
function drawHorseHead(){
    pushMatrix(modelMatrix);
 
    modelMatrix.translate(-.3, .6, -.3, 0);
    modelMatrix.scale(.3, .3, .3);

    //-.31, .45,
    modelMatrix.translate(.05, .05, .05, 0);
    modelMatrix.rotate(hs_angle, 0, 1, 0);

    modelMatrix.rotate(hm_angle, 0, 0, 1);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, headstart, hornStart/floatsPerVertex);

    modelMatrix.rotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, hornStart/floatsPerVertex, hornVerts.length/floatsPerVertex-1);
    
    modelMatrix.rotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, rightEarStart/floatsPerVertex, rightEarVerts.length/floatsPerVertex);


    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, leftEarStart/floatsPerVertex, leftEarVerts.length/floatsPerVertex);

    modelMatrix.rotate(hm_angle, 0, 0, 1);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, neck1Start/floatsPerVertex, neck1Verts.length/floatsPerVertex);

    modelMatrix.translate(-.05, -.05, -.05, 0);

    modelMatrix = popMatrix();
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, neck2Start/floatsPerVertex, neck2Verts.length/floatsPerVertex);


    
   //gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    //gl.drawArrays(gl.TRIANGLE_STRIP, neck2Start/floatsPerVertex, neck2Verts.length/floatsPerVertex);
    //modelMatrix = popMatrix();
}


function drawLeg(addTime){
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, armStart/floatsPerVertex,  lshVerts.length/floatsPerVertex);

    pushMatrix(modelMatrix);

    //shoulder down movement
    modelMatrix.translate(-.33,0.25,0,0);

    if (addTime == 1) modelMatrix.rotate(-sh_angle, 0, 0, 1);
    else modelMatrix.rotate(sh_angle, 0, 0, 1);

    modelMatrix.translate(.33,-0.25,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, upperArmStart/floatsPerVertex, upperArmVerts.length/floatsPerVertex);

    //elbow
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, elbowStart/floatsPerVertex, leVerts.length/floatsPerVertex);

    //elbow down movement
    modelMatrix.translate(-.55,0.35,0,0);
    if (addTime == 1)  modelMatrix.rotate(-el_angle, 0, 0, 1);
    else modelMatrix.rotate(el_angle, 0, 0, 1);
    modelMatrix.translate(.55,-0.35,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, forearmStart/floatsPerVertex, foreArmVerts.length/floatsPerVertex);

    //wrist
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, wristStart/floatsPerVertex, lwrVerts.length/floatsPerVertex);

    //wrist down movement
    modelMatrix.translate(-.60,0.10,0,0);
     modelMatrix.rotate(hoof_angle, 0, 0, 1);
    modelMatrix.translate(.60,-0.10,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, hoofStart/floatsPerVertex, hoofVerts.length/floatsPerVertex);

    modelMatrix = popMatrix();
    



}


function drawTail(){

    //modelMatrix.translate(.4, -.1, 0, 0);

    //modelMatrix.rotate(0, 0, 1, 0);

    pushMatrix(modelMatrix);

    modelMatrix.translate(-.29, -.1,0, 0);
    modelMatrix.rotate(t_angle, 0, 0, 1);
     modelMatrix.translate(.29,0.1,0, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, tailStart/floatsPerVertex, smooth0Verts.length*4/floatsPerVertex);

    //pushMatrix(modelMatrix);

   modelMatrix.translate(-.42, -.63,0, 0);
   modelMatrix.rotate(t_angle, 0, 0, 1);
   modelMatrix.translate(.42,0.63,0, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth4Start/floatsPerVertex, smooth0Verts.length*3/floatsPerVertex);

    
   modelMatrix.translate(.07, -.67,0,0);
   modelMatrix.rotate(t2_angle, 0, 0, 1);
   modelMatrix.translate(-.07, 0.67,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth7Start/floatsPerVertex, smooth0Verts.length*2/floatsPerVertex);
   

    // makeSphere(13, 17, 12, 0.24, -0.36, 0);

    


    modelMatrix.translate(.24, -.36,0,0);
    modelMatrix.rotate(t3_angle, 0, 0, 1);
    modelMatrix.translate(-.24, 0.36,0,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth9Start/floatsPerVertex, smooth0Verts.length/floatsPerVertex);
    modelMatrix.translate(.27, -.25,0,0);
    modelMatrix.rotate(t3_angle, 0, 0, 1);
    modelMatrix.translate(-.27, 0.25,0,0);

   // modelMatrix.rotate(0, 0, 1,0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, smooth10Start/floatsPerVertex, smooth0Verts.length*2/floatsPerVertex);

    
    //modelMatrix.rotate(f_angle, 0, 1, 0);
    pushMatrix(modelMatrix);

    modelMatrix.translate(.3, -.05,.25,0);
    modelMatrix.rotate(f_angle, 1, 1, 0);
    modelMatrix.translate(-.3, .05,-.25,0);

    modelMatrix.translate(0, .25, .5, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, finsStart/floatsPerVertex, leftFinVert.length*2/floatsPerVertex);
    
    
    modelMatrix = popMatrix();
    
    modelMatrix = popMatrix();

}

function drawAll(n) {

    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setIdentity();
    
    pushMatrix(modelMatrix);
    modelMatrix.translate(0.01, 0.05,0.29);
    drawLeg();
    
    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
    //modelMatrix.translate(0,0.06,-0.03);
    //modelMatrix.rotate(12, 0, 0, 1);
    modelMatrix.translate(-.04, 0.05,-0.7);
    drawLeg(1);
    modelMatrix = popMatrix();
    

    pushMatrix(modelMatrix);
    drawTail();
    modelMatric = popMatrix();

    
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, chestStart/floatsPerVertex, chestLength/floatsPerVertex);

    modelMatric = popMatrix();
    pushMatrix(modelMatrix);
    drawHorseHead();
    
    modelMatric = popMatrix();
    
}


function getRelativeMousePosition(event, target) {
    target = target || event.target;
    var rect = target.getBoundingClientRect();
  
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function myMouseOver(ev){

    //check if over head or tail
    //let's start with tail
    var pos = getRelativeMousePosition(ev);
    const x = pos.x / gl.canvas.width  *  2 - 1;
    const y = pos.y / gl.canvas.height * -2 + 1;

    //hw_brake = 0.0;

    if (x > -.7 && x < 0.3){
        if(y < 0 && y > -.8){
            f_brake = 1.0;
            hs_brake = 0.0;
        }
        else if (x > -.5 && x < -.05 
            && y < .8 && y > .3){
                hs_brake = 1.0;
                f_brake = 0.0
        }

    }
    else{
        f_brake = 0.0;
        hs_brake = 0.0;

    }



}





function HeadBuck_runStop() {
    //==============================================================================
      if(hm_brake > 0.5)	// if running,
      {
          hm_brake = 0.0;	// stop, and change button label:
          document.getElementById("HMbutton").value="Head Movement OFF";
        }
      else 
      {
          hm_brake = 1.0;	// Otherwise, go.
          document.getElementById("HMbutton").value="Head Movement ON";
        }
}

function ARM_runStop() {
    if(arm_brake > 0.5){
        arm_brake = 0.0;	// stop, and change button label:
        document.getElementById("ARMbutton").value="Arm Movement OFF";
    }
    else{
        arm_brake = 1.0;	// Otherwise, go.
        document.getElementById("ARMbutton").value="Arm Movement ON";
    }
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

