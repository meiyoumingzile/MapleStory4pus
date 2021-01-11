cc.Class({
    extends: cc.Component,

    properties: {
        speed:cc.v2(0,0),
        rangeSize:cc.v2(0,0),
        sleeping:false,//是否在初始化唤醒
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.body.linearVelocity=this.sleeping?cc.v2(0,0):this.speed;
        this.rangeX=[this.node.x-this.rangeSize.x/2,this.node.x+this.rangeSize.x/2];
        this.rangeY=[this.node.y-this.rangeSize.y/2,this.node.y+this.rangeSize.y/2];
        this.node.beginSport=this.beginSport;
        this.node.script=this;
    },

    
    update: function (dt) {
        if(this.sleeping){
            return;
        }
        var speed=this.body.linearVelocity;
		var a=false;
		if(speed.x!=0&&(this.rangeX[0]>this.node.x||this.rangeX[1]<this.node.x)){
			this.node.x=speed.x>0?this.rangeX[1]-0.01:this.rangeX[0]+0.01;
			a=true;
		}
		if(speed.y!=0&&(this.rangeY[0]>this.node.y||this.rangeY[1]<this.node.y)){
			this.node.y=speed.y>0?this.rangeY[1]-0.01:this.rangeY[0]+0.01;
			a=true;
		}
		if(a){
            this.node.scaleX=-this.node.scaleX;
            var __speed=cc.v2(speed.x,speed.y);
			this.body.linearVelocity=cc.v2(0,0);
			
			
			this.callbackAttack = function(){
				this.body.linearVelocity=cc.v2(-__speed.x,-__speed.y);
			}
			this.schedule(this.callbackAttack,0.5,1,0);
		}
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collFloorDir[self._id]){
            MainLead.body.linearVelocity=cc.v2(sp.x,this.body.linearVelocity.y);
        }
		
    },
    onPreSolve:function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collFloorDir[self._id]&&!MainLead.key.jump){
            MainLead.body.linearVelocity=cc.v2(sp.x,this.body.linearVelocity.y);
        }
		
    },
    beginSport:function(){
        this.body.linearVelocity=this.speed;
        this.sleeping=false;
    },
});
