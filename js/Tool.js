var TestCube = function(gl) { 
/*
		  attribute vec3 a_Position;
    	attribute vec4 a_Color;
		  attribute vec3 a_Normal;
		     
	    uniform mat4 u_MvpMatrix;
	    uniform vec3 u_PointLight;   
	            
	    varying vec4 v_Color;
	    varying vec2 v_Tex;
      varying vec3 v_LightDir;
      
   	void main(void) { 
  		 gl_Position = u_MvpMatrix * vec4(a_Position, 1.0); 
  		 vec3 lightDirection = normalize(vec3(0.0, 0.0, 0.0) - a_Position);
  	 	 v_Color = vec4(a_Color.xyz * dot(a_Normal, lightDirection), a_Color.w) * 0.5 + a_Color * 0.5;
 
   	}            
   

				#ifdef GL_ES               
				  precision highp float;
				#endif
			 uniform sampler2D u_Sampler;
			 
			 varying vec4 v_Color;

    		void main(void) {
    	              
    	  gl_FragColor =  v_Color; 
              
    		}                                              
*/     
	this.program = createProgram(gl, "testCubeVertex", "testCubeFragment");
	var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  	]); 
//纹理坐标，暂时不用
    var textures = new Float32Array([
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     1.0, 0.0,   0.0, 0.0,   0.0, 1.0,   1.0, 1.0,      
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0
    ]);
//切线坐标，暂时不用
    var tangents = new Float32Array([
     -2,0,0, -2,0,0, -2,0,0, -2,0,0,
     0,-2,0, 0,-2,0,0,-2,0,0,-2,0,
     0,0,-2,0,0,-2,0,0,-2,0,0,-2,
     
     0,0,-2,0,0,-2,0,0,-2,0,0,-2,
     2,0,0,2,0,0,2,0,0,2,0,0,
     -2,0,0,-2,0,0,-2,0,0,-2,0,0
    ]);
    
    var normals = new Float32Array([    // Normal
	    0.0, 0.0,-1.0,  0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,  // v0-v1-v2-v3 front
	   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,   -1.0, 0.0, 0.0,   -1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
	    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
	    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
	    0.0,1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0,  // v7-v4-v3-v2 down
	    0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0   // v4-v7-v6-v5 back
	  ]);

  var colors = new Float32Array([    // Colors 
     0, 1, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v0-v1-v2-v3 front  
     1, 1, 0,   1, 1, 0,   1, 1, 0,  1, 1, 0,     // v0-v3-v4-v5 right
     1, 0, 1,   1, 0, 1,   1, 0, 1,  1, 0, 1,     // v0-v5-v6-v1 up
     0, 0, 1,   0, 0, 1,   0, 0, 1,  0, 0, 1,     // v1-v6-v7-v2 left
     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
     0, 1, 1,   0, 1, 1,   0, 1, 1,  0, 1, 1　    // v4-v7-v6-v5 back
 ]);

  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);
  var verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
   
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
 
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
  this.draw = function(u_MvpMatrix){
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
 	
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  	
  	gl.uniform3f(this.program.u_PointLight, 3.0, 3.0, 3.0);
  	
    gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, u_MvpMatrix);
    
  	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0); 
  }
} 
////////////////////////////////////////////////////////////////////////////////////////////////
var Plane = function(gl){
/*
	attribute vec3 a_Position;
	uniform mat4 u_MvpMatrix;
	varying vec3 v_Pos;
	void main(void){ 
		gl_Position = u_MvpMatrix * vec4(a_Position * 1.0, 1.0);
	  v_Pos = a_Position;
	}

	#ifdef GL_ES               
		precision highp float; 
	#endif
	uniform samplerCube mapCube;
	uniform vec3 u_Eye;
	
	varying vec3 v_Pos;                   
	void main(void){ 
	 	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}    
*/
	this.program = createProgram(gl, "planeVertex", "planeFragment");
	var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
   
   //  1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
  
	]);
  	var indices = new Uint8Array([
	     0, 1, 2,   0, 2, 3,    // front
	  
 	]);
 	
 	var verticesBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  	gl.bindBuffer(gl.ARRAY_BUFFER, null);
  	
  	var indexBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
	this.draw = function(u_MvpMatrix){
	    gl.useProgram(this.program);
	    
	  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	  	gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);  
	  	gl.enableVertexAttribArray(this.program.a_Position);
 	     
 	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
 	    
 	    gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, u_MvpMatrix);
 	    gl.uniform3f(this.program.u_Eye, 1.0, 2.0, 2.0);
 
 	    	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0); 
	} 
}

var Ray = function(gl){
/*	顶点着色器
	attribute vec3 a_Position;
	attribute vec2 a_Tex;
	uniform mat4 u_MvpMatrix;
	varying vec2 v_Tex;
	void main(void){ 
		gl_Position = u_MvpMatrix * vec4(a_Position * 1.0, 1.0);
	    v_Tex = a_Tex;   
	}  
    片元着色器
	#ifdef GL_ES               
		precision highp float; 
	#endif 
	uniform sampler2D u_Sampler;
	varying vec2 v_Tex;              
	void main(void){ 	 
	 	gl_FragColor = texture2D(u_Sampler, v_Tex);
	}    
*/
	this.program = createProgram(gl, "rayVertex", "rayFragment");
	this.texture = createTexture(gl); 
	
	var vertices = new Float32Array([   // Coordinates
     10.0, 0.0, 1.0,  10.0, 0.0, -1.0,  -10.0, 0.0, -1.0,  -10.0, 0.0, 1.0,  
	 10.0, -1.0, 0.0, 10.0, 1.0, 0.0,   -10.0, 1.0, 0.0,  -10.0, -1.0, 0.0 
	]); 
	var textures = new Float32Array([
		1.0, 0.0,  1.0, 1.0,  0.0, 1.0,  0.0, 0.0,
		1.0, 0.0,  1.0, 1.0,  0.0, 1.0,  0.0, 0.0
	]); 
	var indices = new Uint8Array([
	     0, 1, 2,   0, 2, 3,    // front
	     4, 5, 6,   4, 6, 7
 	]);
 	var verticesBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  	gl.bindBuffer(gl.ARRAY_BUFFER, null);
  	
  	var texturesBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, texturesBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER, textures, gl.STATIC_DRAW);
  	gl.bindBuffer(gl.ARRAY_BUFFER, null);
  	
  	var indexBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
	this.draw = function(u_MvpMatrix){
	    gl.useProgram(this.program);
	    
	  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	  	gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);  
	  	gl.enableVertexAttribArray(this.program.a_Position);
	  	
	  	gl.bindBuffer(gl.ARRAY_BUFFER, texturesBuffer); 
	  	gl.vertexAttribPointer(this.program.a_Tex, 2, gl.FLOAT, false, 0, 0);  
	  	gl.enableVertexAttribArray(this.program.a_Tex);

 	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
 	    
 	    gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, u_MvpMatrix);

 	    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0); 
	} 
}


