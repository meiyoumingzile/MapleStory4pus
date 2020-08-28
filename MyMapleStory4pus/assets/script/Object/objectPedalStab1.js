cc.Class({
    extends: cc.Component,

    properties: {
        speedy:0,
        high:0,
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        var stab=this.node.getChildren();
        this.stab=null;
        for(var i=0;i<stab.length;i++){
            if(stab[i].name.indexOf("Enemy_")!=-1)
                this.stab=stab[i];
        }
        this.body.linearVelocity=cc.v2(0,this.speedy);
        this.rangeY=[this.node.y-0.01,this.node.y+this.high];
    },

    
    update: function (dt) {
        var speed=this.body.linearVelocity;
		if(speed.y!=0&&this.high>10&&(this.rangeY[0]>this.node.y||this.rangeY[1]<this.node.y)){
            this.node.y=speed.y>0?this.rangeY[1]-0.01:this.rangeY[0]+0.01;
            if(Math.sign(this.speedy)*speed.y>0){
                this.body.linearVelocity=cc.v2(0,0);
                this.callbackAttack = function(){
                    this.body.linearVelocity=cc.v2(0,-this.speedy*10);
                }
                this.schedule(this.callbackAttack,0.5,0,0);
            }else{
                this.body.linearVelocity=cc.v2(0,this.speedy);
            }
        }
        if(this.stab){
            this.stab.x=0;
            this.stab.y=0;
        }
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collFloorDir[self._id]){
            MainLead.body.linearVelocity=cc.v2(sp.x,this.body.linearVelocity.y);
        }
    },
    onPreSolve:function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
    },
});
