cc.Class({
    extends: cc.Component,

    properties: {
        targetNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.body=this.node.getComponent(cc.RigidBody);
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"&&other.tag==0){
            contact.disabled=true;
            if(this.targetNode){
                this.targetNode.active=!this.targetNode.active;
            }else{
                cc.log("目标节点丢失");
            }
            this.node.destroy();
        }else if(other.node.name.indexOf("Object")!=-1){
            this.body.gravityScale=0;
            this.body.linearVelocity=cc.v2(0,0);
        }
		
    },
});
