cc.Class({
    extends: cc.Component,

    properties: {//这个脚本是没关的永久改变地形的钥匙
        keyId:0,//下标从0开始
    },

    
    onLoad: function () {
        var have=SAVE.SaveLead_data&&SAVE.SaveLead_data.keyBit[this.keyId];
        if(have&&have==true){
            this.node.destroy();
        }
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name=="Lead"&&other.tag==0){
            MainLead.data.keyBit[this.keyId]=true;
            this.node.destroy();
        }
    },
});
