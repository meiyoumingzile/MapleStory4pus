cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {
        this.sp=this.node.getComponent(cc.Sprite);
        this.node.script=this;
    },

   
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name=="Arm_waterGun"&&this.sp.spriteFrame==ALL.RES.GamePropFrame["jumpAid1_0"]){
            this.sp.spriteFrame=ALL.RES.GamePropFrame["jumpAid1_1"];
            other.node.die();
        }
    },
    jumpState(){//人物脚本调用
        if(this.sp.spriteFrame!=ALL.RES.GamePropFrame["jumpAid1_0"]){
            MainLead.data.jumpAidTime=5;
            this.sp.spriteFrame=ALL.RES.GamePropFrame["jumpAid1_2"];
            this.schedule1 = function(){
				this.sp.spriteFrame=ALL.RES.GamePropFrame["jumpAid1_1"];
			}
			this.schedule(this.schedule1,0.5,1,0);
        }
    },
});
