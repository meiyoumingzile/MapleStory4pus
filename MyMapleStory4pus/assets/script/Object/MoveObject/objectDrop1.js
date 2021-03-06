cc.Class({
    extends: cc.Component,

    properties: {
        speed:cc.v2(0,0),//初速度
        time:0,//毫秒
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.body.gravityScale=0;
        this.winSz=ALL.MainCanSc.getWindows();
        this.isCollLead=false;
    },

    
    update: function (dt) {
        if(this.isCollLead&&(Math.abs(MainLead.node.position.x-this.node.position.x)>this.winSz.x*2||Math.abs(MainLead.node.position.y-this.node.position.y)>this.winSz.y*2)){
            this.die();
        }
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
        var sc=Math.abs(MainLead.data.preScaleX-MainLead.node.scaleX);//特判人物转身的碰撞体改变
		if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collFloorDir[self._id]&&sc==0){
            var fun = function(){
                this.drop();
			}
            this.schedule(fun,this.time,0,0);
        }
		
    },
    onPreSolve:function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
    },
    drop:function(){
        this.isCollLead=true;
        this.body.linearVelocity=this.speed;
        this.body.gravityScale=1;
    },
    die:function(){
        this.node.destroy();
    },
});
