cc.Class({
    extends: cc.Component,

    properties: {
        chLife:0, //加血
        chLifeUp:0, //加血上限
    },

    
    onLoad: function () {
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name=="Lead"&&other.tag==0){
            if(this.chLife>0){
                MainLead.changeLife(this.chLife,0);
            }else if(this.chLifeUp>0&&this.chLifeUp<1){
                MainLead.setHalfHeart(true);
            }else if(this.chLifeUp>0){
                MainLead.changeLife(0,this.chLifeUp);
            }
            this.node.destroy();
        }
    },
});
