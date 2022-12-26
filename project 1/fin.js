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
  
      

    drawAll();
  
      
  
  }



  function initVertexBuffers(){  

    makeLeftFin();
    makeRightFin();

    var mySiz = leftFinVert.length + rightFinVert.length;
    nn = mySiz / floatsPerVertex;

    finShapes = new Float32Array(mySiz);

    startPoint = 0;
    for(i=0, j=0; j < leftFinVert.length; i++,j++){
        finShapes[i] = leftFinVert[j];
    }
    for(j=0; j < rightFinVert.length; i++,j++){
        finShapes[i] = rightFinVert[j];
    }
    endPoint = i;

    var shapeBufferID = gl.createBuffer()
    if (!shapeBufferID) {
        console.log('Failed to create the buffer object');
        return -1;	// error code
      }

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferID);

    gl.bufferData(gl.ARRAY_BUFFER, finShapes, gl.STATIC_DRAW);

    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -2;  // error code
    }

    var FSIZE = finShapes.BYTES_PER_ELEMENT;

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

function makeLeftFin(){
    leftFinVert = makeSphere2(13, 17, 14, 70, .37, -.14, 1.5,
        -0.08, -.2,  -.1, .01);
}

function makeRightFin(){
    rightFinVert = makeSphere2(13, 17, 70, 14, .37, -.14, 1.5,
        .1, -.05,  .01, -.1);
}

function drawAll() {


    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setIdentity();


    //modelMatrix.translate(.4, -.1, 0, 0);

    //modelMatrix.rotate(90, 0, 1, 0);


    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, startPoint/floatsPerVertex, endPoint/floatsPerVertex);


    //pushMatrix(modelMatrix);

    //modelMatrix.translate(.4, -.1, 0, 0);

    //modelMatrix.rotate(0, 0, 1, 0);
}