cc.Class({
    extends: cc.Component,

    properties: {
		tarPrefab:cc.Prefab,
		tarNode:null,
    },

    onLoad: function () {
        this.mainPos=cc.v2(0,0);
        this.isLoad=false;
        for(var i=this.node;i.name!="MainCanvas";i=i.parent){//在主场景的位置
            this.mainPos.x+=i.x;
            this.mainPos.y+=i.y;
        }
		this.__cnt=0;
    },

    update: function (dt) {
        this.updateOb();
        if(this.visCanvas()==true&&!this.isLoad&&this.tarNode==null&&(MainLead.coll.liftingOb[0]==null||MainLead.coll.liftingOb[0]!=this.tarNode)){//判断是否在屏幕中
            this.isLoad=true;
            if(this.tarPrefab){
				var newpre=cc.instantiate(this.tarPrefab);
                this.tarNode=newpre;
				newpre.setPosition(this.mainPos.x,this.mainPos.y);
                ALL.MainCanvas.addChild(newpre);
                newpre.mkSc=this;
			}else{
				cc.log("加载物体失败");
				return ;
			}
        }
    },

    visCanvas:function(){
        if((Math.abs(ALL.Lead.x-this.mainPos.x)<ALL.obUpdateSize.x&&Math.abs(ALL.Lead.y-this.mainPos.y)<ALL.obUpdateSize.y)){
            return true;
        }else{
            this.isLoad=false;
            return false;
        }
    },
    
    updateOb:function(){
        if(this.tarNode&&this.tarNode.die&&Math.abs(ALL.Lead.y-this.tarNode.y)>ALL.obUpdateSize.y){
            this.tarNode.die();
        }
    },
});
