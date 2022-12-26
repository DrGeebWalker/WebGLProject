

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

//breathing
var maxscale = 1.0;
var minscale = .98;
var br_rate = -0.03;
var br_sizebrake= 1.0;
var br_sizenow = 1.0;

//end of breathing

//wiggle

//end of wiggle

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
    makeHead();
    makeChest();

    //arms
    makeLShJnt();
    makeRShJnt();
    makeLElJnt();
    makeRElJnt();
    makeLWrJnt();
    makeRWrJnt();

    makeStomach();
    makeTailJoint1();
    makeTailJoint2();
    makeTailJoint3();
    makeTailJoint4();
    makeTailJoint5();
    makeFin();



    var mySiz = headVerts.length + 
        chestVerts.length + lshVerts.length +
        rshVerts.length + leVerts.length +
        reVerts.length + lwrVerts.length +
        rwrVerts.length + 
        stomachVerts.length +
        tailJ1Verts.length + tailJ2Verts.length +
        tailJ3Verts.length + tailJ4Verts.length +
        tailJ5Verts.length + finVerts.length;

    var nn = mySiz / floatsPerVertex;

    var colorShapes = new Float32Array(mySiz);

    skelStart = 0;
    for(i=0,j=0; j< headVerts.length; i++,j++){
        colorShapes[i] = headVerts[j];
    }

    chestStart = i;
    for(j=0; j < chestVerts.length; i++,j++){
        colorShapes[i] = chestVerts[j];
    }
    
    //arms
    leftShoulderStart = i;
    for(j=0; j < lshVerts.length; i++,j++){
        colorShapes[i] = lshVerts[j];
    }

    rightShoulderStart = i;
    for(j=0; j < rshVerts.length; i++,j++){
        colorShapes[i] = rshVerts[j];
    }
    
    leftElbowStart = i;
    for(j=0; j < leVerts.length; i++,j++){
        colorShapes[i] = leVerts[j];
    }
    
    rightElbowStart = i;
    for(j=0; j < reVerts.length; i++,j++){
        colorShapes[i] = reVerts[j];
    }
    
    leftWristStart = i;
    for(j=0; j < lwrVerts.length; i++,j++){
        colorShapes[i] = lwrVerts[j];
    }
    
    rightWristStart = i;
    for(j=0; j < rwrVerts.length; i++,j++){
        colorShapes[i] = rwrVerts[j];
    }

    //end of arms
    stomachStart = i;
    for(j=0; j < stomachVerts.length; i++,j++){
        colorShapes[i] = stomachVerts[j];
    }
    tailJ1Start = i;
    for(j=0; j < tailJ1Verts.length; i++,j++){
        colorShapes[i] = tailJ1Verts[j];
    }
    tailJ2Start = i;
    for(j=0; j < tailJ2Verts.length; i++,j++){
        colorShapes[i] = tailJ2Verts[j];
    }

    tailJ3Start = i;
    for(j=0; j < tailJ3Verts.length; i++,j++){
        colorShapes[i] = tailJ3Verts[j];
    }
    tailJ4Start = i;
    for(j=0; j < tailJ4Verts.length; i++,j++){
        colorShapes[i] = tailJ4Verts[j];
    }
    tailJ5Start = i;
    for(j=0; j < tailJ5Verts.length; i++,j++){
        colorShapes[i] = tailJ5Verts[j];
    }
    finStart = i;
    for(j=0; j < finVerts.length; i++,j++){
        colorShapes[i] = finVerts[j];
    }

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
//pink top
function makeHead(){
    headVerts = makeSphere(13, 17, 12, -0.25, 0.55, 0, .8, .42, .83);
}

//blue top
function makeChest(){
    chestVerts = makeSphere(13, 17, 9, -0.33, 0.2, 0);
}


//this shit is gonna need to be roatated
//arms start

function makeLShJnt(){
    lshVerts = makeSphere(13, 17, 20, -0.33, 0.25, 0.5);
}


function makeRShJnt(){
    rshVerts = makeSphere(13, 17, 20, -0.33, 0.25, -0.5);
}


function makeLElJnt(){
    leVerts = makeSphere(13, 17, 25, -.55, 0.35, 0.5);
}

function makeRElJnt(){
    reVerts = makeSphere(13, 17, 20, -0.55, 0.35, -0.5);
}


function makeLWrJnt(){
    lwrVerts = makeSphere(13, 17, 27, -0.60, 0.10, 0.5);
}

function makeRWrJnt(){
    rwrVerts = makeSphere(13, 17, 20, -0.60, 0.10, -0.5);
}

//arms end

//green
function makeStomach(){
    stomachVerts = makeSphere(13, 17, 8, -0.29, -0.1, 0);
}


function makeTailJoint1(){
    tailJ1Verts = makeSphere(13, 17, 8.5, -0.56, -0.3, 0);
}

//darker purple
function makeTailJoint2(){
    tailJ2Verts = makeSphere(13, 17, 9, -0.44, -0.65, 0);
}

//dark yellow
function makeTailJoint3(){
    tailJ3Verts = makeSphere(13, 17, 9.5, -0.05, -0.7, 0);
}

//brown
function makeTailJoint4(){
    tailJ4Verts = makeSphere(13, 17, 11, 0.20, -0.5, 0);
}

//bright purple
function makeTailJoint5(){
    tailJ5Verts = makeSphere(13, 17, 13, 0.29, -0.25, 0);
}

//weird orange
function makeFin(){
    finVerts = makeSphere(13, 17, 18, 0.29, 0.0, 0);
}



//function myMouseMove(ev) {

function animate() {
    var nowMS = Date.now();
    var elapsedMS = nowMS - g_lastMS;
    g_lastMS = nowMS;  
    if(elapsedMS > 1000.0) {            
        elapsedMS = 1000.0/30.0;
    }



}


function drawAll(n) {

    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setIdentity();
    pushMatrix(modelMatrix);
    //modelMatrix.setTranslate( 0.1, 0.2, 0.0);

   //modelMatrix.translate(-0.6,-0.6, 0.0);

    //modelMatrix.scale(br_sizenow, br_sizenow, br_sizenow);
    //modelMatrix.rotate(50, 0, 1, 0);
    //modelMatrix.scale(.5, .5, .5);
    //modelMatrix.rotate(0, 0, 1, 0);

    modelMatric = popMatrix();
    pushMatrix(modelMatrix);

    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);


  
}


function HeadBuck_runStop() {
    //==============================================================================
      if(hm_sizebrake > 0.5)	// if running,
      {
          hm_sizebrake = 0.0;	// stop, and change button label:
          document.getElementById("HMbutton").value="Head Movement OFF";
        }
      else 
      {
          hm_sizebrake = 1.0;	// Otherwise, go.
          document.getElementById("HMbutton").value="Head Movement ON";
        }
}
