function Drag(canvas){                
	    this.px = 0;                    //鼠标相对于canvas的位置
	    this.py = 0;
	    
  		this.dx = 0;                    //鼠标横向移动时的速度
		this.dy = 0;                    //鼠标纵向移动的速度
		this.dlength = 0;               //鼠标移动的速度
			
		  var dragging = false;         // Dragging or not
		  var lastX = 0, lastY = 0;   // Last position of the mouse
		  var that = this;
		  
		  canvas.onmousedown = function(ev) {   // Mouse is pressed
		    var x = ev.clientX, y = ev.clientY;
		    // Start dragging if a moue is in <canvas>
		    var rect = ev.target.getBoundingClientRect();
		    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom){
		    	
		      lastX = x; lastY = y;
		      dragging = true;
		    }
		  };
		  canvas.onmouseup = function(ev) { 
		  	dragging = false;  
		    that.dx = 0; 
		    that.dy = 0;
		    that.dlength = 0;
		  }; // Mouse is released
		  canvas.onmousemove = function(ev) { // Mouse is moved
		  	that.px = ev.clientX;
		  	that.py = ev.clientY;
		    if (dragging) { 
		  
		      var factor = 100 / canvas.height; // The rotation ratio
		      that.dx = factor * (ev.clientX - lastX);
		     
		      that.dy = factor * (ev.clientY - lastY);
		      that.dlength = Math.sqrt(that.dx * that.dx + that.dy * that.dy) * 0.1;
		   
		    lastX = ev.clientX, lastY = ev.clientY;
		    }  
		  };
};

var keyDetect = function(){                //w, a, s, d按键检测
	  		this.keys = [0, 0, 0, 0];
	  		var that = this;
			document.onkeydown = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65: that.keys[1] = 1; break;
					case 83: that.keys[2] = -1; break;
					case 87: that.keys[0] = 1; break;
					case 68: that.keys[3] = -1; break;
					default: return;
				}
			}
				
			document.onkeyup = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65:  that.keys[1] = 0; break;
					case 83: that.keys[2] = 0; break;
					case 87: that.keys[0] = 0; break;
					case 68: that.keys[3] = 0; break;
					default: return;
				}
			}		
};
function createProgram(gl, vertex, fragment){   
	  var vertexShaderScript = document.getElementById(vertex);
	
	  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	  gl.shaderSource(vertexShader, vertexShaderScript.text);
	  gl.compileShader(vertexShader);
	  
	  var fragmentShaderScript = document.getElementById(fragment);
	  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	  gl.shaderSource(fragmentShader, fragmentShaderScript.text);
	  gl.compileShader(fragmentShader);
	  
	  var program = gl.createProgram();

	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	  gl.linkProgram(program);
		
	  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < uniformCount; i++) {
            var uniformName = gl.getActiveUniform(program, i).name;
            program[uniformName] = gl.getUniformLocation(program, uniformName);
        }
    var attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for(var i = 0; i < attributeCount; i++) {
        		var attributeName = gl.getActiveAttrib(program, i).name;
        		program[attributeName] = gl.getAttribLocation(program, attributeName); 	
        }
        
      return program;
	
}


function mouseEvent(){       //全屏时的鼠标移动事件
	var that = this;
	this.dx = 0;
	this.dy = 0;
	//右正左负      上正下负
	document.addEventListener("mousemove", function(e) {
  		that.dx = e.movementX       ||
                  e.mozMovementX    ||
                  e.webkitMovementX ||
                  0;
 	    that.dy = e.movementY       ||
                  e.mozMovementY    ||
                  e.webkitMovementY ||
                  0;
	}, false);	
}

function generateSprite(){                        //生成精灵贴图 
            var canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128; 

            var context = canvas.getContext('2d');
            var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
            gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            return canvas;
        }
function createTexture(gl, object, num){          //object为创建纹理的对象，可以是Image或者canvas， num表示开启的纹理序号
			var texture = gl.createTexture();
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
            
            gl.activeTexture(gl['TEXTURE' + (num?num:0)]);
        
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); 
           
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, generateSprite());
            return texture;
}

function hsva(h, s, v, a){                        //生成颜色
		if(s > 1 || v > 1 || a > 1){return;}
		var th = h % 360;
		var i = Math.floor(th / 60);
		var f = th / 60 - i;
		var m = v * (1 - s);
		var n = v * (1 - s * f);
		var k = v * (1 - s * (1 - f));
		var color = new Array();
		if(!s > 0 && !s < 0){
			color.push(v, v, v, a); 
		} else {
			var r = new Array(v, n, m, m, k, v);
			var g = new Array(k, v, v, n, m, m);
			var b = new Array(m, m, k, v, v, n);
			color.push(r[i], g[i], b[i], a);
		}
		return color;
}

var createSkyBox = function(gl, width, height){  

	targets = [ 	 gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                     gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                     gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
			  ];                 
    (function InitFBOCube(that){
		    // WebGLFramebuffer
		    that.fboShader = gl.createFramebuffer();
		    gl.bindFramebuffer(gl.FRAMEBUFFER, that.fboShader);
		    that.fboShader.width = 512;
		    that.fboShader.height = 512;
		    
		    gl.activeTexture(gl.TEXTURE0); console.log("开启纹理单元"+gl.TEXTURE0);
		    
		    that.cubeTexID = gl.createTexture();
		    gl.bindTexture(gl.TEXTURE_CUBE_MAP, that.cubeTexID);
		    
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		
		    for (var i = 0; i < targets.length; i++) {
		        gl.texImage2D(targets[i], 0, gl.RGBA, that.fboShader.width, that.fboShader.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		    }
		  //  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		   
		})(this);
		
	this.renderFBO = function(program) {
		gl.disable(gl.DEPTH_TEST);
	    gl.viewport(0, 0, width, height);
	    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboShader);
	    
	    for (var i = 0; i < targets.length; i++) {
	        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, targets[i], this.cubeTexID, null);
	        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	    }
	
	    var per = SetPerspective(45, 1, 0.1, 200.0); 
	    for (var i = 0; i < targets.length; i++) {
	        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, targets[i], this.cubeTexID, null);
	        var lookat = [0.0, 0.0, 0.0];
	        var up = [0.0, 0.0, 0.0];
	        up[1] = 1.0;
	        if (i == 0) {
	            lookat[0] = -1.0;
	        } else if (i == 1) {
	            lookat[0] = 1.0;             
	        } else if (i == 2) {
	            lookat[1] = -1.0;
	            up[0] = 1.0;
	        } else if (i == 3) {
	            lookat[1] = 1.0;
	            up[0] = 1.0;
	        } else if (i == 4) {
	            lookat[2] = -1.0;         
	        } else if (i == 5) {
	            lookat[2] = 1.0;            
	        };          
	        
		   var look = LookAt(0.0 ,0.0, 0.0, lookat[0], lookat[1], lookat[2], up[0], up[1], up[2]);
		       
		   var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
		   gl.uniformMatrix4fv(u_MvpMatrix, false, multiply(look, per));
	 
		   gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0); 
	    } 
	    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	    gl.enable(gl.DEPTH_TEST);
	    
	}
}

//需要模型视图矩阵， 投影矩阵， 且
var RayTracer = function(gl, view, proj){
  this.gl = gl;
  this.invVP = inverse(multiply(view, proj));
  this.invV = inverse(view);
  this.viewport = gl.getParameter(gl.VIEWPORT);
  
}

function unProject(winX, winY, winZ, viewPort, invVP, rotate){
     winX = (winX - viewPort[0]) / viewPort[2] * 2 - 1;
     winY = (winY - viewPort[1]) / viewPort[3] * 2 - 1;
     winZ = winZ * 2 - 1; 
     
     var ans = multiplyMV(rotate, multiplyVM([winX, winY, winZ, 1.0], invVP));
     return new Vector(ans[0], ans[1], ans[2]).divide(ans[3]);
} 

RayTracer.prototype = {
   getRayForPixel: function(x, y) {
    x = (x - this.viewport[0]) / this.viewport[2];
    y = 1 - (y - this.viewport[1]) / this.viewport[3];
    var ray0 = Vector.lerp(this.ray00, this.ray10, x);
    var ray1 = Vector.lerp(this.ray01, this.ray11, x);
    return Vector.lerp(ray0, ray1, y).unit();
  },
   update: function(rotate){ 
   	   var minX = this.viewport[0], maxX = minX + this.viewport[2];
  	   var minY = this.viewport[1], maxY = minY + this.viewport[3];
  		  
   	   var temp = multiplyMV(rotate, multiplyVM([0, 0, 0, 1], this.invV));
   	   
   	   this.eye = new Vector(temp[0], temp[1], temp[2]); 
   	   this.ray00 = unProject(minX, minY, 1, this.viewport, this.invVP, rotate).subtract(this.eye);
	   this.ray10 = unProject(maxX, minY, 1, this.viewport, this.invVP, rotate).subtract(this.eye);
	   this.ray01 = unProject(minX, maxY, 1, this.viewport, this.invVP, rotate).subtract(this.eye);
	   this.ray11 = unProject(maxX, maxY, 1, this.viewport, this.invVP, rotate).subtract(this.eye);
	   
   },
   
   hitTestBox:function(origin, ray, min, max) {      //返回目标点
	  var tMin = min.subtract(origin).divide(ray);
	  var tMax = max.subtract(origin).divide(ray);
	  var t1 = Vector.min(tMin, tMax);
	  var t2 = Vector.max(tMin, tMax);
	  var tNear = t1.max();
	  var tFar = t2.min();
	 
		  if (tNear > 0 && tNear < tFar) {
		    var epsilon = 1.0e-6, hit = origin.add(ray.multiply(tNear));
		    min = min.add(epsilon);
		    max = max.subtract(epsilon);
		    //return tNear;
		      return origin.add(ray.multiply(tNear));
		  }
		  return null;
  },
   
   hitTestPlane:function(origin, ray, plane){
   	//   var tMin = plane.subtract(origin).divide(ray);
   	//   return origin.add(ray.multiply(tMin.max()));
       if(plane.x != 0)
         return origin.add(ray.multiply((plane.x - origin.x) / ray.x));
       if(plane.y != 0)
         return origin.add(ray.multiply((plane.y - origin.y) / ray.y));
       if(plane.z != 0)
         return origin.add(ray.multiply((plane.z - origin.z) / ray.z));
   }

}
