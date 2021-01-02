cc.Class({
    extends: cc.Component,

    properties: {
		fp:1,
		jumpSpeed:cc.v2(0,0),
		onFloorCnt:0,//同时碰到的物体数量
		isJump:false,
    },

    // use this for initialization
    onLoad: function () {
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
		this.jumpSpeed=ENDATA[this.ep.category]["jumpSpeed"][this.ep.kind-1];
		this.stopGap=ENDATA[this.ep.category]["stopGap"][this.ep.kind-1];
		this.body.gravityScale=ENDATA[this.ep.category]["g"];
		
		this.state="stop";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		
		if(this.isJump){
			this.isJump=false;
			this.fp=(this.node.x>ALL.Lead.x?-1:1);
			speed=cc.v2(0,0);
			this.node.scaleX=ALL.scaleEnemy.x*this.fp;
			this.state="stop";
			
			this.callbackJump = function(){
				this.state="jump";
				
				this.body.linearVelocity=cc.v2(this.jumpSpeed.x*this.fp,this.jumpSpeed.y);
				this.unschedule(this.callbackJump);
			}
			this.schedule(this.callbackJump,this.stopGap,0,0);
		}
		this.changeAction(speed);
		this.body.linearVelocity=speed;
    },


	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1){
			if(this.ep.isOnFloor(contact)){
				this.isJump=true;
			}
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
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
