cc.Class({
    extends: cc.Component,

    properties: {
        potId:0,
    },

    
    onLoad: function () {
        var have=MainLead.data.potBit[this.potId];
        if(have&&have==true){
            this.node.destroy();
        }
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name=="Lead"&&other.tag==0){
            MainLead.getGoods(this.node.name,this.potId);
            this.node.destroy();
        }
    },
});
