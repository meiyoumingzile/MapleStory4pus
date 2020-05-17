cc.Class({
    extends: cc.Component,

    properties: {
        speed:cc.v2(0,0),
        rangeSize:cc.v2(0,0),
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.body.linearVelocity=this.speed;
        var sc=cc.v2(ALL.MainCanvas.width/2,ALL.MainCanvas.height/2);
        this.rangeX=[Math.max(-sc.x,this.node.x-this.rangeSize.x/2),Math.min(sc.x,this.node.x+this.rangeSize.x/2)];
        this.rangeY=[Math.max(-sc.y,this.node.y-this.rangeSize.y/2),Math.min(sc.y,this.node.y+this.rangeSize.y/2)];
    },

    
    update: function (dt) {
		if(this.rangeX[0]>this.node.x||this.rangeX[1]<this.node.x){
			this.node.x=this.body.linearVelocity.x<0?this.rangeX[1]-0.01:this.rangeX[0]+0.01;
		}
		if(this.rangeY[0]>this.node.y||this.rangeY[1]<this.node.y){
			this.node.y=this.body.linearVelocity.y<0?this.rangeY[1]-0.01:this.rangeY[0]+0.01;
		}
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.name=="Lead"&&MainLead.coll.collFloorDir[self._id]){
            MainLead.body.linearVelocity=cc.v2(sp.x,this.body.linearVelocity.y);
        }
		
    },
    onPreSolve:function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.name=="Lead"&&MainLead.coll.collFloorDir[self._id]){
            MainLead.body.linearVelocity=cc.v2(sp.x,this.body.linearVelocity.y);
        }
		
    },
});
