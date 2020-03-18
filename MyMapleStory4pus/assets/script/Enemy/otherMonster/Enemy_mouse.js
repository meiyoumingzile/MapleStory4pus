cc.Class({
    extends: cc.Component,

    properties: {
		fp:1,
		brginSpeed:cc.v2(0,0),
    },

    // use this for initialization
    onLoad: function () {
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
   
		var mk=this.ep.mkScript;
		this.fp=(this.node.x>ALL.Lead.x?-1:1);
        this.node.scaleX*=this.fp;
		this.beginSpeed=mk.canAttack?mk.noteSpeed:ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.state="jump";
		this.body.gravityScale=0;
		this.__jump=true;
		if(this.ep.category=="sealion"){
			this.phyColl.offset.y=-20;
			this.phyColl.apply();
		}
		
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
    },

    update: function (dt) {
		this.ep.visDie();
		if(this.__jump&&Math.abs(this.node.x-ALL.Lead.x)<cc.winSize.width/2){
			this.__jump=false;
			this.body.gravityScale=2;
			this.body.linearVelocity=cc.v2(this.ep.kind==1?this.beginSpeed.x*this.fp:0,this.beginSpeed.y);
		}
		this.changeAction();
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
			if(f.y==-1&&this.state=="jump"){
				this.body.linearVelocity=cc.v2(this.beginSpeed.x*2*this.fp,0);
				this.toWalk();
			}
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },

	changeAction:function(){
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },

	toWalk(){//walkPhySize
		this.state="walk";
		this.phyColl.size.width=ENDATA[this.ep.category]["walkPhySize"][this.ep.kind-1].x;
		this.phyColl.size.height=ENDATA[this.ep.category]["walkPhySize"][this.ep.kind-1].y;
		this.phyColl.apply();
	},
	toJump(){
		this.state="jump";
		this.phyColl.size.width=ENDATA[this.ep.category]["phySize"][this.ep.kind-1].x;
		this.phyColl.size.height=ENDATA[this.ep.category]["phySize"][this.ep.kind-1].y;
		this.phyColl.apply();
	},
});
