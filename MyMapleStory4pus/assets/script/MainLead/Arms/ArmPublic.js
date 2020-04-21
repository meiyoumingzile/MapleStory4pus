

cc.Class({
    extends: cc.Component,

    properties: {
        category:"",
        damage:1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.die=this.die;
        this.node.ap=this;
    },

    die(){
		if(this.node){//调用节点上的方法
            this.node.destroy();
            MainLead.data.nowArmsCnt[this.category]--;//this.category和this.node.category都有
            delete MainLead.data.armColl[this.category];
		}else if(this.destroy){
            this.destroy();
            MainLead.data.nowArmsCnt[this.ap.category]--;//this.category和this.node.category都有
            delete MainLead.data.armColl[this.ap.category];
        }
	},
});
