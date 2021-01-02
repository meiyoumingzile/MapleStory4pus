cc.Class({
    extends: cc.Component,

    properties: {
        kind:1,//从1开始
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.isLoad=false;
	},

    update (dt) {
		var sp=this.node.getComponent(cc.Sprite);
		if(ALL. MainCanSc.fruitFrameList.length!=0&&this.isLoad==false){
			this.isLoad=true;
			
			sp.spriteFrame= ALL. MainCanSc.fruitFrameList[this.kind-1];
		}

	},
	onCollisionEnter: function (other, self){
		var sp=this.node.getComponent(cc.Sprite);
		
		if(other.node.name=="Lead"&&other.tag==0&&sp.spriteFrame!=null){
			sp.spriteFrame=null;
			MainLead.changeTime(1);
			ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"note");
		}
	},
});
