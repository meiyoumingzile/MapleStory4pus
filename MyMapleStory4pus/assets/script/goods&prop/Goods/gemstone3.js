
cc.Class({
    extends: cc.Component,

    properties: {
        sc:cc.v2(1,1),
    },

    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
		this.body.linearVelocity=cc.v2(0,0);
		this.node.scaleX=ALL.scaleEnemy.x*this.sc.x;
        this.node.scaleY=ALL.scaleEnemy.y*this.sc.y;
    },
	
	// use this for initialization
	init: function(beginSpeed,x,y){//ep.kind代表种类，beginSpeed代表速度，sc代表大小
        this.body.linearVelocity=beginSpeed;
        this.node.x=x;
        this.node.y=y;
	},
	
    update: function (dt) {
		if(Math.sign(this.body.linearVelocity.y)*Math.sign(this.node.scaleY)==1){
			this.node.scaleY=-this.node.scaleY;
		}
	},
		
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"&&other.tag==0){
            //this.node.destroy();
        }else if(other.node.name.indexOf("Object")!=-1){
            this.body.gravityScale=0;
            this.body.linearVelocity=cc.v2(0,0);
        }
	},

});
