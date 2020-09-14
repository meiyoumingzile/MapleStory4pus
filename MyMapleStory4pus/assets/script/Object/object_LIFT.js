cc.Class({
    extends: cc.Component,

    properties: {
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.G0 = this.body.gravityScale;
        this.F0 = this.body.frivtion;
        this.node.die=this.die;
    },

    
    update: function (dt) {
       
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collCeilDir[self._id]){
            this.body.gravityScale=0;
            this.body.frivtion=0;
        }
    },
    onPreSolve:function (contact, self, other) {
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collCeilDir[self._id]){
            
        }
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
		if(other.node.name=="Lead"&&other.tag==0){
            this.body.gravityScale=this.G0;
            this.body.frivtion=this.F0;
        }
    },
    die:function(){
        this.mkSc.tarNode=null;
        this.destroy();
    },
});
