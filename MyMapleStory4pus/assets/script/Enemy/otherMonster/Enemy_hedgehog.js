cc.Class({
    extends: cc.Component,

    properties: {
		rangeX:[],
		fp:1,
		tremble:false,
    },

    // use this for initialization
    onLoad: function () {
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsPolygonCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");

		var points=ENDATA[this.ep.category]["phySize"];
		this.phyColl.points=points;
		this.phyColl.apply();
		var mk=this.ep.mkScript;
		var d=Math.max(mk.node.width,100)/2;
		this.rangeX=[mk.node.x-d,mk.node.x+d];
		this.stopGap=ENDATA[this.ep.category]["stopGap"][this.ep.kind-1];
		this.fp=(this.node.x>ALL.Lead.x?-1:1);
        this.node.scaleX*=this.fp;
		
		this.beginSpeed=mk.canAttack?mk.noteSpeed:ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,this.beginSpeed.y);
	
		this.state="walk";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		this.trembleTime=-1;
		
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		if(speed.x!=0&&(this.rangeX[0]>this.node.x||this.rangeX[1]<this.node.x)){
			this.node.x=speed.x>0?this.rangeX[1]-0.01:this.rangeX[0]+0.01;
			this.fp=-this.fp;
			this.node.scaleX=-this.node.scaleX;
			speed=cc.v2(-this.body.linearVelocity.x,0);
		}
		if(this.tremble){
			this.node.x+=5*this.trembleTime;
			this.trembleTime=-this.trembleTime;
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
				this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,0);
			}
        }else if(other.node.name.indexOf("Arm_")!=-1&&this.state=="walk"){//碰到了人物武器,在人物武器类里实现
			this.body.linearVelocity=cc.v2(0,0);
			this.ep.changeLife1(-1);

			if(this.ep.category=="landConch"&&this.node.name.indexOf("specialStone")==-1){
				ENDATA[this.ep.category]["damArm"]=ENDATA["specialStone"]["damArm"];
				this.ep.damage=0;
				this.node.name=this.node.name.replace("Enemy","Enemy_specialStone");
			}else{
				this.ep.specialEffect="invincible";
			}
			
			var cnt=0;
			var n=this.stopGap*10;
			this.state="stop";
			this.callbackStop = function(){
				if(cnt==n){
					this.tremble=true;
				}else if(cnt==n+10){
					if(this.ep.category=="landConch"&&this.node.name.indexOf("specialStone")!=-1){
						delete ENDATA[this.ep.category].damArm;
						this.ep.damage=1;
						this.node.name=this.node.name.replace("Enemy_specialStone","Enemy");
					}
					//cc.log(this.node.name);
					this.tremble=false;
					this.state="walk";
					this.ep.specialEffect="null";
					this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,0);
					this.unschedule(this.callbackStop);
					
				}
				cnt++;
			}
			this.schedule(this.callbackStop,0.1,n+10,0);
			
		}
    },
    
	changeAction:function(speed){
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },

});
