cc.Class({
    extends: cc.Component,

    properties: {
        tartrackNode:cc.Node,//目标节点，代表轨道
        speed:cc.v2(0,0),
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.body.linearVelocity=cc.v2(0,0);
        var p=this.tartrackNode.position;
        this.rangeX=[p.x-this.tartrackNode.width/2,p.x+this.tartrackNode.width/2];
        this.rangeY=[p.y-this.tartrackNode.height/2,p.y+this.tartrackNode.height/2];
        this.node.isCollLead=false;
        this.fp=cc.v2(Math.sign(this.speed.x),Math.sign(this.speed.y));
        this.stoping=false;
        this.node.script=this;
    },

    
    update: function (dt) {
        var arm=MainLead.data.armColl[MainLead.data.nowArms];
        if(!this.node.isCollLead||(arm&&arm.collWood&&arm.collWood.node!=this.node)){//保值碰到一个时再碰另一个没反应
            this.body.linearVelocity=cc.v2(0,0);
            return;
        }
       
        var speed=this.body.linearVelocity;
		var a=false;
		if(speed.x!=0&&(this.rangeX[0]>this.node.x||this.rangeX[1]<this.node.x)){
			this.node.x=speed.x>0?this.rangeX[1]-1:this.rangeX[0]+1;
			a=true;
		}
		if(speed.y!=0&&(this.rangeY[0]>this.node.y||this.rangeY[1]<this.node.y)){
			this.node.y=speed.y>0?this.rangeY[1]-1:this.rangeY[0]+1;
			a=true;
		}
		if(a){
            this.stoping=true;
            this.fp.x=-this.fp.x;
            this.fp.y=-this.fp.y;
            var __speed=cc.v2(speed.x,speed.y);
            this.body.linearVelocity=cc.v2(0,0);
            MainLead.node.x+=-Math.sign(speed.x)*2;
            MainLead.node.y+=-Math.sign(speed.y)*2;//控精度防止滑出
            if(this.node.isCollLead){
                MainLead.body.linearVelocity=cc.v2(0,0);
            }
            
			this.callbackAttack = function(){
                this.body.linearVelocity=cc.v2(-__speed.x,-__speed.y);
                if(this.node.isCollLead){
                    MainLead.body.linearVelocity=cc.v2(-__speed.x,-__speed.y);
                }
                this.stoping=false;
                this.unschedule(this.callbackAttack);
			}
			this.schedule(this.callbackAttack,1.5,2,0);
		}else if(!this.stoping){
            this.body.linearVelocity=cc.v2(this.speed.x*this.fp.x,this.speed.y*this.fp.y);
        }
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
        var ep=other.node.getComponent("ArmPublic");
        var arm=MainLead.data.armColl[MainLead.data.nowArms];
        if((other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collFloorDir[self._id]&&!MainLead.key.jump||ep&&ep.category=="spear")
            &&(!arm||!arm.collWood)){
            MainLead.body.linearVelocity=cc.v2(sp.x,this.body.linearVelocity.y);
            if(!this.node.isCollLead){
                this.node.isCollLead=true;
            }

        }
    },
   
    onPreSolve:function(contact, self, other){//每一帧调用,senor不会调用
        var sp=MainLead.body.linearVelocity;
        var ep=other.node.getComponent("ArmPublic");
        var arm=MainLead.data.armColl[MainLead.data.nowArms];
        if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collFloorDir[self._id]&&!MainLead.key.jump&&(!arm||!arm.collWood)){
            MainLead.body.linearVelocity=cc.v2(sp.x,this.body.linearVelocity.y);
            if(!this.node.isCollLead){
                this.node.isCollLead=true;
            }
        }
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
        var ep=other.node.getComponent("ArmPublic");
		if(other.node.name=="Lead"&&other.tag==0||ep&&ep.category=="spear"){
            this.node.isCollLead=false;
        }
    },
    setSpeed: function (){
        this.body.linearVelocity=cc.v2(this.speed.x*this.fp.x,this.speed.y*this.fp.y);
    }
});
