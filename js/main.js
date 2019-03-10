var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl');
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);
gl.enable(gl.DEPTH_TEST); 
var view = LookAt(0, 0, 9, 0, 0, 0, 0, 1, 0); 
var proj = SetPerspective(45, canvas.width / canvas.height, 0.01, 100);
var rotate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var vpMatrix = multiply(view, proj);
var mvpMatrix = multiply(rotate, vpMatrix);
var drag = new Drag(canvas);
var ray =  new RayTracer(gl, view, proj);
ray.update(rotate); 

var cubeArray = [];            //魔方数组
makeCube(gl); 

const DRAW_STATIC = 0;
const DRAW_DYNAMIC = 1;
var drawState = DRAW_STATIC; 

const MODE_NORMAL = 0;                            //普通状态
const MODE_MOVE = 4;                              //按下且命中魔方后进入的状态
const MODE_WORLD = 1;      
const MODE_CUBE = 2;                              //按下后且命中魔方并且移动后的状态               
const MODE_ANIMATE = 3;                           //     
var nowState = MODE_NORMAL;                       //当前的状态值 
var hit = false;                                  //判断有没有命中魔方
var degree = 0;                                   //拖拽的程度     
const sensivity = 20;                             //控制拖拽的灵敏度
var moveX = 0, moveY = 0;                        
var LastX = 0, LastY = 0;

var HitPos = new Vector(0, 0, 0);               //与魔方表面接触的点
var DragPos = new Vector(0, 0, 0);              //接触后与平面接触的点
var HitPlane = new Vector(0, 0, 0);             //接触面的向量表示
var HitCube = new Vector(0, 0, 0);              //获取命中的小魔方中心坐标
var rotateVector = new Vector(0, 0, 0);
var dragtest = new DragTest(canvas); 

function tickTest(){ 
	switch(nowState){
	    case MODE_NORMAL:{   
	    	LastX = dragtest.px;
	    	LastY = dragtest.py; 
	    	var hitRay = ray.getRayForPixel(dragtest.px, dragtest.py);
			var tempPos = ray.hitTestBox(ray.eye, hitRay, new Vector(-1.5, -1.5, -1.5), new Vector(1.5, 1.5, 1.5));
			if(tempPos){ 
			   hit = true; HitPos = tempPos;
			}else{
				hit = false; 
			}
	    	break;
	   } 
	    case MODE_WORLD:{ 
            moveX += dragtest.px - LastX;
            moveY += dragtest.py - LastY;
            LastX = dragtest.px;
            LastY = dragtest.py;
            y = Math.max(Math.min(moveY, 90.0), -90); 
    		rotate = multiply(rotateY(-moveX), rotateX(-moveY));
    		mvpMatrix = multiply(rotate, vpMatrix);
			  ray.update(rotate);
	    	break;	 
	    } 
	     
	    case MODE_CUBE:{     //获取旋转的方向， 在这一状态还不确定旋转的具体状态
	    	drawState = DRAW_DYNAMIC;  	 
	        var hitRay = ray.getRayForPixel(dragtest.px, dragtest.py);
			DragPos = ray.hitTestPlane(ray.eye, hitRay, HitPlane.multiply(1.5));
			var direction = getDragDirection(DragPos, HitPos); 
	    	rotateVector = direction.cross(HitPlane);
	    	   
	    	break;  
	    }  
 
	    case MODE_ANIMATE:{ 
	    	//drawState = DRAW_STATIC;   
	  //  	var direction = getDragDirection(DragPos, HitPos); 
	 //   	rotateVector = direction.cross(HitPlane); 
//////////////////////////////////////////// 
	      drawState = DRAW_DYNAMIC;   
          if(degree > 30) 
              degree += 10;
          else 
              degree -= 10;  
          if(degree >= 90 || degree <= 0){
          	drawState = DRAW_STATIC; 
          	if(degree >= 90) 
	        	makeCubeUpdateRotate(rotateVector, HitCube); 
	    	nowState = MODE_NORMAL;
	    	}
	    	break;
	    }  
	} 
	if(drawState == DRAW_STATIC)  
	   drawCubeStatic(mvpMatrix, HitPos);    
	else
	   drawCubeDynamic(mvpMatrix, rotateVector, degree, HitCube);
	   
	requestAnimationFrame(tickTest);
}

tickTest();


function DragTest(canvas){   
	var that = this;
	    this.px = 0;                    //鼠标相对于canvas的位置
	    this.py = 0;
        this.dx = 0;
        this.dy = 0;
		  canvas.onmousedown = function(ev) {  
		  	   that.dx = 0;
		  	   that.dy = 0;
	          if(hit == true){
	             //算出碰撞平面 
	            HitPlane = getHitPlane(HitPos);
	            HitCube = getHitCube(HitPos); 
	            nowState = MODE_MOVE;
	           }
	          else
	            nowState = MODE_WORLD;
		  };
		  canvas.onmouseup = function(ev) { 
		  		 that.dx = 0;
		  	     that.dy = 0;  
		  	     
	           if(nowState == MODE_CUBE)
	              nowState = MODE_ANIMATE;
	           else
	              nowState = MODE_NORMAL;
	                
		  };  
		  canvas.onmousemove = function(ev) { 
		  	  that.dx = ev.clientX - that.px;
		  	  that.dy = ev.clientY - that.py;  
              that.px = ev.clientX;
              that.py = ev.clientY;
              if(nowState == MODE_MOVE){   //进入下一个状态前确定旋转方向
              	
              	 nowState = MODE_CUBE; 
              }
		  };
	 
};

///////////////////////////////////////////////////
function floor(num){           //将浮点坐标转换为整数坐标
		if(num > 0)
		   return (num > 0.5? 1:0);
		else
		   return (num <-0.5?-1:0);
}
function getHitCube(point){
	return new Vector(floor(point.x), floor(point.y), floor(point.z));
} 
function getHitPlane(point){
	var absX = Math.abs(point.x);
	var absY = Math.abs(point.y);
	var absZ = Math.abs(point.z);
	if(absX > absY){
		if(absX > absZ)
		  return new Vector((point.x > 0?1:-1), 0, 0);
		else
		  return new Vector(0, 0, (point.z > 0?1:-1));
	} 
	else
	{
	    if(absY > absZ)
		  return new Vector(0, (point.y > 0?1:-1), 0);
		else
		  return new Vector(0, 0, (point.z > 0?1:-1));
	}
}
function getDragDirection(DragPos, HitPos){      //获取拖拽的方向向量
	var dragVector = DragPos.subtract(HitPos);
	
	var absX = Math.abs(dragVector.x);
	var absY = Math.abs(dragVector.y);
	var absZ = Math.abs(dragVector.z);
    var temp = new Vector((dragVector.x > 0) * 2 - 1,
                          (dragVector.y > 0) * 2 - 1,
    	                  (dragVector.z > 0) * 2 - 1);
	 
	if(absX > absY){
		temp.y = 0;
		if(absX > absZ)
		  temp.z = 0, degree = absX * sensivity;
		else
		  temp.x = 0, degree = absZ * sensivity;  
	}
	else{
		temp.x = 0;
		if(absY > absZ)
		  temp.z = 0, degree = absY * sensivity;
		else
		  temp.y = 0, degree = absZ * sensivity;
	}
	return temp;
}

