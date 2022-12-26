
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
    
    drawChest(g_nVerts);
	

}

function initVertexBuffers(){
    makeChest();
    makeUpperStomach();

    var mySiz = chestVerts.length  + lowStomachVerts.length;

    var nn = mySiz / floatsPerVertex;

    var colorShapes = new Float32Array(mySiz);

    chestStart = 0;
    for(i=0, j=0; j < chestVerts.length; i++,j++){
        colorShapes[i] = chestVerts[j];
    }
    stomStart = i;
    for(j=0; j < lowStomachVerts.length; i++,j++){
        colorShapes[i] = lowStomachVerts[j];
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
// 8, -0.29, -0.1, stom
//9, -0.33, 0.2 //chest
function makeUpperStomach(){
    lowStomachVerts = makeSphere2(13, 17, 9, 10, -.345, -.15, 0,
        0.07, .07, .05, .2);
}

function makeChest(){
   chestVerts = makeSphere2(13, 17, 8, 7, -.37, .03, 0,
        0.07, .07, .1, .22);
}

/*
capVerts, botRadius, topRadius, rotation,
 divTopX, divBotX, addTopX, addBotX,
     divTopY, divBotY, addTopY, addBotY,
    divTopZ, divBotZ, addTopZ, addBotZ){
*/

function drawChest(n) {

    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setIdentity();
    pushMatrix(modelMatrix);
    //modelMatrix.setTranslate( 0.1, 0.2, 0.0);

   //modelMatrix.translate(-0.6,-0.6, 0.0);

    //modelMatrix.scale(br_sizenow, br_sizenow, br_sizenow);
    modelMatrix.rotate(0, 0, 1, 0);
    //modelMatrix.scale(.5, .5, .5);
    //modelMatrix.rotate(0, 0, 1, 0);


    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);


  
}