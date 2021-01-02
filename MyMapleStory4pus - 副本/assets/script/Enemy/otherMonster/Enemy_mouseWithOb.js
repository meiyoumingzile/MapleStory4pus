cc.Class({
 extends: cc.Component,

    properties: {
		fp:1,
		canWalk:true,
    },

    // use this for initialization
    onLoad: function () {
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsPolygonCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");

		this.justOb(false);
		var mk=this.ep.mkScript;
		this.stopGap=ENDATA[this.ep.category]["stopGap"][this.ep.kind-1];
		this.safeDis=ENDATA[this.ep.category]["safeDis"][this.ep.kind-1];
		this.fp=(this.node.x>ALL.Lead.x?1:-1);
        this.node.scaleX*=this.fp;
		
		this.beginSpeed=mk.canAttack?mk.noteSpeed:ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		//this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,this.beginSpeed.y);
	
		this.state="stop";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		this.beginPos=cc.v2(0,0);
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		if(this.canWalk&&this.state=="stop"&&Math.abs(this.node.x-ALL.Lead.x)<this.safeDis.x&&Math.abs(this.node.y-ALL.Lead.y)<this.safeDis.y){
			this.justOb(true);
			this.state="walk";
			this.fp=(this.node.x>ALL.Lead.x?1:-1);
			this.node.scaleX=Math.abs(this.node.scaleX)*this.fp;
			speed.x=this.beginSpeed.x*this.fp;
			this.beginPos=cc.v2(this.node.x,this.node.y);
		}else if(Math.abs(speed.y)<ALL.inf&&this.state=="walk"&&Math.abs(this.beginPos.x-this.node.x)>200){
			this.justOb(false);
			this.state="stop";
			this.canWalk=false;
			speed.x=0;
			this.callbackStop = function(){
				this.canWalk=true;
				this.unschedule(this.callbackStop);
			}
			this.schedule(this.callbackStop,this.stopGap,1,0);
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
			if(this.fp==f.x&&(points.length>1||points[0].y>this.node.y)){//碰撞点多余一个或者碰到了非
				this.fp=-this.fp;
				this.node.scaleX=-this.node.scaleX;
				this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,0);
			}
        }else if(other.node.name.indexOf("Arm_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    
	changeAction:function(speed){
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },
	justOb(is=true){//is==true时出现，false时消失
		if(is){
			var points=ENDATA[this.ep.category]["phySize"];
			this.phyColl.points=points;
			this.phyColl.apply();
			this.ep.specialEffect="null";
		}else if(is==false){
			var points=ENDATA[this.ep.category]["walkPhySize"];
			this.phyColl.points=points;
			this.phyColl.apply();
			this.ep.specialEffect="invincible";
		}
	},
	
	
});
