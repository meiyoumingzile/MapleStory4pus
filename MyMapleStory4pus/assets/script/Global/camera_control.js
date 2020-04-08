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
        this.node.position =ALL.Lead.position;
        var winSize=ALL.MainCanSc.getWindows();
        this.fixSz=cc.v2(winSize.x/16,winSize.y/16);
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
		let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
    
        var dx=this.node.position.x-ALL.Lead.x;
        var dy=this.node.position.y-ALL.Lead.y;
        var nx=this.node.position.x;
        var ny=this.node.position.y;
        if(Math.abs(dx)>this.fixSz.x&&Math.abs(targetPos.x-this.canvas.x)<this.canvas.width/2){
            nx=ALL.Lead.x+Math.sign(dx)*this.fixSz.x;
        }
        if(Math.abs(dy)> this.fixSz.y&&Math.abs(targetPos.y-this.canvas.y)<this.canvas.height/2){
            ny=ALL.Lead.y+Math.sign(dy)*this.fixSz.y;
        }
        this.node.position =cc.v2(nx,ny);
    },

});