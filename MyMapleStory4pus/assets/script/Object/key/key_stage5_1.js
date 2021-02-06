cc.Class({
    extends: cc.Component,

    properties: {
        pic:cc.SpriteFrame,
        tarNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sp=this.node.getComponent(cc.Sprite);
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Arm_boomerang"&&other.node.group=="Arm"&&this.sp.spriteFrame!=this.pic){
            this.sp.spriteFrame=this.pic;
            try {
                this.tarNode.runAction(cc.moveTo(3,cc.v2(this.tarNode.x,this.tarNode.y+this.tarNode.height+10)));
            } catch (error) {
                cc.log(error);
            }
        }
		
    },
});
