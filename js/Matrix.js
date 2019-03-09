
function rotateX(angle){
	var cos = Math.cos(Math.PI / 180 * angle);
	var sin = Math.sin(Math.PI / 180 * angle);
	var mat = [
	             1,   0,    0,0,
                 0, cos, -sin,0,
                 0, sin, cos, 0,
                 0,   0,    0,1
	           ];
	    return mat;
}

function rotateY(angle){
   var	cos = Math.cos(Math.PI / 180 * angle);
   var	sin = Math.sin(Math.PI / 180 * angle);
   var mat = [ cos,   0,    sin,0,
                 0,   1,      0,0,
              -sin,   0,    cos,0,
                 0,   0,      0,1];
       return mat;
}

function rotateZ(angle){
	var	cos = Math.cos(Math.PI / 180 * angle);
    var	sin = Math.sin(Math.PI / 180 * angle);
    var mat = [cos, -sin,0,0,
               sin,  cos,0,0,
                 0,   0,1,0,
                 0,   0,0,1 ];
    return mat;
}
 function LookAt(e1, e2, e3, c1, c2, c3, u1, u2, u3){ 
  var mvpMatrix = [
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0
        ];  
     
  if(e1 == undefined || e2 == undefined || e3 == undefined || c1 == undefined || c2 == undefined || c3 == undefined || u1 == undefined || u2 == undefined || u3 == undefined)
  {
  	  throw err = new Error("参数传递错误");
  	  return;
  }
      z1 = e1 - c1; z2 = e2 - c2, z3 = e3 - c3;
      
      //转化为单位向量
      lengthZ = 1 / Math.sqrt(z1*z1 + z2*z2 + z3*z3);
      
      z1 *= lengthZ;
      z2 *= lengthZ;
      z3 *= lengthZ;  
      
      //向量z与向量up求内积进而求出向量x
      x1 = u2 * z3 - u3 * z2;   
      x2 = u3 * z1 - u1 * z3;
      x3 = u1 * z2 - u2 * z1;
        
      lengthX = 1 / Math.sqrt(x1 * x1 + x2 * x2 + x3 * x3);
      x1 *= lengthX;
      x2 *= lengthX;
      x3 *= lengthX;  
      
      y1 = z2 * x3 - z3 * x2;
      y2 = z3 * x1 - z1 * x3;
      y3 = z1 * x2 - z2 * x1;
      lengthY = 1 / Math.sqrt(y1 * y1 + y2 * y2 + y3 * y3);
      y1 *= lengthY;
      y2 *= lengthY;
      y3 *= lengthY;
        
      mvpMatrix[0] = x1;  mvpMatrix[1]  = y1; mvpMatrix[2]  = z1; mvpMatrix[3] = 0;
      mvpMatrix[4] = x2;  mvpMatrix[5]  = y2; mvpMatrix[6]  = z2; mvpMatrix[7] = 0;
      mvpMatrix[8] = x3;  mvpMatrix[9]  = y3; mvpMatrix[10] = z3; mvpMatrix[11] = 0;
      mvpMatrix[12] = -(e1 * x1 + e2 * x2 + e3 * x3); 
      mvpMatrix[13] = -(e1 * y1 + e2 * y2 + e3 * y3); 
      mvpMatrix[14] = -(e1 * z1 + e2 * z2 + e3 * z3);
      mvpMatrix[15] = 1;
      
      return mvpMatrix;
    }   
  
  
  
function multiply(mat1, mat2){
	 var ans = new Array(16);
	 ans[0] = mat1[0] * mat2[0] + mat1[1]*mat2[4] + mat1[2] * mat2[8]  + mat1[3] * mat2[12];
	 ans[1] = mat1[0] * mat2[1] + mat1[1]*mat2[5] + mat1[2] * mat2[9]  + mat1[3] * mat2[13];
	 ans[2] = mat1[0] * mat2[2] + mat1[1]*mat2[6] + mat1[2] * mat2[10] + mat1[3] * mat2[14];
	 ans[3] = mat1[0] * mat2[3] + mat1[1]*mat2[7] + mat1[2] * mat2[11] + mat1[3] * mat2[15];
	 
	 ans[4] = mat1[4] * mat2[0] + mat1[5]*mat2[4] + mat1[6] * mat2[8]  + mat1[7] * mat2[12];
	 ans[5] = mat1[4] * mat2[1] + mat1[5]*mat2[5] + mat1[6] * mat2[9]  + mat1[7] * mat2[13];
	 ans[6] = mat1[4] * mat2[2] + mat1[5]*mat2[6] + mat1[6] * mat2[10] + mat1[7] * mat2[14];
	 ans[7] = mat1[4] * mat2[3] + mat1[5]*mat2[7] + mat1[6] * mat2[11] + mat1[7] * mat2[15];
	
	 ans[8] = mat1[8] * mat2[0] + mat1[9]*mat2[4] + mat1[10] * mat2[8]  + mat1[7] * mat2[12];
	 ans[9] = mat1[8] * mat2[1] + mat1[9]*mat2[5] + mat1[10] * mat2[9]  + mat1[7] * mat2[13];
	ans[10] = mat1[8] * mat2[2] + mat1[9]*mat2[6] + mat1[10] * mat2[10] + mat1[7] * mat2[14];
	ans[11] = mat1[8] * mat2[3] + mat1[9]*mat2[7] + mat1[10] * mat2[11] + mat1[7] * mat2[15];
	
	ans[12] = mat1[12] * mat2[0] + mat1[13]*mat2[4] + mat1[14] * mat2[8]  + mat1[15] * mat2[12];
	ans[13] = mat1[12] * mat2[1] + mat1[13]*mat2[5] + mat1[14] * mat2[9]  + mat1[15] * mat2[13];
	ans[14] = mat1[12] * mat2[2] + mat1[13]*mat2[6] + mat1[14] * mat2[10] + mat1[15] * mat2[14];
	ans[15] = mat1[12] * mat2[3] + mat1[13]*mat2[7] + mat1[14] * mat2[11] + mat1[15] * mat2[15];
	return ans;
}
      
    
//设置perspective
function SetPerspective(fovy, aspect, near, far){
  var mvpMatrix = [
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0
        ];  
 
  var cot = 1 / Math.tan(Math.PI / 360 * fovy);
  var n = near;
  var f = far;
  mvpMatrix[0] = cot/aspect;   
  mvpMatrix[5] = cot;
  mvpMatrix[10]= -(f + n)/(f - n);
 
  mvpMatrix[11]= -1;
  mvpMatrix[14]=-f * n * 2/(f - n);
  
  return mvpMatrix;
 }

function directLight(angleX, angleY, angleZ){
	this.vector = [angleX, angleY, angleZ];
	var length = Math.sqrt(angleX * angleX + angleY * angleY + angleZ * angleZ);
	this.vector[0] /= length;
	this.vector[1] /= length;
	this.vector[2] /= length;
	this.normalize = function(){
		var temp = Math.sqrt(this.vector[0] * this.vector[0] + this.vector[1] * this.vector[1] + this.vector[2] * this.vector[2]);
		this.vector[0] /= temp;
		this.vector[1] /= temp;
		this.vector[2] /= temp;
	}
	this.rotateX = function(angle){
		var cos = Math.cos(Math.PI / 180 * angle);
		var sin = Math.sin(Math.PI / 180 * angle);
		this.vector[1] = this.vector[1] * cos + this.vector[2] * sin;
		this.vector[2] = this.vector[1] * (-sin) + this.vector[2] * cos;

	}
	this.rotateY = function(angle){
		var cos = Math.cos(Math.PI / 180 * angle);
		var sin = Math.sin(Math.PI / 180 * angle);
		this.vector[0] = this.vector[0] * cos - this.vector[2] * sin;
		this.vector[2] = this.vector[0] * sin + this.vector[2] * cos;
	}
	this.rotateZ = function(angle){
		var cos = Math.cos(Math.PI / 180 * angle);
		var sin = Math.sin(Math.PI / 180 * angle);
		this.vector[0] = this.vector[0] * cos + this.vector[1] * sin;
		this.vector[1] = this.vector[0] *(-sin) + this.vector[1] * cos;
	}
} 

function inverse(mat){
	    var dest = new Array(16);
		var a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
			e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
			i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
			m = mat[12], n = mat[13], o = mat[14], p = mat[15],
			q = a * f - b * e, r = a * g - c * e,
			s = a * h - d * e, t = b * g - c * f,
			u = b * h - d * f, v = c * h - d * g,
			w = i * n - j * m, x = i * o - k * m,
			y = i * p - l * m, z = j * o - k * n,
			A = j * p - l * n, B = k * p - l * o,
			ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
		dest[0]  = ( f * B - g * A + h * z) * ivd;
		dest[1]  = (-b * B + c * A - d * z) * ivd;
		dest[2]  = ( n * v - o * u + p * t) * ivd;
		dest[3]  = (-j * v + k * u - l * t) * ivd;
		dest[4]  = (-e * B + g * y - h * x) * ivd;
		dest[5]  = ( a * B - c * y + d * x) * ivd;
		dest[6]  = (-m * v + o * s - p * r) * ivd;
		dest[7]  = ( i * v - k * s + l * r) * ivd;
		dest[8]  = ( e * A - f * y + h * w) * ivd;
		dest[9]  = (-a * A + b * y - d * w) * ivd;
		dest[10] = ( m * u - n * s + p * q) * ivd;
		dest[11] = (-i * u + j * s - l * q) * ivd;
		dest[12] = (-e * z + f * x - g * w) * ivd;
		dest[13] = ( a * z - b * x + c * w) * ivd;
		dest[14] = (-m * t + n * r - o * q) * ivd;
		dest[15] = ( i * t - j * r + k * q) * ivd;
		return dest;
};

//绕向量旋转
function rotateAxis(ax, ay, az, theta){ // 旋转向量x, y, z 角度theta
	 var length = Math.sqrt(ax * ax + ay * ay + az * az);
	 ax /= length;
	 ay /= length;
	 az /= length;
	
	 var rotate = [1, 0, 0, 0,
	 			   0, 1, 0, 0, 
	  			   0, 0, 1, 0,
	  			   0, 0, 0, 1
	 				]
	 var c = Math.cos(Math.PI / 180 * theta);   
	 var s = Math.sin(Math.PI / 180 * theta);
	 rotate[0] = ax * ax * (1 - c) + c;
	 rotate[1] = ax * ay * (1 - c) - az * s;
	 rotate[2] = ax * az * (1 - c) + ay * s;
	 
	 rotate[4] = ax * ay * (1 - c) + az * s;
	 rotate[5] = ay * ay * (1 - c) + c;
	 rotate[6] = ay * az * (1 - c) - ax * s;
	 
	 rotate[8] = ax * az * (1 - c) - ay * s;
	 rotate[9] = ay * az * (1 - c) + ax * s;
	 rotate[10]= az * az * (1 - c) + c;
	 
	 return rotate; 
}

function multiplyVM(vector, mat){
	var ans = [0, 0, 0, 0];
	for(var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++){
			ans[i] += vector[j] * mat[i + 4 * j];
 
		}
		return ans;
}

function multiplyMV(mat, vector){
	var ans = [0, 0, 0, 0];
	for(var i = 0; i < 4; i++)
	 for(var j = 0; j < 4; j++){
	 	ans[i] += vector[j] * mat[i * 4 + j];
	 } 
	 return ans;
}
