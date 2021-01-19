cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {
        this.sp=this.node.getComponent(cc.Sprite);
        this.node.script=this;
    },
   
    jumpState(){//人物脚本调用
        if(this.sp.spriteFrame!=ALL.RES.GamePropFrame["jumpAid1_0"]){
            if(this.sp.spriteFrame==ALL.RES.GamePropFrame["jumpAid2_1"]){
                this.sp.spriteFrame=ALL.RES.GamePropFrame["jumpAid2_2"];
                MainLead.data.jumpAidTime=20;
            }else if(this.sp.spriteFrame==ALL.RES.GamePropFrame["jumpAid2_2"]){
                this.sp.spriteFrame=ALL.RES.GamePropFrame["jumpAid2_1"];
            }
        }
    },
});
