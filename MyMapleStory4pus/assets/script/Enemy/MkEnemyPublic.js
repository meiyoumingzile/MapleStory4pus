cc.Class({
    extends: cc.Component,

    properties: {
		category:"",
		kind:1,//通过在面板上设置
		life:0,
		rot:0,
		canAttack:true,//是否可以攻击，看具体场景，不一定有效
		noteSpeed:cc.v2(0,0),//注释速度，看具体场景，不一定有效
		otherData:"",//其他数据
		maxCnt:1,
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
        if(this.visCanvas()==true&&!this.isLoad){//判断是否在屏幕中
            this.isLoad=true;
			//cc.log(ALL.FAB["Enemy_"+this.category]);
			var str=ENDATA.IND[this.category]?ENDATA.IND[this.category]:this.category;
			if(ALL.FAB["Enemy_"+str]&&this.__cnt<this.maxCnt){
				var newpre=cc.instantiate(ALL.FAB["Enemy_"+str]);
				newpre.setPosition(this.mainPos.x,this.mainPos.y);
				if(newpre.getComponent("EnemyPublic"))
					newpre.getComponent("EnemyPublic").mkScript=this;
				ALL.MainCanvas.addChild(newpre);
				this.__cnt++;
			}else{
				cc.log("加载怪物失败");
				return ;
			}
        }
    },

    visCanvas:function(){
        if((Math.abs(ALL.Lead.x-this.mainPos.x)<ALL.enemyUpdateSize.x&&Math.abs(ALL.Lead.y-this.mainPos.y)<ALL.enemyUpdateSize.y)){
            return true;
        }else{
			this.isLoad=false;
            return false;
        }
    },

});
