cc.Class({
    extends: cc.Component,

    properties: {
		attackTime:3,
    },

    onLoad: function () {
		this.mainPos=cc.v2(0,0);
        for(var i=this.node;i.name!="MainCanvas";i=i.parent){//在主场景的位置
            this.mainPos.x+=i.x;
            this.mainPos.y+=i.y;
		}
		this.canLoad=true;
		this.fireNode=null;
    },

    update: function (dt) {
		if(this.visCanvas()==true&&this.canLoad){//判断是否在屏幕中,并且可以加载
			this.canLoad=false;
			this.fireNode=ALL.MainCanSc.addEbulletA(5,this.mainPos.x+(this.node.width/2+20)*this.node.scaleX,this.mainPos.y,cc.v2(this.node.scaleX,0));
			this.scheduleFun = function(){
				this.canLoad=true;
				this.unschedule(this.scheduleFun);
			}
			this.schedule(this.scheduleFun,this.attackTime);
		}
		if(this.fireNode&&cc.v2(this.mainPos.x-this.fireNode.x,this.mainPos.y-this.fireNode.y).mag()>600){
			this.fireNode.getComponent("EnemyPublic").die();
			this.fireNode=null;
		}
    },
    visCanvas:function(){
        if((Math.abs(ALL.Lead.x-this.mainPos.x)<ALL.enemyUpdateSize.x&&Math.abs(ALL.Lead.y-this.mainPos.y)<ALL.enemyUpdateSize.y)){
            return true;
        }else{
            return false;
        }
    },
});
