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
        this.winSize=ALL.MainCanSc.getWindows();
        this.fixSz=cc.v2(this.winSize.x/16,this.winSize.y/16);
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
		var LeadPos=ALL.Lead.position;
        var dx=this.node.position.x-LeadPos.x;
        var dy=this.node.position.y-LeadPos.y;
        var nx=this.node.position.x;
        var ny=this.node.position.y;
        if(Math.abs(dx)>this.fixSz.x&&Math.abs(LeadPos.x)<(this.canvas.width+this.fixSz.x*2-this.winSize.x)/2){
            nx=LeadPos.x+Math.sign(dx)*this.fixSz.x;
        }
        if(Math.abs(dy)> this.fixSz.y&&Math.abs(LeadPos.y)<(this.canvas.height+this.fixSz.y*2-this.winSize.y)/2){
            ny=LeadPos.y+Math.sign(dy)*this.fixSz.y;
        }
        this.node.position =cc.v2(nx,ny);
    },

});