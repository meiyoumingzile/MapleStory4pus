cc.Class({
    extends: cc.Component,

    properties: { 
		collObiect:false,
	},
	onLoad: function () {
	},

	onCollisionEnter: function (other, self){
		if(other.node.name.indexOf("Object")!=-1){
			this.collObiect=true;
		}
	},
	onCollisionStay: function (other,self){
		
	},
	onCollisionExit: function (other, self){
		if(other.node.name.indexOf("Object")!=-1){
			this.collObiect=false;
		}
	},
	update :function(dt){
    },
});
