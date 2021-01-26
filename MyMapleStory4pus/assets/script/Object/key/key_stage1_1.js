cc.Class({
    extends: cc.Component,

    properties: {
        targetNode:[cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tarBody=[];
        for(var i=0;i<this.targetNode.length;i++){
            this.tarBody[i] = this.targetNode?this.targetNode[i].getComponent(cc.RigidBody):null;
        }
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"&&other.tag==0){
            this.touch();
            this.node.destroy();
        }
		
    },

    touch(){
        for(var i=0;i<this.tarBody.length;i++){
            var sc=this.tarBody[i].node.script;
            if(sc&&sc.beginSport){//beginSport是开始运动的函数
                sc.beginSport();
            }
        }
    },
});
