cc.Class({
    extends: cc.Component,

    properties: {
        list:[cc.SpriteFrame],
        stateLife:[cc.Integer],
        category:"",
    },

    
    onLoad: function () {
        this.node.category=this.category;
        this.body = this.node.getComponent(cc.RigidBody);
        this.winSz=ALL.MainCanSc.getWindows();
        for(var i=0;i<=this.list.length;i++){
            if(!this.stateLife[i]){
                this.stateLife[i]=1;
            }
        }
        this.listi=0;
        this.collArm={};
    },

    
    update: function (dt) {
       
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var attackerList=OBDATA.damInd[this.node.category];
		if(attackerList&&!this.collArm[other._id]&&attackerList.indexOf(other.node.name)>=0){
            this.collArm[other._id]=other;
            var ap= other.node.getComponent("ArmPublic");
            if(ap&&this.changeLife(ap.damage)){
                var sp=this.node.getComponent(cc.Sprite);
                sp.spriteFrame= this.list[this.listi-1];
            }
        }
		
    },
    
    onPreSolve:function (contact, self, other) {//  每次处理碰撞体接触逻辑时每一帧都调用
        var attackerList=OBDATA.damInd[this.node.category];
		if(attackerList&&!this.collArm[other._id]&&attackerList.indexOf(other.node.name)>=0){
            this.collArm[other._id]=other;
            var ap= other.node.getComponent("ArmPublic");
            if(ap&&this.changeLife(ap.damage)){
                var sp=this.node.getComponent(cc.Sprite);
                sp.spriteFrame= this.list[this.listi-1];
            }
        }
    },
    changeLife(cnt){//返回是否改变图片
        this.stateLife[this.listi]-=cnt;
        if(this.stateLife[this.listi]<1){
            this.listi++;
            if(this.listi>this.list.length){
                ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
                this.node.destroy();
                return false;
            }
            return true;
        }
        return false;
    },
});
