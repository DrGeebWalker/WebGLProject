
//animate
//lighting

//shade and texture

//build body

var floatsPerVertex = 7;

function buildHippocampus(){

    makeHead();
    makeNeck();
    makeUpperBody();
    makeRightArm();
    makeLeftArm();
    makeTail();
    hippCampusSize = headShapes.length + neckShapes.length +upperBodyShapes.length +
            rightArmVerts.length + leftArmVerts.length + tailVerts.length;

    hippShapes = new Float32Array(hippCampusSize);

    
   headStart = 0;
   for(i = 0, j = 0; j < headShapes.length; i++, j++){
        hippShapes[i] = headShapes[j];
   }

   neckStart = i;
   for(j=0; j < neckShapes.length; j++, i++){
       hippShapes[i] = neckShapes[j];
   }

   torsoStart = i;
   for(j=0; j < upperBodyShapes.length; j++, i++){
       hippShapes[i] = upperBodyShapes[j];
   }

    rightArmStart = i;
    for(j=0; j < rightArmVerts.length; j++, i++){
        hippShapes[i] = rightArmVerts[j];
    }
    leftArmStart = i;
    for(j=0; j < leftArmVerts.length; j++, i++){
        hippShapes[i] = leftArmVerts[j];
    }

    tailStart = i;
    for(j=0; j < tailVerts.length; j++, i++){
        hippShapes[i] = tailVerts[j];
    }



}
//functions that build from individual pieces
//or grouped pieces
function makeHead(){
    makeHorn();
    makeRightEar();
    makeLeftEar();
    makeForehead();
    makeMuzzle();
    makeChinGroove();

    totalHeadLength = hornVerts.length + 
    rightEarVerts.length +leftEarVerts.length
    + foreheadVerts.length + muzzleVerts.length + chinGrooveVerts.length;

    headBaseLength = foreheadVerts.length + muzzleVerts.length + chinGrooveVerts.length;
    headShapes = new Float32Array(totalHeadLength);

    hornStart = 0;
    for(i=0, j=0; j<hornVerts.length; j++, i++){
        headShapes[i] = hornVerts[j];
    }

    rightEarStart = i;
    for(j=0; j < rightEarVerts.length; j++, i++){
        headShapes[i] = rightEarVerts[j];
    }
    leftEarStart = i;
    for(j=0; j < leftEarVerts.length; j++, i++){
        headShapes[i] = leftEarVerts[j];
    }
    headBaseStart = i;
    for(j=0; j< foreheadVerts.length; j++, i++){
        headShapes[i] = foreheadVerts[j];
    }
    for(j=0; j< muzzleVerts.length; j++, i++){
        headShapes[i] = muzzleVerts[j];
    }
    for(j=0; j<chinGrooveVerts.length; j++, i++){
        headShapes[i] = chinGrooveVerts[j];
    }

    
    function makeHorn(){
        hornVerts = makeCylWalls(97, .2, 0.1,
            0, 0, 90,
            1000, 5, -1.1, -.9,
            1000, 65, -.1, 0,
            1000, 6, 0, -0.1);
    }


    function makeForehead(){
        foreheadVerts = makeSphere(53, 57,
            10, 10, -.7, -.7,
            10, 10, -.06, -.01,
            10, 10, 0, 0);
    }

    function makeMuzzle(){
        muzzleVerts = makeCylWalls(97,
            .14, .2,
            0, 91, 0,
            3.89, 4, -.701, -.69,
            3, 6, 0.01, -.2,
            1.1, 1.1, -.01, .0);
    }

    function makeChinGroove(){
        chinGrooveVerts = makeSphere(53, 57,
            13, 13, -.69, -.69,
            15, 15, -.23, -.23,
            10, 10, 0.05, 0.05,);
    }


//grouped pieces
    function makeRightEar(){
        makeSideEarBaseR();
        makeSideEarMidR();
        makeSideEarTopR();
        makeInnerEarR();
        makeInnerEarTopR();
        makeBaseInnerR();
        makeTopInnerR();

        rEarSz = sideEarBaseRVerts.length + sideEarMidRVerts.length +  sideEarTopRVerts.length + 
        innerEarRVerts.length + innerEarRTopVerts.length + 
        baseInnerRVerts.length + topInnerRVerts.length;

        rightEarVerts = new Float32Array(rEarSz);

        rightEarSideStart = 0;
        for(i=0, j=0; j < sideEarBaseRVerts.length; j++, i++){
            rightEarVerts[i] = sideEarBaseRVerts[j];
        }
        for(j=0; j< sideEarMidRVerts.length; j++, i++){
            rightEarVerts[i] = sideEarMidRVerts[j];
        }
        for(j=0; j< sideEarTopRVerts.length; j++, i++){
            rightEarVerts[i] = sideEarTopRVerts[j];
        }
        innerEarRStart = i;

        for(j=0; j< innerEarRVerts.length; j++, i++){
            rightEarVerts[i] = innerEarRVerts[j];
        }
        innerEarRStop = i; 
        for(j=0; j< innerEarRTopVerts.length; j++, i++){
            rightEarVerts[i] = innerEarRTopVerts[j];
        }

        for(j=0; j< baseInnerRVerts.length; j++, i++){
            rightEarVerts[i] = baseInnerRVerts[j];
        }
        for(j=0; j< topInnerRVerts.length; j++, i++){
            rightEarVerts[i] = topInnerRVerts[j];
        }




        function makeSideEarBaseR(){
            sideEarBaseRVerts = makeSphere(17, 23, 
                120, 120, -.8, -.74,
                120, 120, 0.05, 0.05, 
                120, 120, 10.5, 6.9);
        }

        function makeSideEarMidR(){
            sideEarMidRVerts = makeSphere(17, 23, 
                120, 120, -.83, -.80,
                120, 120, 0.05, 0.05, 
                120, 120, 11, 10.5);
        }

        function makeSideEarTopR(){
            sideEarTopRVerts = makeSphere(17, 23, 
                120, 120, -.85, -.83,
                120, 120, 0.05, 0.05, 
                120, 120, 10.5, 11);
        }

        function makeInnerEarR(){
            innerEarRVerts = new Float32Array([

                //right top
                //0 - 1 - 2
                -.86, 0.05, 0.085, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red
                -.82, 0.05, 0.085, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow
                -.82, 0.07, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green




                //left top
                //0 - 2 - 3
                -.86, 0.05, 0.085, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red
                -.82, 0.07, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.82, 0.05, 0.05, 1.0, //3
                        0.0246, 0.127, 0.410, //dark blue

                //left bottom 
                //3 - 2 - 4
                -.82, 0.05, 0.05, 1.0, //3
                        0.0246, 0.127, 0.410, //dark blue
                -.82, 0.07, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.76, 0.05, 0.035, 1.0, //4
                        0.00, 0.930, 0.682, //neon cyan

                //center connector
                //4 - 2 - 5
                -.76, 0.05, 0.035, 1.0, //4
                        0.00, 0.930, 0.682, //neon cyan
                -.82, 0.07, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.76, 0.058, 0.04, 1.0, //5
                        0.680, 0.443, 0.0340, //orange

                //center
                //5 - 2 - 6
                -.76, 0.058, 0.04, 1.0, //5
                        0.680, 0.443, 0.0340, //orange
                -.82, 0.07, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.75, 0.05, 0.06, 1.0, //6
                        0.325, 0.0340, 0.680, //purple ish

                //side
                //6 - 2 - 1
                -.75, 0.05, 0.06, 1.0, //6
                    0.325, 0.0340, 0.680, //purple ish
                -.82, 0.07, 0.07, 1.0,  //2, below tip
                    0.383, 0.460, 0.0736, //green
                -.82, 0.05, 0.087, 1.0, //1 
                    0.915, 0.930, 0.00, //yellow

                //1 - 7 - 6
                -.82, 0.05, 0.087, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow
                -.79, 0.05, 0.088, 1.0, //7
                        0.557, 0.535, 0.990, //light blue 
                -.75, 0.05, 0.06, 1.0, //6
                        0.325, 0.0340, 0.680 //purple ish



            ]);
        }


        function makeInnerEarTopR(){
            innerEarRTopVerts = new Float32Array([

                //right top
                //0 - 1 - 2
                -.86, 0.055, 0.089, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red
                -.81, 0.055, 0.089, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow
                -.81, 0.08, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green




                //left top
                //0 - 2 - 3
                -.86, 0.055, 0.09, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red
                -.81, 0.078, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.81, 0.055, 0.04, 1.0, //3
                        0.0246, 0.127, 0.410, //dark blue

                //left bottom 
                //3 - 2 - 4
                -.82, 0.055, 0.043, 1.0, //3
                        0.0246, 0.127, 0.410, //dark blue
                -.82, 0.078, 0.074, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.74, 0.055, 0.033, 1.0, //4
                        0.00, 0.930, 0.682, //neon cyan

                //center connector
                //4 - 2 - 5
                -.74, 0.055, 0.035, 1.0, //4
                        0.00, 0.950, 0.682, //neon cyan
                -.82, 0.078, 0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.74, 0.064, 0.03, 1.0, //5
                        0.680, 0.443, 0.0340, //orange

                //center
                //5 - 2 - 6
                -.74, 0.064, 0.03, 1.0, //5
                        0.680, 0.443, 0.0340, //orange
                -.82, 0.078, 0.06, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.74, 0.055, 0.05, 1.0, //6
                        0.325, 0.0340, 0.680, //purple ish

                //side
                //6 - 2 - 1
                -.74, 0.055, 0.05, 1.0, //6
                    0.325, 0.0340, 0.680, //purple ish
                -.82, 0.078, 0.06, 1.0,  //2, below tip
                    0.383, 0.460, 0.0736, //green
                -.82, 0.055, 0.09, 1.0, //1 
                    0.915, 0.930, 0.00, //yellow

                //1 - 7 - 6
                -.82, 0.055, 0.09, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow
                -.79, 0.055, 0.09, 1.0, //7
                        0.557, 0.435, 0.990, //light blue 
                -.74, 0.055, 0.06, 1.0, //6
                        0.325, 0.0240, 0.680 //purple ish



            ]);
        }


        function makeBaseInnerR(){
            baseInnerRVerts = makeSphere(17, 23, 
                120, 120, -.81, -.73,
                120, 120, 0.051, 0.051, 
                120, 120, 6, 4.5);
        }

        function makeTopInnerR(){
            topInnerRVerts = makeSphere(17, 23, 
                120, 120, -.85, -.81,
                120, 120, 0.049, 0.05, 
                120, 120, 9.5, 6);
        }


    }

    function makeLeftEar(){
        makeSideEarBaseL();
        makeSideEarMidL();
        makeSideEarTopL();
        makeInnerEarL();
        makeInnerTopEarL();
        makeBaseInnerL();
        makeTopInnerL();
    

        lEarSz = sideEarBaseLVerts.length + sideEarMidLVerts.length +  sideEarTopLVerts.length
        + innerEarLVerts.length + innerEarTopLVerts.length + 
        baseInnerLVerts.length + topInnerLVerts.length;

        leftEarVerts = new Float32Array(lEarSz);

        for(i=0, j=0; j< sideEarBaseLVerts.length; j++, i++){
            leftEarVerts[i] = sideEarBaseLVerts[j];
        }
        for(j=0; j< sideEarMidLVerts.length; j++, i++){
            leftEarVerts[i] = sideEarMidLVerts[j];
        }
        for(j=0; j< sideEarTopLVerts.length; j++, i++){
            leftEarVerts[i] = sideEarTopLVerts[j];
        }

        innerEarLStart = i;
        for(j=0; j< innerEarLVerts.length; j++, i++){
            leftEarVerts[i] = innerEarLVerts[j];
        }
        innerEarLStop = i; 

        for(j=0; j< innerEarTopLVerts.length; j++, i++){
            leftEarVerts[i] = innerEarTopLVerts[j];
        }

        for(j=0; j< baseInnerLVerts.length; j++, i++){
            leftEarVerts[i] = baseInnerLVerts[j];
        }
        for(j=0; j< topInnerLVerts.length; j++, i++){
            leftEarVerts[i] = topInnerLVerts[j];
        }

            //away from the horrn
        function makeSideEarBaseL(){
            sideEarBaseLVerts = makeSphere(17, 23, 
                120, 120, -.81, -.74,
                120, 120, 0.05, 0.05, 
                120, 120, -10.5, -7);
        }

        function makeSideEarMidL(){
            sideEarMidLVerts = makeSphere(17, 23, 
                120, 120, -.83, -.805,
                120, 120, 0.055, 0.05, 
                120, 120, -11, -10.5);
        }

        function makeSideEarTopL(){
            sideEarTopLVerts = makeSphere(17, 23, 
                120, 120, -.85, -.83,
                120, 120, 0.05, 0.055, 
                120, 120, -10, -11);
        }

        function makeInnerEarL(){
            innerEarLVerts = new Float32Array([
                        //1 - 7 - 6
                
                -.76, 0.05, -0.02, 1.0, //6
                        0.325, 0.0340, 0.680, //purple ish
                -.79, 0.05, -0.08, 1.0, //7
                        0.557, 0.535, 0.990, //light blue 
                -.82, 0.05, -0.07, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow


                //side
                //6 - 2 - 1
                -.82, 0.05, -0.087, 1.0, //1 
                            0.915, 0.930, 0.00, //yellow
                -.82, 0.07, -0.07, 1.0,  //2, below tip
                            0.383, 0.460, 0.0736, //green
                -.76, 0.05, -0.06, 1.0, //6
                            0.325, 0.0340, 0.680, //purple ish

                //center
                //5 - 2 - 6
                -.76, 0.05, -0.06, 1.0, //6
                                                0.325, 0.0340, 0.680, //purple ish
                -.82, 0.07, -0.07, 1.0,  //2, below tip
                                                0.383, 0.460, 0.0736, //green
                -.76, 0.058, -0.04, 1.0, //5
                        0.680, 0.443, 0.0340, //orange

            


                //center connector
                //4 - 2 - 5

                -.76, 0.05, -0.035, 1.0, //4
                            0.00, 0.930, 0.682, //neon cyan

                -.82, 0.07, -0.07, 1.0,  //2, below tip
                            0.383, 0.460, 0.0736, //green

                -.76, 0.058, -0.04, 1.0, //5
                        0.680, 0.443, 0.0340, //orange

        


                //left bottom 
                //3 - 2 - 4
                -.76, 0.05, -0.035, 1.0, //4
                            0.00, 0.930, 0.682, //neon cyan
                -.82, 0.07, -0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.82, 0.05, -0.05, 1.0, //3
                        0.0246, 0.127, 0.410, //dark blue



                //left top
                //0 - 2 - 3

                -.82, 0.05, -0.05, 1.0, //3
                            0.0246, 0.127, 0.410, //dark blue

                -.82, 0.07, -0.07, 1.0,  //2, below tip
                            0.383, 0.460, 0.0736, //green

                -.86, 0.05, -0.085, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red




                //right top
                //0 - 1 - 2
                -.82, 0.07, -0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green

                -.82, 0.05, -0.07, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow
                        
                -.86, 0.05, -0.07, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red




            ]);
        }

        function makeInnerTopEarL(){
            innerEarTopLVerts = new Float32Array([
                        //1 - 7 - 6
                
                -.73, 0.05, -0.06, 1.0, //6
                        0.325, 0.0340, 0.680, //purple ish
                -.79, 0.05, -0.088, 1.0, //7
                        0.557, 0.535, 0.990, //light blue 
                -.82, 0.05, -0.087, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow


                //side
                //6 - 2 - 1
                -.82, 0.05, -0.087, 1.0, //1 
                            0.915, 0.930, 0.00, //yellow
                -.82, 0.08, -0.07, 1.0,  //2, below tip
                            0.383, 0.460, 0.0736, //green
                -.73, 0.05, -0.06, 1.0, //6
                            0.325, 0.0340, 0.680, //purple ish

                //center
                //5 - 2 - 6
                -.73, 0.05, -0.06, 1.0, //6
                                                0.325, 0.0340, 0.680, //purple ish
                -.82, 0.08, -0.07, 1.0,  //2, below tip
                                                0.383, 0.460, 0.0736, //green
                -.73, 0.068, -0.04, 1.0, //5
                        0.680, 0.443, 0.0340, //orange

            


                //center connector
                //4 - 2 - 5

                -.73, 0.05, -0.015, 1.0, //4
                            0.00, 0.930, 0.682, //neon cyan

                -.82, 0.08, -0.07, 1.0,  //2, below tip
                            0.383, 0.460, 0.0736, //green

                -.73, 0.068, -0.04, 1.0, //5
                        0.680, 0.443, 0.0340, //orange

        


                //left bottom 
                //3 - 2 - 4
                -.73, 0.05, -0.015, 1.0, //4
                            0.00, 0.930, 0.682, //neon cyan
                -.82, 0.08, -0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green
                -.82, 0.05, -0.05, 1.0, //3
                        0.0246, 0.127, 0.410, //dark blue



                //left top
                //0 - 2 - 3

                -.82, 0.05, -0.05, 1.0, //3
                            0.0246, 0.127, 0.410, //dark blue

                -.82, 0.08, -0.07, 1.0,  //2, below tip
                            0.383, 0.460, 0.0736, //green

                -.86, 0.05, -0.085, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red




                //right top
                //0 - 1 - 2
                -.82, 0.08, -0.07, 1.0,  //2, below tip
                        0.383, 0.460, 0.0736, //green

                -.82, 0.06, -0.085, 1.0, //1 
                        0.915, 0.930, 0.00, //yellow
                        
                -.86, 0.05, -0.085, 1.0,    //0, tip
                        0.740, 0.00, 0.0493, //red




            ]);
        }

        //towards the horn
        function makeBaseInnerL(){
            baseInnerLVerts = makeSphere(17, 23, 
                120, 120, -.81, -.73,
                120, 120, 0.05, 0.05, 
                120, 120, -5, -3);
        }

        function makeTopInnerL(){
            topInnerLVerts = makeSphere(17, 23, 
                120, 120, -.85, -.81,
                120, 120, 0.05, 0.05, 
                120, 120, -9, -5);
        }
        //ear end





    }
        //end head

        
}

function makeNeck(){
    makeUpperNeck();
    makeMidNeck();
    makeLowerNeck();

    totalNeckLength = upperNeckVerts.length + midNeckVerts.length + lowerNeckVerts.length;

    neckShapes = new Float32Array(totalNeckLength);


    upperNeckStart = 0;
    for(i = 0, j=0; j< upperNeckVerts.length; j++, i++){
        neckShapes[i] = upperNeckVerts[j];
    }
    midNeckStart = i;
    for(j=0; j < midNeckVerts.length; j++, i++){
        neckShapes[i] = midNeckVerts[j];
    }
    lowerNeckStart = i;
    for(j=0; j < lowerNeckVerts.length; j++, i++){
        neckShapes[i] = lowerNeckVerts[j];
    }
    neckLength = i;


    //neck
function makeUpperNeck(){
    upperNeckVerts = makeSphere(57, 57, 
        10, 10, -.65, -.6,
        10, 11, 0, 0.01,
        10, 10, 0, 0,);
}

function makeMidNeck(){
    midNeckVerts = makeSphere(57, 57, 
        10, 10, -.5, -.6,
        10, 10, 0.02, 0,
        10, 10, 0, 0,);
}

function makeLowerNeck(){
    lowerNeckVerts = makeSphere(57, 57, 
        8, 10, -.31, -.5,
        7, 10, 0, 0.02,
        7, 10, 0, 0,);

}

}


function makeUpperBody(){
    makeHorso();
    makeUniRib();
    makeStomach();
    makeHorhips();

    totalTorsoLength = horsoVerts.length + ribVerts.length + stomachVerts.length + horhipsVerts.length;

    upperBodyShapes = new Float32Array(totalTorsoLength);

    horsoStart = 0;
    for(i = 0, j=0; j< horsoVerts.length; j++, i++){
        upperBodyShapes[i] = horsoVerts[j];
    }
    for(j=0; j< ribVerts.length; j++, i++){
        upperBodyShapes[i] = ribVerts[j];
    }
    ribUpEnd = i;
    for(j=0; j< stomachVerts.length; j++, i++){
        upperBodyShapes[i] = stomachVerts[j];
    }
    horhipStart = i;
    for(j=0; j< horhipsVerts.length; j++, i++){
        upperBodyShapes[i] = horhipsVerts[j];
    }
    torsoLength = i; 

    //torsoe
function makeHorso(){
    horsoVerts = makeSphere(97, 97, 
        8, 6, -.3, -.04,
        7, 6, 0, -.02,
        6, 6, 0, 0,);
}

function makeUniRib(){
    ribVerts = makeSphere(97, 97, 
        6, 8, -.02, 0,
        6.4, 8, -.03, 0,
        6, 8, 0., 0,);
}

function makeStomach(){
    stomachVerts = makeSphere(97, 97, 
        8, 8, 0, .16,
        7, 8, 0, 0.0,
        7, 7, 0, 0,);
}

function makeHorhips(){
    horhipsVerts = makeSphere(97, 97, 
        8, 8, .17, 0.3,
        8, 7,  0, 0,
        7, 6, 0, 0,);
}

}
function makeRightArm(){
    makeRShJnt();
    makeRUpperArm();
    makeRElJnt();
    makeRForeArm();
    makeRWrJnt();
    makeRHoof();

    rArmLength = shRVerts.length + upperRArmVerts.length + elRVerts.length + forearmRVerts.length 
        + wrRVerts.length + hoofRVerts.length;

    rightArmVerts = new Float32Array(rArmLength);

    for(i=0, j=0; j < shRVerts.length; i++, j++){
        rightArmVerts[i] = shRVerts[j];
    }
    upperArmRStart = i; 
    for(j=0; j < upperRArmVerts.length; i++, j++){
        rightArmVerts[i] = upperRArmVerts[j];
    }

    elRStart = i;
    for(j=0; j < elRVerts.length; i++, j++){
        rightArmVerts[i] = elRVerts[j];
    }
    forarmRStart = i; 
    for(j=0; j < forearmRVerts.length; i++, j++){
        rightArmVerts[i] = forearmRVerts[j];
    }
    wrRStart = i;
    for(j=0; j < wrRVerts.length; i++, j++){
        rightArmVerts[i] = wrRVerts[j];
    }
    rightHoofStart = i;
    for(j=0; j < hoofRVerts.length; i++, j++){
        rightArmVerts[i] = hoofRVerts[j];
    }



    function makeRShJnt(){
        shRVerts = makeSphere(53, 57,
            10, 10, -.38, -.38,
            15, 15, 0.07, 0.07,
            18, 18, 2.5, 2.5);
    }

    function makeRUpperArm(){
        upperRArmVerts = makeCylWalls(57, 
            .3, .2,
            0, 90, 0,
            3.9, 16, -.37, -.38,
            12, 80, 0.13, -.31,
            16, 20, .1, .1);
    }

    function makeRElJnt(){
        elRVerts = makeSphere(53, 57,
            21, 21, -.38, -.38,
            21, 21, -.34, -.34,
            21, 21,  2.8, 2.8);
    }


    function makeRForeArm(){
        forearmRVerts = makeCylWalls(57, 
            .3, .2,
            0, 90, 0,
            9, 25, -0.38,-.38,
            90, 55, -.36, -.7,
            21, 30, .11, .1);
    }

    function makeRWrJnt(){
        wrRVerts = makeSphere(53, 57, 
            30, 30, -0.38, -.38,
            30, 30, -0.7, -0.7,
            30, 30, 3.5, 3.5);
    }

    function makeRHoof(){
        hoofRVerts = makeCylinder(57, 
            .3, .2,
            0, 90, 0,
            15, 10, -.38, -0.38,  
            55, 95, -.69, -.89,
            40, 15, 0.105, .1,
            -0.38, -.9, 0.12);
    }







}

function makeLeftArm(){
    makeLShJnt();
    makeLElJnt();
    makeLWrJnt();
    makeLUpperArm();
    makeLForeArm();
    makeLHoof();

    lArmLength = shLVerts.length + upperLArmVerts.length + elLVerts.length + forearmLVerts.length 
        + wrLVerts.length + hoofLVerts.length;

    leftArmVerts = new Float32Array(lArmLength);

    for(i=0, j=0; j < shLVerts.length; i++, j++){
        leftArmVerts[i] = shLVerts[j];
    }
    for(j=0; j < upperLArmVerts.length; i++, j++){
        leftArmVerts[i] = upperLArmVerts[j];
    }
    for(j=0; j < elLVerts.length; i++, j++){
        leftArmVerts[i] = elLVerts[j];
    }
    forarmLStart = i;
    for(j=0; j < forearmLVerts.length; i++, j++){
        leftArmVerts[i] = forearmLVerts[j];
    }

    for(j=0; j < wrLVerts.length; i++, j++){
        leftArmVerts[i] = wrLVerts[j];
    }
    leftHoofStart = i;
    for(j=0; j < hoofLVerts.length; i++, j++){
        leftArmVerts[i] = hoofLVerts[j];
    }


function makeLShJnt(){
    shLVerts = makeSphere(53, 57,
        10, 10, -.38, -.38,
        15, 15, 0.07, 0.07,
        18, 18, -2.5, -2.5);
}

function makeLUpperArm(){
    upperLArmVerts = makeCylWalls(57, 
        .3, .2,
        0, -90, 0,
        4, 21, -.38, -.38,
        12, 80, -.05, -.31,
        18, 21, -.18, -.18);
}

function makeLElJnt(){
    elLVerts = makeSphere(53, 57,
        21, 21, -.38, -.38,
        21, 21, -.32, -.32,
        21, 21,  -3.1, -3.1);
}

function makeLForeArm(){
    forearmLVerts = makeCylWalls(57, 
        .3, .2,
        0, 90, 0,
        9, 25, -0.38,-.38,
        60, 55, -.33, -.67,
        21 , 30, -.17, -.18);
}

function makeLWrJnt(){
    wrLVerts =  makeSphere(53, 57, 
        30, 30, -0.38, -.38,
        30, 30, -0.7, -0.7,
        30, 30, -4.7, -4.7);
}

function makeLHoof(){
    hoofLVerts = makeCylinder(57, 
        .3, .2,
        0, 90, 0,
        15, 10, -.38, -0.38,  
        55, 95, -.69, -.89,
        40, 15, -0.17, -.18,
        -0.38, -.9, -0.12);
}

}

//big tail
function makeTail(){

    tailVerts = new Float32Array((((53 *2 * 57)-2) * floatsPerVertex) * 38 );



    xDivPrev = 5.5;
    xPlusPrev = 0.3;

    yDivPrev = 5.5;

    zDivPrev = 5.5;

    xDiv = xDivPrev - .2;
    yDiv = yDivPrev - .2; 
    zDiv = zDivPrev - .2; 

    xPlus = xPlusPrev + .05; 



    tailI = 0;
    addOn = 0.0
    for(j = 0; j < 36; j++){
        if( j == 0){
            xDiv = 5.5;
            yDiv = 5.5;
            zDiv = 5.5;
        }
        else{
            if (j ==1 || j == 2 || j == 3 || j == 4){
                xDiv = xDivPrev - .002;
                yDiv = yDivPrev - .002; 
                zDiv = zDivPrev - .003; 

            }
            else{
                xDiv = xDivPrev + .1;
                if (j < 10){
                    yDiv = yDivPrev  + addOn;
                    zDiv = zDivPrev  + addOn;
                    addOn += 0.001;
    
                }
                else{
                    xDiv = xDivPrev + .1;
                    yDiv = yDivPrev  + addOn;
                    zDiv = zDivPrev  + addOn;
                    addOn += 0.04;
       
            }
            }

           
        }

        xPlus = xPlusPrev + .06; 

        tempTail = makeSphere(53, 57,
            xDivPrev, xDiv, xPlusPrev, xPlus,
            yDivPrev, yDiv, 0, 0,
            zDivPrev, zDiv, 0, 0);
        
        
        for(v = 0; v < tempTail.length; tailI++, v++){
            tailVerts[tailI] = tempTail[v];
        }

        xDivPrev = xDiv;
        xPlusPrev = xPlus; 
        yDivPrev = yDiv;
        zDivPrev = zDiv;


    }

    leftFinVerts = makeSphere(53, 57, 
            xDivPrev, xDivPrev, xPlusPrev, xPlusPrev + .1,
            yDivPrev, 50, 0, 0,
            zDivPrev, zDivPrev-.1, 0, -3);

    rightFinVerts = makeSphere(53, 57, 
            xDivPrev, xDivPrev, xPlusPrev, xPlusPrev + .1,
            yDivPrev, 50, 0, 0,
            zDivPrev, zDivPrev+.1, 0, 3);

    finsStart = tailI;
    i = tailI;
    for(j = 0; j < leftFinVerts.length; j++, i++){
        tailVerts[i] = leftFinVerts[j];
    }

    for(j = 0; j < rightFinVerts.length; j++, i++){
        tailVerts[i] = rightFinVerts[j];
    }
    finsEnd = i; 
}







//shape builds
function makeSphere(slices, sliceVerts, 
    divByX1, divByX2, xMove1, xMove2,
     divByY1, divByY2, yMove1, yMove2,
    divByZ1, divByZ2, zMove1, zMove2) {
    	// South Pole: brightest gray.
    var sliceAngle = Math.PI/slices;	// lattitude angle spanned by one slice.
    
    sphVerts = new Float32Array(((slices * 2* sliceVerts)-2) * floatsPerVertex);

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
                sphVerts[j] = sin0 * Math.cos(Math.PI*(v)/sliceVerts)/divByX1 + xMove1; 	
                sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts)/divByY1  + yMove1;	
                sphVerts[j+2] = (cos0 + zMove1)/divByZ1;		
                sphVerts[j+3] = 1.0;		
            }
            
            else { 
                sphVerts[j] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts)/divByX2+ xMove2;		// x
                sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts)/divByY2  + yMove2;		// y
                sphVerts[j+2] = (cos1 + zMove2)/divByZ2;																				// z
                sphVerts[j+3] = 1.0;																			// w.		
            }

            sphVerts[j+4] = Math.random();
            sphVerts[j+5] = Math.random();
            sphVerts[j+6] = Math.random();

        }


    }

    return sphVerts;
}


//has one bottom part
function makeCylinder(capVerts, 
    botRadius, topRadius, 
    rotationX, rotationY, rotationZ,
     divTopX, divBotX, addTopX, addBotX,
    divTopY, divBotY, addTopY, addBotY,
   divTopZ, divBotZ, addTopZ, addBotZ,
   middle, middleY, middleZ){
   var j = 0;
   cylVerts = new Float32Array(((capVerts*4) -2) * floatsPerVertex);
   
   for(v=0; v< 2*capVerts; v++, j+=floatsPerVertex) {
       if(v%2==0){		 //x1
        
        xpos = topRadius*Math.cos(Math.PI*(v)/capVerts);
        ypos = Math.sin(Math.PI*(v)/capVerts);
        zpos = 1.0;
        cylVerts[j] = ((xpos * Math.cos(rotationX) + (ypos * -Math.sin(rotationX))) +
                     (xpos * Math.cos(rotationZ) + (zpos * Math.sin(rotationZ)))
                     )/divTopX + addTopX; 			// x
                     
         cylVerts[j+1] = ((xpos * Math.sin(rotationX) + (ypos * Math.cos(rotationX))) +
                         (ypos * Math.cos(rotationY) + (zpos * -Math.sin(rotationY))))/divTopY + addTopY;		// y
 
         cylVerts[j+2] = ((ypos * Math.sin(rotationY) + (zpos * Math.cos(rotationY)) +
                         (xpos * -Math.sin(rotationZ) + (zpos * Math.cos(rotationZ)))))/divTopZ + addTopZ;
         
         cylVerts[j+3] = 1.0;	// w.

       }
       else{ //x2
        xpos = botRadius * Math.cos(Math.PI*(v-1)/capVerts);	
        ypos = Math.sin(Math.PI*(v-1)/capVerts);
        zpos = 1.0;
        cylVerts[j] = ((xpos * Math.cos(rotationX) + ypos * -Math.sin(rotationX)) +
                     (xpos * Math.cos(rotationZ) + zpos * Math.sin(rotationZ)))/divBotX + addBotX; 			// x
        cylVerts[j+1] = ((xpos * Math.sin(rotationX) + ypos * Math.cos(rotationX)) +
                         (ypos * Math.cos(rotationY) + zpos * -Math.sin(rotationY)))/divBotY + addBotY;		// y
        cylVerts[j+2] = ((ypos * Math.sin(rotationY) + zpos * Math.cos(rotationY)) +
                         (xpos * -Math.sin(rotationZ) + zpos * Math.cos(rotationZ)))/divBotZ + addBotZ;
        cylVerts[j+3] = 1.0;	// w.
       }
       cylVerts[j+4] = Math.random();
       cylVerts[j+5] = Math.random();
       cylVerts[j+6] = Math.random();

   }
   for(v=0; v < (2*capVerts); v++, j+= floatsPerVertex) {
    if(v%2==0) {	// position even #'d vertices around bot cap's outer edge
        xpos = botRadius * Math.cos(Math.PI*(v-1)/capVerts);	
        ypos = Math.sin(Math.PI*(v-1)/capVerts);
        zpos = 1.0;
        cylVerts[j] = ((xpos * Math.cos(rotationX) + ypos * -Math.sin(rotationX)) +
                     (xpos * Math.cos(rotationZ) + zpos * Math.sin(rotationZ)))/divBotX + addBotX; 			// x
        cylVerts[j+1] = ((xpos * Math.sin(rotationX) + ypos * Math.cos(rotationX)) +
                         (ypos * Math.cos(rotationY) + zpos * -Math.sin(rotationY)))/divBotY + addBotY;		// y
        cylVerts[j+2] = ((ypos * Math.sin(rotationY) + zpos * Math.cos(rotationY)) +
                         (xpos * -Math.sin(rotationZ) + zpos * Math.cos(rotationZ)))/divBotZ + addBotZ;
        cylVerts[j+3] = 1.0;	// w.
    }
    else {				// position odd#'d vertices at center of the bottom cap:
        cylVerts[j  ] = middle; 
        cylVerts[j+1] = middleY;
        cylVerts[j+2] = middleZ; 
        cylVerts[j+3] = 1.0;			// r,g,b = botColr[]
    }
    cylVerts[j+4] = Math.random();
    cylVerts[j+5] = Math.random();
    cylVerts[j+6] = Math.random();
  }

   return cylVerts;
}

//only sides 
function makeCylWalls(capVerts, botRadius, topRadius, 
    rotationX, rotationY, rotationZ,
     divTopX, divBotX, addTopX, addBotX,
    divTopY, divBotY, addTopY, addBotY,
   divTopZ, divBotZ, addTopZ, addBotZ){
   var j = 0;
   cylVerts = new Float32Array(((capVerts*2) -2) * floatsPerVertex);
   
   for(v=0; v< 2*capVerts; v++, j+=floatsPerVertex) {
       if(v%2==0){		 //x1
        
           xpos = topRadius*Math.cos(Math.PI*(v)/capVerts);
           ypos = Math.sin(Math.PI*(v)/capVerts);
           zpos = 1.0;
           cylVerts[j] = ((xpos * Math.cos(rotationX) + (ypos * -Math.sin(rotationX))) +
                        (xpos * Math.cos(rotationZ) + (zpos * Math.sin(rotationZ)))
                        )/divTopX + addTopX; 			// x
                        
            cylVerts[j+1] = ((xpos * Math.sin(rotationX) + (ypos * Math.cos(rotationX))) +
                            (ypos * Math.cos(rotationY) + (zpos * -Math.sin(rotationY))))/divTopY + addTopY;		// y
    
            cylVerts[j+2] = ((ypos * Math.sin(rotationY) + (zpos * Math.cos(rotationY)) +
                            (xpos * -Math.sin(rotationZ) + (zpos * Math.cos(rotationZ)))))/divTopZ + addTopZ;
            
            cylVerts[j+3] = 1.0;	// w.

       }
       else{ //x2
           xpos = botRadius * Math.cos(Math.PI*(v-1)/capVerts);	
           ypos = Math.sin(Math.PI*(v-1)/capVerts);
           zpos = 1.0;
           cylVerts[j] = ((xpos * Math.cos(rotationX) + ypos * -Math.sin(rotationX)) +
                        (xpos * Math.cos(rotationZ) + zpos * Math.sin(rotationZ)))/divBotX + addBotX; 			// x
           cylVerts[j+1] = ((xpos * Math.sin(rotationX) + ypos * Math.cos(rotationX)) +
                            (ypos * Math.cos(rotationY) + zpos * -Math.sin(rotationY)))/divBotY + addBotY;		// y
           cylVerts[j+2] = ((ypos * Math.sin(rotationY) + zpos * Math.cos(rotationY)) +
                            (xpos * -Math.sin(rotationZ) + zpos * Math.cos(rotationZ)))/divBotZ + addBotZ;
           cylVerts[j+3] = 1.0;	// w.
       }
       cylVerts[j+4] = Math.random();
       cylVerts[j+5] = Math.random();
       cylVerts[j+6] = Math.random();

   }
   return cylVerts;
}

