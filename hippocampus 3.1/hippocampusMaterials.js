//create texture

function initTextures(gl, n){
    hornTexture = gl.createTexture();

    hornImage = new Image();
}

function colorHippoCampus(){
    buildHippocampus();

    colors = new Float32Array(hippShapes.length/4 * 3);

    //color head
        //color horn
            vertNum = rightEarStart/7;
            for(i = 0, j = 0; j < vertNum; j++, i+=3){
                colors[i] = 0.443;
                colors[i+1] = 0.590;
                colors[i+2] = 0.556;
            }

        //right ear
            vertNum = innerEarRStart/7;
            for(j = 0; j < vertNum; j++, i+=3){
                colors[i] = 0.257;
                colors[i+1] = 0.570;
                colors[i+2] = 0.533;
            }

            //inner ears have different colors
            vertNum = innerEarRVerts.length/7;
            for(j = 0; j < vertNum; j++, i+=3){
                colors[i] = 0.499;
                colors[i+1] = 0.0300;
                colors[i+2] = 1.00;
            }

        
            vertNum = (innerEarRTopVerts.length + 
                        baseInnerRVerts.length 
                        + topInnerRVerts.length)/7;
            
            for(j = 0; j < vertNum; j++, i+=3){
                colors[i] = 0.257;
                colors[i+1] = 0.70;
                colors[i+2] = 0.533;
            }

        //Left ear
            vertNum = innerEarLStart/7;
            for(j = 0; j < vertNum; j++, i+=3){
                colors[i] = 0.257;
                colors[i+1] = 0.570;
                colors[i+2] = 0.533;
            }

            //iner ear has different colords
            vertNum = innerEarLVerts.length/7;
            for(j = 0; j < vertNum; j++, i+=3){
                colors[i] = 0.499;
                colors[i+1] = 0.0300;
                colors[i+2] = 1.00;
            }

            vertNum = (innerEarTopLVerts.length + 
                        baseInnerLVerts.length 
                        + topInnerLVerts.length)/7;
            
            for(j = 0; j < vertNum; j++, i+=3){
                colors[i] = 0.257;
                colors[i+1] = 0.70;
                colors[i+2] = 0.533;
            }
            
        
    //rest of head, upperbody, and up to hooves have same color
        baseHeadLength =  foreheadVerts.length + muzzleVerts.length 
                    + chinGrooveVerts.length;
        vertNum = (baseHeadLength)/7;

        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.257;
            colors[i+1] = 0.570;
            colors[i+2] = 0.533;
        }

        vertNum = totalNeckLength/7 ;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.257;
            colors[i+1] = 0.570;
            colors[i+2] = 0.533;
        }
        


        vertNum = totalTorsoLength/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.257;
            colors[i+1] = 0.570;
            colors[i+2] = 0.533;
        }


        vertNum = shRVerts.length/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.340;
            colors[i+1] = 0.790;
            colors[i+2] = 0.685;
        }

        vertNum = upperRArmVerts.length/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.340;
            colors[i+1] = 0.790;
            colors[i+2] = 0.685;
        }

        vertNum = elRVerts.length/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.340;
            colors[i+1] = 0.790;
            colors[i+2] = 0.685;
        }


        vertNum = forearmRVerts.length/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.340;
            colors[i+1] = 0.790;
            colors[i+2] = 0.685;
        }

        vertNum = wrRVerts.length/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.340;
            colors[i+1] = 0.790;
            colors[i+2] = 0.685;
        }
        
        

        vertNum = hoofRVerts.length/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.369;
            colors[i+1] = 0.450;
            colors[i+2] = 0.381;
        }







        vertNum = leftHoofStart/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.340;
            colors[i+1] = 0.790;
            colors[i+2] = 0.685;
        }


        vertNum = hoofLVerts.length/7;
        for(j = 0; j < vertNum; j++, i+=3){
            colors[i] = 0.369;
            colors[i+1] = 0.450;
            colors[i+2] = 0.381;
        }

    //tail

    color1 = .663;
    color2 = .990;
    color3 = .799;

    vertNum = tailVerts.length/7;
    for(j = 0; j < vertNum; j++, i+=3){
        colors[i] = color1;
        colors[i+1] = color2;
        colors[i+2] = color3;

        if(color3 < .990){
            color3 += .000001;
        }
        else{
            color2 -= .000001;
        }
    }
    
  
  
  }



