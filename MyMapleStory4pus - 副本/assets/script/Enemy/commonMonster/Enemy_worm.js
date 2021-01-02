cc.Class({
    extends: cc.Component,

    properties: {
		acc:cc.v2(1,0),
		jumpSpeed:cc.v2(200,250),//跳跃速度
        canJump:true,
		canAttack:true,
		onFloorCnt:0,
		armKind:1,
		fp:1,
    },

    // use this for initialization
    onLoad: function () {//3种样式，5种类型
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
        this.player = this.node.getComponent(cc.Animation);
		if(this.ep.mkScript){
			this.canJump=(this.ep.mkScript.noteSpeed.y!=0);
			this.canAttack=this.ep.mkScript.canAttack;
		}
		//this.attackGap=160;//停止时间
		//this.attackPlayerTime=40;//攻击动作的时间
		
		this.jumpSpeed=ENDATA[this.ep.category]["jumpSpeed"][this.ep.kind-1];
		this.armKind=ENDATA[this.ep.category]["armKind"][this.ep.kind-1];
		this.stopGap=ENDATA[this.ep.category]["stopGap"][this.ep.kind-1];
		this.attackGap=ENDATA[this.ep.category]["attackGap"][this.ep.kind-1];
		
		this.fp=(this.node.x>ALL.Lead.x?-1:1);
        this.node.scaleX*=this.fp;
		this.state="stop";
		//this.__attackTime=0;
        this.playState="Enemy_worm"+this.ep.kind+"_"+this.state;
        this.lastPlayState=this.playState;
        this.player.play(this.playState);
		this.__count=0;
		if(this.canAttack==true)
			this.attack();
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
        this.changeAction(speed);
		if(Math.abs(speed.x)>=this.acc.x)
			speed.x+=(speed.x>0?-this.acc.x:this.acc.x);
		this.body.linearVelocity=speed;
    },


	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1&&this.ep.isOnFloor(contact)){
			this.onFloorCnt++;
			this.__count=1;
			this.stopFloor();
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
		if(other.node.name.indexOf("Object")!=-1&&this.ep.isOnFloor(contact)){
			this.onFloorCnt--;
        }
    },

    
	
	//以下是其他函数
    changeAction:function(speed){
        this.playState="Enemy_worm"+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },

    attack:function(){
		this.__count = 1;
		var m=this.attackGap*10;
		var n=this.stopGap*10;
		this.callbackAttack = function () {
			if(this.__count<=n||this.canJump==false){
				if(this.__count%m== 0) {
					this.state="attack";
					ALL.MainCanSc.addEbulletA(this.armKind,this.node.x,this.node.y+15,cc.v2(this.fp,0));   
				}else if(this.__count% m== 5){
					this.state="stop";
				}
				this.__count++;
			}
		}
		this.schedule(this.callbackAttack,0.1,ALL.INF,0);
    },


    stopFloor:function(){
        this.state="stop";
		this.body.linearVelocity=cc.v2(0,this.body.linearVelocity.y);
		this.fp=this.node.x>ALL.Lead.x?-1:1;
		this.ep.setScaleX(this.fp);
		if(this.canJump){
			var cnt=0;
			var n=this.stopGap*10;
			this.callback_stop= function(){
				if(cnt==n){
					this.body.linearVelocity =cc.v2(this.jumpSpeed.x*this.fp,this.jumpSpeed.y);
					this.state="jump";
					this.unschedule(this.callback_stop);
				}
				cnt++;
			}
			this.schedule(this.callback_stop,0.1,n,0);
		}
		
    },
});
