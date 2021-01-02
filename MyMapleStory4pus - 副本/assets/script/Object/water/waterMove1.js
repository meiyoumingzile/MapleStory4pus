cc.Class({
    extends: cc.Component,

    properties: {
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.node.beginSport=this.beginSport;
        this.node.script=this;
    },
    beginSport:function(){//在key的脚本里调用
        this.node.runAction(cc.moveTo(2,cc.v2(0,this.node.y+210)));//要等待moveTo执行完毕
    },
});
