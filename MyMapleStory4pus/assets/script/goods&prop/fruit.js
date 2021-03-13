cc.Class({
    extends: cc.Component,

    properties: {
        kind:0,//从1开始
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		
		this.isLoad=false;
	},

    update (dt) {
		if(ALL.RES.GamePropFrame["fruit1"]&&!this.isLoad){
			this.isLoad=true;
			if(this.kind<=0){
				this.kind=ALL.MainCanSc.randomNum(1,9);
			}
			var sp=this.node.getComponent(cc.Sprite);
			sp.spriteFrame= ALL. RES.GamePropFrame["fruit"+this.kind];
		}
	},
	onCollisionEnter: function (other, self){
		var sp=this.node.getComponent(cc.Sprite);
		if(other.node.name=="Lead"&&other.tag==0&&sp.spriteFrame!=null){
			sp.spriteFrame=null;
			MainLead.changeTime(this.kind>=7?2:1);
			ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"note");
			this.node.destroy();
		}
	},
});
