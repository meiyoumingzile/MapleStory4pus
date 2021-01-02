cc.Class({
    extends: cc.Component,

    properties: {
		fp:1,
		jumpSpeed:cc.v2(0,0),
		beginSpeed:cc.v2(0,0),
		onFloorCnt:0,//同时碰到的物体数量
		jumpGap:2,
		isJump:false,
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
		this.fp=(this.node.x>ALL.Lead.x?-1:1);
        this.node.scaleX*=this.fp;
		this.beginSpeed=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,0);
		this.jumpSpeed=ENDATA[this.ep.category]["jumpSpeed"][this.ep.kind-1];
	
		this.state="walk";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		
		if(this.onFloorCnt>0&&speed.x!=this.beginSpeed.x)
			speed.x=this.beginSpeed.x*this.fp;
		if(this.isJump){
			this.isJump=false;
			speed.x=this.jumpSpeed.x*this.fp;
			speed.y=this.jumpSpeed.y;
		}
		this.changeAction(speed);
		this.body.linearVelocity=speed;
    },


	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1){
			var points =  contact.getWorldManifold().points;
			var f=this.ep.getFpWithObject(contact, self, other);
			if(this.fp==f.x&&(points.length>1||points[0].y+this.phyColl.size.height/2>this.node.y)){//碰撞点多余一个或者碰到了非
				this.fp=-this.fp;
				this.node.scaleX=-this.node.scaleX;
			}
			if(f.y<0){
				this.state="walk";
				this.onFloorCnt++;
				
				this.callbackJump = function(){
					this.isJump=true;
					this.unschedule(this.callbackJump);
				}
				this.schedule(this.callbackJump,this.jumpGap,1,0);
			}
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			
        }else if(other.node.name.indexOf("Object")!=-1){
			var points =  contact.getWorldManifold().points;
			var f=this.ep.getFpWithObject(contact, self, other);
			if(f.y==-1&&this.onFloorCnt>0){
				if(this.onFloorCnt--==1){
					this.state="jump";
				}
			}
        }	
		
		
    },
	//以下是其他函数
    changeAction:function(speed){
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },
});
