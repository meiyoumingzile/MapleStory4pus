cc.Class({
    extends: cc.Component,

    properties: {
        list:[cc.SpriteFrame],
        time:0,//毫秒
    },

    
    onLoad: function () {
        this.init();
        
    },

    
    update: function (dt) {
        var is=this.visCanvas();
        if(is&&!this.isLoading){
           
            this.isLoading=true;
            var count=0;
            var d=6;
            this.scheduleFun= function(){
				if(count%d==0){
                    if(this.chNode_i<this.chNode.length){//最后当this.chNode_i==this.chNode.length时特判
                        this.chNode[this.chNode_i].opacity=100;
                        this.chNode[this.chNode_i].active=true;
                    }
                    this.chNode_i++;
				}else if(count%d==1){
                    if(this.chNode_i>1&&this.chNode_i<=this.chNode.length+1){
                        this.chNode[this.chNode_i-2].active=false;
                    }
                }
				if(count==this.chNode.length*d+1){
                    this.isLoading=false;
                    this.chNode_i=0;
					this.unschedule(this.scheduleFun);
				}
				count++;
			}
			this.schedule(this.scheduleFun,0.5,1000,0);
        }else if(this.isLoading&&this.chNode_i>0&&this.chNode_i<=this.chNode.length&&this.chNode[this.chNode_i-1].opacity<255){
            this.chNode[this.chNode_i-1].opacity=Math.min(this.chNode[this.chNode_i-1].opacity+30,255);
            
           // cc.log(this.chNode[this.chNode_i].opacity);
        }

    },

    init(){
        this.isLoading=false;
        this.chNode_i=0;
        this.chNode=this.node.getChildren();
        for(var i=0;i<this.chNode.length;i++){
            this.chNode[i].active=false;
        }
    },
    visCanvas:function(){
        if(Math.abs(ALL.Lead.x-this.node.x)<this.node.width/2&&Math.abs(ALL.Lead.y-this.node.y)<this.node.height/2){
            return true;
        }else{
            return false;
        }
    },
});
