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

  
  var tick = function() {
      animate(); 
      drawAll();
      requestAnimationFrame(tick, canvas); 
  }

  tick();


}


function initVertexBuffers(){
    makeHead();
    makeSnout();
    makeMuzzle();
    makeHorn();
    makeEarRight();
    makeEarLeft();

    var mySize = headVerts.length + snoutVerts.length + muzzleVerts.length
    + hornVerts.length + rightEarVerts.length + leftEarVerts.length;

    var nn =  mySize / floatsPerVertex;

    var fullShapes = new Float32Array(mySize);


    for(i=0,j=0; j< headVerts.length; i++,j++){
        fullShapes[i] = headVerts[j];
    }
    snoutStart = i;
    for(j=0; j< snoutVerts.length; i++,j++){
      fullShapes[i] = snoutVerts[j];
    }
    muzzleStart = i;
    for(j=0; j< muzzleVerts.length; i++,j++){
      fullShapes[i] = muzzleVerts[j];
    }

    hornStart = i;
    for(j=0; j < hornVerts.length; i++,j++){
        fullShapes[i] = hornVerts[j];
    }
  
    rightEarStart = i;
    for(j=0; j < rightEarVerts.length; i++,j++){
        fullShapes[i] = rightEarVerts[j];
    }
    leftEarStart = i;
    for(j=0; j < leftEarVerts.length; i++,j++){
        fullShapes[i] = leftEarVerts[j];
    }

    var shapeBufferID = gl.createBuffer()
    if (!shapeBufferID) {
        console.log('Failed to create the buffer object');
        return -1;	// error code
      }

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBufferID);

    gl.bufferData(gl.ARRAY_BUFFER, fullShapes, gl.STATIC_DRAW);

    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -2;  // error code
    }

    var FSIZE = fullShapes.BYTES_PER_ELEMENT;

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

function makeHead(){
    var slices = 23;
    var sliceVerts = 27;
    var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.


    headVerts = new Float32Array((((slices * 2* sliceVerts)) -2) * floatsPerVertex);

    var cos0 = 0.0;	
    var sin0 = 0.0;
    var cos1 = 0.0;
    var sin1 = 0.0;	
    var j = 0;	
    var isLast = 0;
    var isFirst = 1;
    for(s=0; s<slices; s++) {
        if(s==0) {
            isFirst = 1;
            cos0 = 1.0; 
            sin0 = 0.0;
        }
        else {	
            isFirst = 0;	
            cos0 = cos1;
            sin0 = sin1;
        }	
        
        cos1 = Math.cos((s+1)*sliceAngle);
        sin1 = Math.sin((s+1)*sliceAngle);
        
        if(s==slices-1) isLast=1;
        for(v=isFirst; v < 2*(2*sliceVerts-isLast); v++, j+=floatsPerVertex) {	
            if(v%2==0){
              xpos = sin0 * Math.cos(Math.PI*(v)/sliceVerts);
                headVerts[j] = (xpos * Math.cos(90) + (cos0) * Math.sin(90))/3 + .2; 	
                headVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts)/3 - .1;	
                headVerts[j+2] = (xpos * -Math.sin(90) + (cos0/5) * Math.cos(90))/5;		
                headVerts[j+3] = 1.0;			
            }
            
            else { 
              xpos = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);
                headVerts[j] = (xpos * Math.cos(90) + (cos1) * Math.sin(90))/3 + .2;		// x
                headVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/3  - .1;		// y
                headVerts[j+2] = (xpos * -Math.sin(90) + (cos1/5) * Math.cos(90))/5;																				// z
                headVerts[j+3] = 1.0;																				// w.		
            }
            headVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
            headVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
            headVerts[j+6]= Math.random();// .670 //((Math.random() * (.800 - .650) + .650)); 
          }
        }
}

function makeSnout(){
  var j = 0;
  var capVerts = 16;	// # of vertices around the topmost 'cap' of the shape
  var botRadius = 1.6;		// radius of bottom of cylinder (top always 1.0)
  

  snoutVerts = new Float32Array(((capVerts*6) -2) * floatsPerVertex);



  for(v=0; v< 6*capVerts; v++, j+=floatsPerVertex) {
		if(v%2==0)	// position all even# vertices along top cap:
		{		
      xpos = Math.cos(Math.PI*(v)/capVerts);
			snoutVerts[j] = (xpos * Math.cos(90) - 1.0 * Math.sin(90))/5 - .15; 			// x
			snoutVerts[j+1] = Math.sin(Math.PI*(v)/capVerts) / 4 - .1;		// y
			snoutVerts[j+2] = (xpos * -Math.sin(90) - 1.0 * Math.cos(90))/7;	;	// z
			snoutVerts[j+3] = 1.0;	// w.
				// r,g,b = topColr[]
      snoutVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
      snoutVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
      snoutVerts[j+6]= Math.random();//.670 //((Math.random() * (.800 - .650) + .650)); 	
		}
		else		// position all odd# vertices along the bottom cap:
		{
      xpos = botRadius * Math.cos(Math.PI*(v-1)/capVerts);	
			snoutVerts[j ] = (xpos * Math.cos(90) + 1.0 * Math.sin(90))/5;
			snoutVerts[j+1] = botRadius * Math.sin(Math.PI*(v-1)/capVerts) / 4.6 - .1;		// y
			snoutVerts[j+2] = (xpos * -Math.sin(90) - 1.0 * Math.cos(90))/7 - .1;
				snoutVerts[j+3] = 1.0;	// w.
				// r,g,b = topColr[]
        snoutVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
        snoutVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
        snoutVerts[j+6]= Math.random();//.670 //((Math.random() * (.800 - .650) + .650)); 
		}
	}

}

function makeMuzzle(){
  var slices = 23;
  var sliceVerts = 27;
  var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.

  muzzleVerts = new Float32Array((((slices * 2* sliceVerts)) -2) * floatsPerVertex);

  var cos0 = 0.0;	
  var sin0 = 0.0;
  var cos1 = 0.0;
  var sin1 = 0.0;	
  var j = 0;	
  var isLast = 0;
  var isFirst = 1;
  for(s=0; s<slices; s++) {
      if(s==0) {
          isFirst = 1;
          cos0 = 1.0; 
          sin0 = 0.0;
      }
      else {	
          isFirst = 0;	
          cos0 = cos1;
          sin0 = sin1;
      }	
      
      cos1 = Math.cos((s+1)*sliceAngle);
      sin1 = Math.sin((s+1)*sliceAngle);
      
      if(s==slices-1) isLast=1;
      for(v=isFirst; v < 2*(2*sliceVerts-isLast); v++, j+=floatsPerVertex) {	
        if(v%2==0){
          xpos = sin0 * Math.cos(Math.PI*(v)/sliceVerts);
          muzzleVerts[j] = (xpos * Math.cos(50) + (cos0) * Math.sin(50))/5 - .3; 	
          muzzleVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts)/4 - .1;	
          muzzleVerts[j+2] = (xpos * -Math.sin(50) + (cos0/5) * Math.cos(50))/5;		
          muzzleVerts[j+3] = 1.0;			
        }
        
        else { 
          xpos = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);
          muzzleVerts[j] = (xpos * Math.cos(50) + (cos1) * Math.sin(50))/5 -.3;		// x
          muzzleVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/4  - .1;		// y
          muzzleVerts[j+2] = (xpos * -Math.sin(50) + (cos1/5) * Math.cos(50))/5;																				// z
          muzzleVerts[j+3] = 1.0;																				// w.		
        }
        muzzleVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
        muzzleVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
        muzzleVerts[j+6]= Math.random();// .670 //((Math.random() * (.800 - .650) + .650)); 
      }
    }
}



function makeHorn(){
  var capVerts = 17;	// # of vertices around the topmost 'cap' of the shape
  var botRadius = .01;		// radius of bottom of cylinder (top always 1.0)
  j = 0;

  var sliceAngle = Math.PI/capVerts;	
  var cos1 = Math.cos(sliceAngle);
  hornVerts = new Float32Array(((capVerts*6) -2) * floatsPerVertex);

  for(v=0; v< 6*capVerts; v++, j+=floatsPerVertex) {
		if(v%2==0)	// position all even# vertices along top cap:
		{		
				hornVerts[j] = Math.cos(Math.PI*(v)/capVerts)/15;		// x
				hornVerts[j+1] = Math.sin(Math.PI*(v)/capVerts)/6;		// y
				hornVerts[j+2] = cos1/7;	// z
				hornVerts[j+3] = 1.0;	// w.
				// r,g,b = topColr[]
        hornVerts[j+4]= Math.random();//.803//((Math.random() * (.600 - .418) + .418));
        hornVerts[j+5]= Math.random();//.660//((Math.random() * (.800 - .500) + .500));
        hornVerts[j+6]= Math.random();//.880//((Math.random() * (.600 - .400) + .400));
		}
		else		// position all odd# vertices along the bottom cap:
		{
				hornVerts[j] = botRadius * Math.cos(Math.PI*(v-1)/capVerts)/5;		// x
				hornVerts[j+1] = botRadius * Math.sin(Math.PI*(v-1)/capVerts)/5 + .7;		// y
				hornVerts[j+2] =-cos1/7;	// z
				hornVerts[j+3] = 1.0;	// w.
				// r,g,b = topColr[]
        hornVerts[j+4]=  Math.random();//.660//((Math.random() * (.600 - .418) + .418));
        hornVerts[j+5]= Math.random();//.840 //((Math.random() * (.800 - .500) + .500));
        hornVerts[j+6]= Math.random();//.605 //((Math.random() * (.600 - .400) + .400));	
		}
	}
}


function makeEarRight(){
  //inner and outter
  rightEarVerts = new Float32Array([
    //outter ear outward facing
    -.4, .1, -.18, 1.0, 0.606, 0.429, 0.650, //base back
    -0.3, 0.4, -.15, 1.0, .746, 0.569, 0.790, //tip
    -0.3, -.005, -0.16, 1.0, 0.640, 0.486,0.670, //base front

    //outterear inward facing
    -.4, .1, -.156, 1.0, .595, 0.454, 0.630, //base back
    -0.3, 0.4, -.15, 1.0, .690, 0.569, .720, //tip
    -0.23, 0.1, -0.1, 1.0, 0.643, 0.496, 0.680, //base front

    //inner ear 1
    -0.3, -.005, -0.157, 1.0, 0.871, 0.612,0.900, //base front
    -0.3, 0.4, -.15, 1.0, 0.871, 0.612,0.900,  //tip
    -.267, .08, -.13, 1.0, 0.606, 0.429, 0.650, //base back

    //inner ear 2
    -0.231, 0.1, -0.1, 1.0, 0.871, 0.612,0.900, //base front
    -0.3, 0.4, -.15, 1.0, 0.871, 0.612,0.900,  //tip
    -.4, .1, -.156, 1.0, 0.606, 0.429, 0.650, //base back


  ]);

}

function makeEarLeft(){
  //inner and outter
  leftEarVerts = new Float32Array([
    //outter ear outward facing
    -.1, .1, .1, 1.0, 0.606, 0.429, 0.650, //base back
   - 0.1, 0.4, .015, 1.0, .746, 0.569, 0.790, //tip
   - 0.1, -.005, 0.016, 1.0, 0.640, 0.486,0.670, //base front

    //outterear inward facing
    -.1, .1, .158, 1.0, .595, 0.454, 0.630, //base back
   - 0.1, 0.4, .16, 1.0, .780, 0.569, .720, //tip
    -0.135, 0.1, 0.15, 1.0, 0.643, 0.496, 0.680, //base front

    //inner ear 1
    -0.1, -.005, 0.157, 1.0, 0.801, 0.612,0.900, //base front
    -0.1, 0.4, .15, 1.0, 0.800, 0.612,0.900,  //tip
    -.267, .08, .13, 1.0, 0.606, 0.429, 0.650, //base back

    //inner ear 2
    -0.131, 0.1, 0.1, 1.0, 0.871, 0.670,0.900, //base front
    -0.1, 0.4, .15, 1.0, 0.871, 0.610,0.900,  //tip
   - .2, .1, .156, 1.0, 0.806, 0.429, 0.650, //base back


  ]);

}

function drawAll() {

    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelMatrix.setIdentity();

    //modelMatrix.translate(-.3, .6, 0, 0);
    
    pushMatrix(modelMatrix);
  
    modelMatrix.rotate(0, 0, 1, 0);

    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, hornStart/floatsPerVertex);

    modelMatrix.rotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLE_STRIP, hornStart/floatsPerVertex, hornVerts.length/floatsPerVertex-1);
    
    modelMatrix.rotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, rightEarStart/floatsPerVertex, rightEarVerts.length/floatsPerVertex);

    //modelMatrix.rotate(90, 0, 1, 0);
    gl.uniformMatrix4fv(g_ModelMatrixLoc, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, leftEarStart/floatsPerVertex, leftEarVerts.length/floatsPerVertex);
    modelMatric = popMatrix();
    pushMatrix(modelMatrix);

  
}


function animate() {
  var nowMS = Date.now();
  var elapsedMS = nowMS - g_lastMS;
  g_lastMS = nowMS;  
  if(elapsedMS > 1000.0) {            
      elapsedMS = 1000.0/30.0;
  }




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
