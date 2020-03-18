cc.Class({
    extends: cc.Component,

    properties: { 
		collCnt:0,
	},
	onLoad: function () {
	},

	onCollisionEnter: function (other, self){
		if(other.node.name.indexOf("Object")!=-1&&(this.collCnt++==0)){
			MainLead.data.onFloor=true;
		}
	},
	onCollisionStay: function (other,self){
		
	},
	onCollisionExit: function (other, self){
		if(other.node.name.indexOf("Object")!=-1&&(this.collCnt--==1)){
			MainLead.data.onFloor=false;
		}
	},
	update :function(dt){
    },
});
