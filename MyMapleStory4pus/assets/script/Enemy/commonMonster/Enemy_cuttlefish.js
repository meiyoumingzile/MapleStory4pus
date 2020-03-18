cc.Class({
    extends: cc.Component,

    properties: {
		jumpSpeed:cc.v2(0,0),
		canJump:false,
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
		this.jumpSpeed=mk.noteSpeed;
		this.stopGap=ENDATA[this.ep.category]["stopGap"][this.ep.kind-1];
		this.body.gravityScale=0;
		
		this.state="stop";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		this.callbackJump = function(){
			this.body.gravityScale=ENDATA[this.ep.category]["g"];
			this.state="jump";
			this.canJump=true;
			this.body.linearVelocity=cc.v2(this.jumpSpeed.x,this.jumpSpeed.y);
			this.unschedule(this.callbackJump);
		}
		this.schedule(this.callbackJump,this.stopGap,0,0);
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		
		if(this.canJump&&speed.y<10){
			speed=cc.v2(this.jumpSpeed.x,this.jumpSpeed.y);
		}
		
		this.changeAction(speed);
		this.body.linearVelocity=speed;
    },
	//以下是其他函数
    changeAction:function(speed){
		this.state=speed.y>50?"jump":"stop";
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },
});
