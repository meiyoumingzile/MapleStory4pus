cc.Class({
    extends: cc.Component,

    properties: {
        beginSpeed:cc.v2(0,0),
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.body.linearVelocity=cc.v2(0,0);
        this.angleSpeed=2;
    },

    
    update: function (dt) {
        var sp=this.body.linearVelocity; 
        //cc.log(sp.x);
        if(sp.x<-1){
            this.node.angle=(this.angleSpeed+this.node.angle)%360;
        }else if(sp.x>1){
            this.node.angle=(360-this.angleSpeed+this.node.angle)%360;
        }
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0){
           // cc.log(MainLead.node.scaleX,this.beginSpeed.x);
            this.body.linearVelocity=cc.v2(MainLead.node.scaleX*this.beginSpeed.x,this.body.linearVelocity.y);
            MainLead.body.linearVelocity=cc.v2(this.body.linearVelocity.x,this.body.linearVelocity.y);
        }
		
    },
    onPreSolve:function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0&&!MainLead.key.jump&&Math.abs(this.body.linearVelocity.x)>1){
            this.body.linearVelocity=cc.v2(MainLead.node.scaleX*this.beginSpeed.x,this.body.linearVelocity.y);
            MainLead.body.linearVelocity=cc.v2(this.body.linearVelocity.x,this.body.linearVelocity.y);
        }
		
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0){
            this.body.linearVelocity=cc.v2(0,this.body.linearVelocity.y);
            //MainLead.body.linearVelocity=cc.v2(this.body.linearVelocity.x,this.body.linearVelocity.y);
        }
		
    },
});
