cc.Class({//被喷火龙攻击显示
    extends: cc.Component,

    properties: {//
        doorPic:cc.Node,
        acceptArm:[cc.String],//被哪些子弹攻击会显形状
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.isInDoor=false;
        this.doorPic.active=false;
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(this.acceptArm.indexOf(other.node.name)!=-1&&this.doorPic&&this.node.isInDoor==false){
            this.doorPic.active=true;
            this.node.isInDoor=true;
            ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
            if(other.node.die){
                other.node.die();
            }
        }
    },
});
