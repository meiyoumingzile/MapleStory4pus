cc.Class({
    extends: cc.Component,

    properties: {
        speed:cc.v2(0,0),
        beginSpeed:cc.v2(0,0),
        
        nowlen:cc.v2(0,0),
        
        state:"",
        
        collisionY:0,
        maxMoveLen:0,
        nowMoveLen:0,//位移，是有方向的初始是0
        moveDir:1,//移动方向初始为1，相反是-1

    },

    
    onLoad: function () {
        this.state=this.node.name.slice(this.node.name.slice(7,this.node.name.length).indexOf("_")+1+7,this.node.name.length);

        var speedX=parseInt(this.state.slice(0,4));
        var speedY=parseInt(this.state.slice(5,9));
        this.maxMoveLen=parseInt(this.state.slice(10,this.state.length));

        this.beginSpeed.x=speedX;
        this.beginSpeed.y=speedY;
        this.speed.x=this.beginSpeed.x;
        this.speed.y=this.beginSpeed.y;

    },

    
    update: function (dt) {
        this.changeMovePos();
        this.cal(dt);
        this.changeLeadPos();
    },





    onCollisionEnter: function (other, self){
        if(other.node.name=="Lead"){
            var otherAabb = other.world.aabb;
            var otherPreAabb = other.world.preAabb.clone();
            var selfAabb = self.world.aabb;
            var selfPreAabb = self.world.preAabb.clone();
            //var devy=this.Data.node.y-(selfAabb.yMin-this.Data.node.parent.parent.y+this.Data.cameraMove.y);
            selfPreAabb.x = selfAabb.x;
            otherPreAabb.x = otherAabb.x;
            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){
                if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)){//向左
                    //this.node.x+=otherPreAabb.xMax-selfAabb.xMin+1;
                    this.collisionX=-1;
                    
                }
                else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {//向右移动
                    //this.node.x-=selfAabb.xMax-otherPreAabb.xMin+1;
                    this.collisionX=1;
                }
                
            }else{
                selfPreAabb.y = selfAabb.y;
                otherPreAabb.y = otherAabb.y;
                if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){
                    if (selfPreAabb.yMax > otherPreAabb.yMax){//从上向下掉
                        
                        //this.node.y+=otherPreAabb.yMax-selfAabb.yMin-0.1;
                        
                        this.collisionY = -1;
                    }else if (selfPreAabb.yMin < otherPreAabb.yMin){
                        //this.node.y-=selfAabb.yMax -otherPreAabb.yMin+1;
                       
                        this.collisionY = 1;
                    }
                }
            }
        }
    },

    onCollisionStay: function (other, self){
        if(other.node.name.indexOf("Enemy")!=-1){
            other.node.x+=this.nowlen.x;
            other.node.y+=this.nowlen.y;
        }
    },

    onCollisionExit: function (other, self){
        if(other.node.name=="Lead"){
            if((ALL.Lead.y+other._size.height/2)-(this.node.y-self._size.height/2)<1){//人物在物体下面
                this.collisionY=0;
            }else if((ALL.Lead.y-other._size.height/2)-(this.node.y+self._size.height/2)>-1){//人物在物体上面
                this.collisionY=0;
            }
            if((ALL.Lead.x+other._size.width/2)-(this.node.x-self._size.width/2)<1){//人物在物体左面
                this.collisionX=0;
            }else if((ALL.Lead.x-other._size.width/2)-(this.node.x+self._size.width/2)>-1){//人物在物体右面
                this.collisionX=0;
            }
        }
    },




    cal:function(dt){
        this.nowlen.x=this.speed.x*dt;
        this.nowlen.y=this.speed.y*dt;
        this.nowMoveLen+=Math.sqrt(this.nowlen.x*this.nowlen.x+this.nowlen.y*this.nowlen.y)*this.moveDir;
        this.node.x += this.nowlen.x;
        this.node.y += this.nowlen.y;
    },

    changeMovePos:function(){
        if(Math.abs(this.nowMoveLen)>this.maxMoveLen){
            this.nowMoveLen=this.maxMoveLen*this.moveDir;
            this.speed.y=-this.speed.y;
            this.speed.x=-this.speed.x;
            this.moveDir=-this.moveDir;
        }
    },

    changeLeadPos:function(){
        //cc.log(this.collisionY);
        if(this.collisionY==1){
            ALL.Lead.y+=this.nowlen.y;
            ALL.Lead.getComponent("Lead_control").moveCamera(0,this.nowlen.y);
            ALL.Lead.x+=this.nowlen.x;
            ALL.Lead.getComponent("Lead_control").moveCamera(this.nowlen.x,0);
        }
        
        if((this.collisionX==1&&this.speed.x>0)||(this.collisionX==-1&&this.speed.x<0)){
            ALL.Lead.x+=this.nowlen.x;
            ALL.Lead.getComponent("Lead_control").moveCamera(this.nowlen.x,0);
        }
    },


    
});
