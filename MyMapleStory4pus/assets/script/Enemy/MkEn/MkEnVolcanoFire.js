cc.Class({
    extends: cc.Component,

    properties: {
		cnt:4,
		speedH:0,
		attackTime:3,
    },

    onLoad: function () {
		this.mainPos=cc.v2(0,0);
        for(var i=this.node;i.name!="MainCanvas";i=i.parent){//在主场景的位置
            this.mainPos.x+=i.x;
            this.mainPos.y+=i.y;
		}
		this.canLoad=true;
		this.nowCnt=0;
    },

    update: function (dt) {
		if(this.visCanvas()==true&&this.canLoad){//判断是否在屏幕中,并且可以加载
			this.canLoad=false;
			var newDropOb=cc.instantiate(ALL.RES.FAB["Enemy_dropOb"]);
			newDropOb.getComponent("Enemy_dropOb").init(7,cc.v2((this.nowCnt*2+1-this.cnt)*140,this.speedH),cc.v2(1,1));
			newDropOb.setPosition(this.mainPos.x,this.mainPos.y);
			newDropOb.getComponent(cc.RigidBody).gravityScale=2;
			ALL.MainCanvas.addChild(newDropOb);
			this.scheduleFun = function(){
				this.canLoad=true;
				this.unschedule(this.scheduleFun);
			}
			this.schedule(this.scheduleFun,this.nowCnt==this.cnt-1?this.attackTime:0.1,0,0);
			this.nowCnt=(this.nowCnt+1)%this.cnt;
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
