var floatsPerVertex = 7;

function makeSphere(slices, sliceVerts, divBy, xMove, yMove, zMove,
    x1Stretch=0, x2Stretch=0, y1Stretch=0, y2Stretch=0) {
    	// South Pole: brightest gray.
    var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.
    
    sphVerts = new Float32Array(((slices * 2* sliceVerts) -2) * floatsPerVertex);

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
        for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) {	
            if(v%2==0){
                sphVerts[j] = sin0 * Math.cos(Math.PI*(v)/sliceVerts)/divBy + xMove + x1Stretch; 	
                sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts)/divBy + yMove + y1Stretch;	
                sphVerts[j+2] = (cos0 + zMove)/divBy;		
                sphVerts[j+3] = 1.0;			
            }
            
            else { 
                sphVerts[j] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts)/divBy + xMove + x2Stretch;		// x
                sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/divBy + yMove + y2Stretch;		// y
                sphVerts[j+2] = (cos1 + zMove)/divBy;																				// z
                sphVerts[j+3] = 1.0;																				// w.		
            }
            if(s==0) {
                sphVerts[j+4]=Math.random();
                sphVerts[j+5]=Math.random();
                sphVerts[j+6]=Math.random();	
            }
            else if(s==slices-1) {
                sphVerts[j+4]=Math.random();
                sphVerts[j+5]=Math.random();
                sphVerts[j+6]=Math.random();
            }
            else {
                sphVerts[j+4]=Math.random();// equColr[0]; 
                sphVerts[j+5]=Math.random();// equColr[1]; 
                sphVerts[j+6]=Math.random();// equColr[2];					
            }
        }
    }

    return sphVerts;
}


function makeSphere2(slices, sliceVerts, divBy1, divBy2, xMove, yMove, zMove,
    x1Stretch=0, x2Stretch=0, y1Stretch=0, y2Stretch=0) {
    	// South Pole: brightest gray.
    var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.
    
    sphVerts = new Float32Array(((slices * 2* sliceVerts) -2) * floatsPerVertex);

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
        for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) {	
            if(v%2==0){
                sphVerts[j] = sin0 * Math.cos(Math.PI*(v)/sliceVerts)/divBy1 + xMove + x1Stretch; 	
                sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts)/divBy1 + yMove + y1Stretch;	
                sphVerts[j+2] = (cos0 + zMove)/divBy1;		
                sphVerts[j+3] = 1.0;			
            }
            
            else { 
                sphVerts[j] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts)/divBy2 + xMove + x2Stretch;		// x
                sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/divBy2 + yMove + y2Stretch;		// y
                sphVerts[j+2] = (cos1 + zMove)/divBy2;																				// z
                sphVerts[j+3] = 1.0;																				// w.		
            }
                sphVerts[j+4]=Math.random();// equColr[0]; 
                sphVerts[j+5]=Math.random();// equColr[1]; 
                sphVerts[j+6]=Math.random();// equColr[2];					
        }
    }

    return sphVerts;
}



function makeSphere3(slices, sliceVerts, divBy1, divBy2, xMove, yMove, zMove,
    x1Stretch=0, x2Stretch=0, y1Stretch=0, y2Stretch=0, zStretch=0) {
    	// South Pole: brightest gray.
    var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.
    
    sphVerts = new Float32Array(((slices * 2* sliceVerts) -2) * floatsPerVertex);

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
        for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) {	
            if(v%2==0){
                sphVerts[j] = sin0 * Math.cos(Math.PI*(v)/sliceVerts)/divBy1 + xMove + x1Stretch; 	
                sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts)/divBy1 + yMove + y1Stretch;	
                sphVerts[j+2] = (cos0 + zMove)/divBy1 + zStretch;		
                sphVerts[j+3] = 1.0;			
            }
            
            else { 
                sphVerts[j] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts)/divBy2 + xMove + x2Stretch;		// x
                sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/divBy2 + yMove + y2Stretch;		// y
                sphVerts[j+2] = (cos1 + zMove)/divBy2 + zStretch;																				// z
                sphVerts[j+3] = 1.0;																				// w.		
            }
                sphVerts[j+4]=Math.random();// equColr[0]; 
                sphVerts[j+5]=Math.random();// equColr[1]; 
                sphVerts[j+6]=Math.random();// equColr[2];					
        }
    }

    return sphVerts;
}



function makeSphere4(slices, sliceVerts, divBy1, divBy2, divByz1, divByz2, xMove, yMove, zMove,
    x1Stretch=0, x2Stretch=0, y1Stretch=0, y2Stretch=0, zStretch=0) {
    	// South Pole: brightest gray.
    var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.
    
    sphVerts = new Float32Array(((slices * 2* sliceVerts) -2) * floatsPerVertex);

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
        for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) {	
            if(v%2==0){
                sphVerts[j] = sin0 * Math.cos(Math.PI*(v)/sliceVerts)/divBy1 + xMove + x1Stretch; 	
                sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts)/divBy1 + yMove + y1Stretch;	
                sphVerts[j+2] = (cos0 + zMove)/divByz1 + zStretch;		
                sphVerts[j+3] = 1.0;			
            }
            
            else { 
                sphVerts[j] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts)/divBy2 + xMove + x2Stretch;		// x
                sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/divBy2 + yMove + y2Stretch;		// y
                sphVerts[j+2] = (cos1 + zMove)/divByz2 + zStretch;																				// z
                sphVerts[j+3] = 1.0;																				// w.		
            }
                sphVerts[j+4]=Math.random();// equColr[0]; 
                sphVerts[j+5]=Math.random();// equColr[1]; 
                sphVerts[j+6]=Math.random();// equColr[2];					
        }
    }

    return sphVerts;
}


function makeCylinderR(capVerts, botRadius, topRadius, rotation,
     divTopX, divBotX, addTopX, addBotX,
     divTopY, divBotY, addTopY, addBotY,
    divTopZ, divBotZ, addTopZ, addBotZ){
    var j = 0;
    cylVerts = new Float32Array(((capVerts*6) -2) * floatsPerVertex);
    
    for(v=0; v< 6*capVerts; v++, j+=floatsPerVertex) {
        if(v%2==0){		 //connects to elbow
            xpos = topRadius*Math.cos(Math.PI*(v)/capVerts);
			cylVerts[j] = (xpos * Math.cos(rotation) - 1.0 * Math.sin(rotation))/divTopX + addTopX; 			// x
			cylVerts[j+1] = Math.sin(Math.PI*(v)/capVerts) /divTopY + addTopY;		// y
			cylVerts[j+2] = (xpos * -Math.sin(rotation) - 1.0 * Math.cos(rotation))/divTopZ + addTopZ;	// z
			cylVerts[j+3] = 1.0;	// w.

		}
		else{ //connects to wrist
            xpos = botRadius * Math.cos(Math.PI*(v-1)/capVerts);	
            cylVerts[j] = (xpos * Math.cos(rotation) + 1.0 * Math.sin(rotation))/divBotX + addBotX;
            cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts)/divBotY + addBotY;		// y
            cylVerts[j+2] = (xpos * -Math.sin(rotation) + 1.0 * Math.cos(rotation))/divBotZ + addBotZ;
            cylVerts[j+3] = 1.0;	// w.
				// r,g,b = topColr[]
		}
        cylVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
        cylVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
        cylVerts[j+6]= Math.random();//.670 //((Math.random() * (.800 - .650) + .650)); 
	}
    return cylVerts;
}


function makeCylinder(capVerts, botRadius, topRadius, divTopX, divBotX, addTopX, addBotX,
    divTopY, divBotY, addTopY, addBotY,
   divTopZ, divBotZ, addTopZ, addBotZ){
   var j = 0;
   cylVerts = new Float32Array(((capVerts*6) -2) * floatsPerVertex);
   
   for(v=0; v< 6*capVerts; v++, j+=floatsPerVertex) {
       if(v%2==0){		 //connects to elbow
           cylVerts[j] =  topRadius*Math.cos(Math.PI*(v)/capVerts)/divTopX + addTopX; 			// x
           cylVerts[j+1] = Math.sin(Math.PI*(v)/capVerts) /divTopY + addTopY;		// y
           cylVerts[j+2] = -1.0/divTopZ + addTopZ;	// z
           cylVerts[j+3] = 1.0;	// w.

       }
       else{ //connects to wrist
           
           cylVerts[j] =  botRadius * Math.cos(Math.PI*(v-1)/capVerts)/divBotX + addBotX;
           cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts)/divBotY + addBotY;		// y
           cylVerts[j+2] = 1.0/divBotZ + addBotZ;
           cylVerts[j+3] = 1.0;	// w.
               // r,g,b = topColr[]
       }
       cylVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
       cylVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
       cylVerts[j+6]= Math.random();//.670 //((Math.random() * (.800 - .650) + .650)); 
   }
   return cylVerts;
}

function makeCylinderWithBottom(capVerts, botRadius, topRadius, divTopX, divBotX, addTopX, addBotX,
    divTopY, divBotY, addTopY, addBotY,
   divTopZ, divBotZ, addTopZ, addBotZ){
   var j = 0;
   cylVerts = new Float32Array(((capVerts*6) -2) * floatsPerVertex);
   
   for(v=0; v< 4*capVerts; v++, j+=floatsPerVertex) {
       if(v%2==0){		 //connects to elbow
           cylVerts[j] =  topRadius*Math.cos(Math.PI*(v)/capVerts)/divTopX + addTopX; 			// x
           cylVerts[j+1] = Math.sin(Math.PI*(v)/capVerts) /divTopY + addTopY;		// y
           cylVerts[j+2] = -1.0/divTopZ + addTopZ;	// z
           cylVerts[j+3] = 1.0;	// w.

       }
       else{ //connects to wrist
           
           cylVerts[j] =  botRadius * Math.cos(Math.PI*(v-1)/capVerts)/divBotX + addBotX;
           cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts)/divBotY + addBotY;		// y
           cylVerts[j+2] = 1.0/divBotZ + addBotZ;
           cylVerts[j+3] = 1.0;	// w.
               // r,g,b = topColr[]
       }
       cylVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
       cylVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
       cylVerts[j+6]= Math.random();//.670 //((Math.random() * (.800 - .650) + .650)); 
   }
   for(v=0; v < (4*capVerts -1); v++, j+= floatsPerVertex) {
    if(v%2==0) {	// position even #'d vertices around bot cap's outer edge
        cylVerts[j] = botRadius * Math.cos(Math.PI*(v)/capVerts);		// x
        cylVerts[j+1] = botRadius * Math.sin(Math.PI*(v)/capVerts);		// y
        cylVerts[j+2] =-1.0;	// z
        cylVerts[j+3] = 1.0;	// w.
        // r,g,b = topColr[]
	
    }
    else {				// position odd#'d vertices at center of the bottom cap:
        cylVerts[j  ] = 0.0; 			// x,y,z,w == 0,0,-1,1
        cylVerts[j+1] = 0.0;	
        cylVerts[j+2] =-1.0; 
        cylVerts[j+3] = 1.0;			// r,g,b = botColr[]

    }
    cylVerts[j+4]= Math.random();
    cylVerts[j+5]= Math.random();
    cylVerts[j+6]=Math.random();
}
   return cylVerts;
}

function makeCylinderRWithBottom(capVerts, botRadius, topRadius, rotation, divTopX, divBotX, addTopX, addBotX,
    divTopY, divBotY, addTopY, addBotY,
   divTopZ, divBotZ, addTopZ, addBotZ,
   middle){
   var j = 0;
   cylVerts = new Float32Array(((capVerts*6) -2) * floatsPerVertex);
   
   for(v=0; v< 4*capVerts; v++, j+=floatsPerVertex) {
       if(v%2==0){		 //x1
           xpos = topRadius*Math.cos(Math.PI*(v)/capVerts);
           cylVerts[j] = (xpos * Math.cos(rotation) - 1.0 * Math.sin(rotation))/divTopX + addTopX; 			// x
           cylVerts[j+1] = Math.sin(Math.PI*(v)/capVerts) /divTopY + addTopY;		// y
           cylVerts[j+2] = (xpos * -Math.sin(rotation) - 1.0 * Math.cos(rotation))/divTopZ + addTopZ;	// z
           cylVerts[j+3] = 1.0;	// w.

       }
       else{ //x2
           xpos = botRadius * Math.cos(Math.PI*(v-1)/capVerts);	
           cylVerts[j] = (xpos * Math.cos(rotation) + 1.0 * Math.sin(rotation))/divBotX + addBotX;
           cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts)/divBotY + addBotY;		// y
           cylVerts[j+2] = (xpos * -Math.sin(rotation) + 1.0 * Math.cos(rotation))/divBotZ + addBotZ;
           cylVerts[j+3] = 1.0;	// w.
               // r,g,b = topColr[]
       }
       cylVerts[j+4]= Math.random();//.640 //((Math.random() * (.750 - .606) + .606)); 
       cylVerts[j+5]= Math.random();//.486 //((Math.random() * (.600 - .400) + .400)); 
       cylVerts[j+6]= Math.random();//.670 //((Math.random() * (.800 - .650) + .650)); 
   }
   for(v=0; v < (2*capVerts -1); v++, j+= floatsPerVertex) {
    if(v%2==0) {	// position even #'d vertices around bot cap's outer edge
        xpos = botRadius * Math.cos(Math.PI*(v-1)/capVerts);	
        cylVerts[j] = (xpos * Math.cos(rotation) + 1.0 * Math.sin(rotation))/divBotX + addBotX;
        cylVerts[j+1] = Math.sin(Math.PI*(v-1)/capVerts)/divBotY + addBotY;		// y
        cylVerts[j+2] = (xpos * -Math.sin(rotation) + 1.0 * Math.cos(rotation))/divBotZ + addBotZ;
        cylVerts[j+3] = 1.0;	// w.// w.
        // r,g,b = topColr[
    }
    else {				// position odd#'d vertices at center of the bottom cap:
        cylVerts[j  ] = middle; 
        cylVerts[j+1] = 0.1;	
        cylVerts[j+2] = 1.0; 
        cylVerts[j+3] = 1.0;			// r,g,b = botColr[]
    }
    cylVerts[j+4]= Math.random();
    cylVerts[j+5]= Math.random();
    cylVerts[j+6]=Math.random();
}
   return cylVerts;
}



function makeTorus(rbend, rbar, barSlices, barSides, frac, rotation, 
    divBy, addX, addY
    ){									


 torVerts = new Float32Array(floatsPerVertex*(2*barSides*barSlices +2)/frac);

    var thetaStep = 2*Math.PI/barSlices;
    var phiHalfStep = Math.PI/barSides;		
	for(s=0,j=0; s<barSlices; s++) {
		for(v=0; v< 2*barSides; v++, j+=7) {
			if(v%2==0)	{	
                xpos = (rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.cos((s)*thetaStep);
                zpos = -rbar*Math.sin((v)*phiHalfStep);
				torVerts[j] = (xpos * Math.cos(rotation) + zpos * Math.sin(rotation))/divBy + addX;
				torVerts[j+1] = (rbend + rbar*Math.cos((v)*phiHalfStep)) * Math.sin((s)*thetaStep)/divBy + addY;
				torVerts[j+2] = (xpos * -Math.sin(rotation) + zpos * Math.cos(rotation));
				torVerts[j+3] = 1.0;		// w
			}
			else {	
                xpos = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) *  Math.cos((s+1)*thetaStep);
                zpos = -rbar*Math.sin((v-1)*phiHalfStep);
				torVerts[j] = (xpos * Math.cos(rotation) + zpos * Math.sin(rotation))/divBy + addX;
				torVerts[j+1] = (rbend + rbar*Math.cos((v-1)*phiHalfStep)) * Math.sin((s+1)*thetaStep)/divBy + addY;
				torVerts[j+2] = (xpos * -Math.sin(rotation) + zpos * Math.cos(rotation));
								//  z = -rbar  *   sin(phi)
				torVerts[j+3] = 1.0;		// w
			}
			torVerts[j+4] = Math.random();		// random color 0.0 <= R < 1.0
			torVerts[j+5] = Math.random();		// random color 0.0 <= G < 1.0
			torVerts[j+6] = Math.random();		// random color 0.0 <= B < 1.0
		}
	}
	// Repeat the 1st 2 vertices of the triangle strip to complete the torus:
	torVerts[j] = rbend + rbar;	// copy vertex zero;
						  //	x = (rbend + rbar*cos(phi==0)) * cos(theta==0)
	torVerts[j+1] = 0.0;
							//  y = (rbend + rbar*cos(phi==0)) * sin(theta==0) 
	torVerts[j+2] = 0.0;
							//  z = -rbar  *   sin(phi==0)
	torVerts[j+3] = 1.0;		// w
	torVerts[j+4] = Math.random();		// random color 0.0 <= R < 1.0
	torVerts[j+5] = Math.random();		// random color 0.0 <= G < 1.0
	torVerts[j+6] = Math.random();		// random color 0.0 <= B < 1.0
	j+=7; // go to next vertex:
	torVerts[j] = (rbend + rbar) * Math.cos(thetaStep);
						  //	x = (rbend + rbar*cos(phi==0)) * cos(theta==thetaStep)
	torVerts[j+1] = (rbend + rbar) * Math.sin(thetaStep);
							//  y = (rbend + rbar*cos(phi==0)) * sin(theta==thetaStep) 
	torVerts[j+2] = 0.0;
							//  z = -rbar  *   sin(phi==0)
	torVerts[j+3] = 1.0;		// w
	torVerts[j+4] = Math.random();		// random color 0.0 <= R < 1.0
	torVerts[j+5] = Math.random();		// random color 0.0 <= G < 1.0
	torVerts[j+6] = Math.random();		// random color 0.0 <= B < 1.0

    return torVerts;
}