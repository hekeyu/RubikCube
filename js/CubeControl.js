var ControlCube = function(gl, offsetX, offsetY, offsetZ) { 
	this.program = createProgram(gl, "ControlCubeVertex", "ControlCubeFragment");
    this.Position = new Vector(offsetX, offsetY, offsetZ);
    this.hit = 0.0;
    
    this.rotate = [1, 0, 0, 0,
    			   0, 1, 0, 0, 
    			   0, 0, 1, 0,
    		   	   0, 0, 0, 1
    			  ];
    this.lastRotate = [1, 0, 0, 0,
		    			    0, 1, 0, 0, 
		    			    0, 0, 1, 0,
		    		   	    0, 0, 0, 1
		    			   ];
    var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  	]);
  	
  	for(var i = 0; i < vertices.length; i += 3){
			vertices[i + 0] =vertices[i + 0] / 2 + offsetX;
			vertices[i + 1] =vertices[i + 1] / 2 + offsetY;
			vertices[i + 2] =vertices[i + 2] / 2 + offsetZ;
     }

  var verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
   
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
 
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
  
  this.draw = function(mvpMatrix){
    gl.useProgram(this.program);
      
  	//顶点  	
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  	gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);  
  	gl.enableVertexAttribArray(this.program.a_Position);

//法向量
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(this.program.a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Normal);
//颜色 
  	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  	gl.vertexAttribPointer(this.program.a_Color, 3, gl.FLOAT, false, 0, 0);
  	gl.enableVertexAttribArray(this.program.a_Color);
 	 
 	gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, mvpMatrix);
 	gl.uniformMatrix4fv(this.program.u_Rotate, false, this.rotate);
 	gl.uniform1f(this.program.u_Hit, this.hit); 
  	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0); 
  } 
} 

ControlCube.prototype = {
	
    normals:new Float32Array([    // Normal
	    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
	   
	   1.0, 0.0, 0.0,  1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
	    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
	    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
	    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
	   
	   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0   // v4-v7-v6-v5 back
	  ]), 

    colors:new Float32Array([    // Colors 
     0, 1, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v0-v1-v2-v3 front  
     1, 1, 0,   1, 1, 0,   1, 1, 0,  1, 1, 0,     // v0-v3-v4-v5 right
     1, 0, 1,   1, 0, 1,   1, 0, 1,  1, 0, 1,     // v0-v5-v6-v1 up
     0, 0, 1,   0, 0, 1,   0, 0, 1,  0, 0, 1,     // v1-v6-v7-v2 left
     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
     0, 1, 1,   0, 1, 1,   0, 1, 1,  0, 1, 1　    // v4-v7-v6-v5 back
 	  ]),
 	   
 	indices:new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
	 ]),
 
	hitTest:function(point){
	   var position = new Vector(this.clear(point.x), 
	   						     this.clear(point.y), 
	   							 this.clear(point.z));
	   if(position.equals(this.Position))
	      this.hit = 1.0;
	   else
	      this.hit = 0.0;
	   return position;   
	},
	clear:function(num){
		if(num > 0)
		   return (num > 0.5?1:0);
		else
		   return (num <-0.5?-1:0);
	}, 	
	update:function(rotateVector, HitCube, rotateMatrix){
	    if(rotateVector.x != 0){
	      if(this.Position.x == HitCube.x){
	      	 this.rotate = multiply(this.lastRotate, rotateMatrix);	      	 
	      	 this.lastRotate = this.rotate.slice();
	      	 var a = this.Position.x;
	      	 this.Position.x = 0;
	      	 this.Position = this.Position.cross(rotateVector);
	      	 this.Position.x = a;
	      } 
	    }
	     if(rotateVector.y != 0){
	      if(this.Position.y == HitCube.y){ 
	      	 this.rotate = multiply(this.lastRotate, rotateMatrix);	  
	      	 this.lastRotate = this.rotate.slice();
	      	 var a = this.Position.y;
	      	 this.Position.y = 0;
	      	 this.Position = this.Position.cross(rotateVector);
	      	 this.Position.y = a;
	    	}
	     }  
	      if(rotateVector.z != 0){
	      if(this.Position.z == HitCube.z){ 
	      	 this.rotate = multiply(this.lastRotate, rotateMatrix);	  
	      	 this.lastRotate = this.rotate.slice();
	      	 var a = this.Position.z;
	      	 this.Position.z = 0;
	      	 this.Position = this.Position.cross(rotateVector);
	      	 this.Position.z = a;
	      	}
	     } 
	}
}

function makeCube(gl){
	//c从y轴方向看 分上中下三层
	cubeArray[0]  = new ControlCube(gl, -1,  1, -1);
	cubeArray[1]  = new ControlCube(gl,  0,  1, -1);
	cubeArray[2]  = new ControlCube(gl,  1,  1, -1);
	cubeArray[3]  = new ControlCube(gl, -1,  1,  0);
	cubeArray[4]  = new ControlCube(gl,  0,  1,  0);
	cubeArray[5]  = new ControlCube(gl,  1,  1,  0);
	cubeArray[6]  = new ControlCube(gl, -1,  1,  1);
	cubeArray[7]  = new ControlCube(gl,  0,  1,  1);
	cubeArray[8]  = new ControlCube(gl,  1,  1,  1);
  
	cubeArray[9]  = new ControlCube(gl, -1,  0, -1);
	cubeArray[10] = new ControlCube(gl,  0,  0, -1);
	cubeArray[11] = new ControlCube(gl,  1,  0, -1);
	cubeArray[12] = new ControlCube(gl, -1,  0,  0);
	cubeArray[13] = new ControlCube(gl,  1,  0,  0);
	cubeArray[14] = new ControlCube(gl, -1,  0,  1);
	cubeArray[15] = new ControlCube(gl,  0,  0,  1);
	cubeArray[16] = new ControlCube(gl,  1,  0,  1);
	
	cubeArray[17] = new ControlCube(gl, -1, -1, -1);
	cubeArray[18] = new ControlCube(gl,  0, -1, -1);
	cubeArray[19] = new ControlCube(gl,  1, -1, -1);
	cubeArray[20] = new ControlCube(gl, -1, -1,  0);
	cubeArray[21] = new ControlCube(gl,  0, -1,  0);
	cubeArray[22] = new ControlCube(gl,  1, -1,  0);
	cubeArray[23] = new ControlCube(gl, -1, -1,  1);
	cubeArray[24] = new ControlCube(gl,  0, -1,  1);
	cubeArray[25] = new ControlCube(gl,  1, -1,  1);
	
} 
function drawCubeStatic(mvpMatrix, hitPoint){
	 for(var i = 0; i < cubeArray.length; i++){
	  	 
        cubeArray[i].hitTest(hitPoint);	   //命中测试 	 
        cubeArray[i].rotate = cubeArray[i].lastRotate;  
	  	cubeArray[i].draw(mvpMatrix); 
 
	 }
}	 
function drawCubeDynamic(mvpMatrix, rotateVector, degree, HitCube){
 
	var rotateMatrix = rotateAxis(rotateVector.x, rotateVector.y, rotateVector.z, degree);
    var temp;
    if(rotateVector.x != 0)
    	temp = "x";
    else if(rotateVector.y != 0)
        temp = "y";
    else temp = "z";
	for(var i = 0; i < cubeArray.length; i++){
	   if(cubeArray[i].Position[temp] == HitCube[temp])
	   	   cubeArray[i].rotate = multiply(cubeArray[i].lastRotate, rotateMatrix);
	   else 
	       cubeArray[i].rotate = cubeArray[i].lastRotate;
	   cubeArray[i].draw(mvpMatrix);
 
	}
}
function makeCubeUpdateRotate(rotateVector, HitCube){
	 var rotateMatrix = rotateAxis(rotateVector.x, rotateVector.y, rotateVector.z, 90);
	 for(var i = 0; i < cubeArray.length; i++){
	 		cubeArray[i].update(rotateVector, HitCube, rotateMatrix);
	 	}
}




 
