cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);
		ALL.CamNode=this.node;
		this.canvas = this.target.parent;//得到父节点是Canvas
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
		let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
		//this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        if(Math.abs(targetPos.x-this.canvas.x)<this.canvas.width/2&&
            Math.abs(targetPos.y-this.canvas.y)<this.canvas.height/2){
			this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
		}
        //let ratio = targetPos.y / cc.winSize.height;
        //this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },

});