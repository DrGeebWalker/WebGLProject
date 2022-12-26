
//head

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
            muzzleVerts[j+2] = (xpos * -Math.sin(50) + (cos0/5) * Math.cos(50))/2;		
            muzzleVerts[j+3] = 1.0;			
          }
          
          else { 
            xpos = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);
            muzzleVerts[j] = (xpos * Math.cos(50) + (cos1) * Math.sin(50))/5 -.3;		// x
            muzzleVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/4  - .1;		// y
            muzzleVerts[j+2] = (xpos * -Math.sin(50) + (cos1/5) * Math.cos(50))/2;																				// z
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
  
//end head

//neck
function makeNeck1(){
    neck1Verts = makeSphere2(57, 57, 4, 4, -.6, -.6, .007,
        0.5, .35, 0, .4);
 }

 function makeNeck2(){
    neck2Verts =   makeSphere2(23, 17, 15, 9, -.28, .4, .007,
        .03, 0, .05, -.1);
 }

//end of neck


//chest
function makeChest(){
    chestVerts = makeSphere2(13, 17, 8, 7, -.37, .03, 0,
         0.07, .07, .1, .22);
 }
 
function makeUpperStomach(){
    lowStomachVerts = makeSphere2(13, 17, 9, 10, -.345, -.15, 0,
        0.07, .07, .05, .2);
}



//end chest

//arm
function makeLShJnt(){
    lshVerts = makeSphere(13, 17, 20, -0.33, 0.25, 0.5);
}

function makeLElJnt(){
    leVerts = makeSphere(13, 17, 25, -.55, 0.35, 0.5);
}

function makeLWrJnt(){
    lwrVerts = makeSphere(13, 17, 27, -0.60, 0.10, 0.5);
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

//end arm

//tail

function makeSmooth0(){
    smooth0Verts = makeSphere2(13, 17, 8.1, 8.3, -.36, -.15, 0,
        0.06, -.06, .05, -.05);
}

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
smooth10Verts = makeSphere3(13, 17, 18, 25, .37, -.14, 1.5,
    -0.1, -.09,  -.1, -.01, .2);
}

function makeSmooth11(){
smooth11Verts = makeSphere3(13, 17, 25, 40, .4, 0, 1.5,
    -0.11, -.09,  -.1, -.01, .2);
}

function makeLeftFin(){
    leftFinVert = makeSphere4(13, 17, 14, 70, 20, 90, .37, -.14, 1.5,
        -0.08, -.2,  -.1, .01, -.35);
}

function makeRightFin(){
    rightFinVert = makeSphere4(13, 17, 70, 14, 90, 20, .37, -.14, 1.5,
        .1, -.05,  .01, -.1, -.35);
}
//end tail