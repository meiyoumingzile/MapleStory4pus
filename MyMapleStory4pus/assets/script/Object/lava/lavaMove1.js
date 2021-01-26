cc.Class({
    extends: cc.Component,

    properties: {//岩浆向上升
    },

    
    onLoad: function () {
        if(SAVE.SaveLead_data&&SAVE.SaveLead_data.keyBit[2]){
            this.beginSport();
        }
    },
    beginSport:function(){//在自己的里调用
        var x=this.node.x;
        var y=this.node.y;
        this.node.runAction(cc.moveTo(3,cc.v2(x,y+270)));//要等待moveTo执行完毕
    },
});
