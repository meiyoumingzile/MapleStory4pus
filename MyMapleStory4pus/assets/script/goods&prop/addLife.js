cc.Class({
    extends: cc.Component,

    properties: {
        chLifeUp:0, //加的上限
        chLife:0,//加的上限
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    update (dt) {
	},
	onCollisionEnter: function (other, self){
		var sp=this.node.getComponent(cc.Sprite);
		
		if(other.node.name=="Lead"){
            if(this.chLifeUp>0&&this.chLifeUp<1){//this.chLifeUp==0.5
                if(MainLead.halfHeart){
                    
                }
                MainLead.halfHeart=!MainLead.halfHeart;
                this.chLifeUp=0;
            }
			MainLead.changeLife(parseInt(this.chLife),parseInt(this.chLifeUp));
		}
	},
});
