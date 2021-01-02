cc.Class({
    extends: cc.Component,

    properties: {
		len:cc.v2(0,0),
		tarPos:cc.v2(0,0),
		isStop:false,
		motionCnt:0,
		jumpCnt:0,
    },

    // use this for initialization
    onLoad: function () {//3种样式，5种类型
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
        this.player = this.node.getComponent(cc.Animation);
		var mk=this.ep.mkScript;
        this.ep.specialEffect="null";
		this.len=mk.noteSpeed;
		this.len.x*=-1;
		this.unitTime=ENDATA[this.ep.category]["unitTime"][this.ep.kind-1];
		this.tarPos=cc.v2(this.node.x,this.node.y);
		this.beginPos=cc.v2(this.node.x,this.node.y);
		this.jumpDis=this.len.mag();
		
		this.state="stop"
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		this.stopGap=0.2;
    },

    update: function (dt) {
		this.ep.visDie();
		if(this.isStop==false&&Math.abs(this.node.x-this.tarPos.x)<ALL.inf&&Math.abs(this.node.y-this.tarPos.y)<ALL.inf){
			this.state="stop";
			this.isStop=true;
			this.callback1 = function(){
				this.isStop=false;
				if(this.motionCnt<2){
					if(this.motionCnt==0){
						this.len.x*=-1;
					}
					this.time=this.jumpDis/this.unitTime;
					//cc.log( dis*2,this.time);
					this.tarPos=cc.v2(this.node.x+this.len.x,this.node.y+this.len.y);
					this.state="jump";
					this.node.runAction(cc.moveTo(this.time, this.tarPos));
					this.motionCnt++;
				}else{
					this.jumpCnt++;
					this.time=Math.abs(this.beginPos.y-this.node.y)/(this.unitTime/3);
					//cc.log( dis*2,this.time);
					this.tarPos=cc.v2(this.node.x,this.beginPos.y);
					this.state="drop";
					this.node.runAction(cc.moveTo(this.time, this.tarPos));
					this.motionCnt=0;
				}
				this.unschedule(this.callback1);
			}
			this.schedule(this.callback1,this.stopGap,0,0);
		}
		this.changeAction();
    },

	
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1){
			
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			
        }else if(other.node.name.indexOf("Object")!=-1){
			
        }	
		
		
    },
	//以下是其他函数
    changeAction:function(){
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },
});
