cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {//3种样式，5种类型
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
        this.player = this.node.getComponent(cc.Animation);
        this.ep.specialEffect="null";
		this.beginSpeed=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.fp=this.node.x>ALL.Lead.x?-1:1;
        this.node.scaleX*=this.fp;
		this.body.linearVelocity=cc.v2(ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1].x*this.fp,0);
        this.playState="Enemy_"+this.ep.category+this.ep.kind;
        this.lastPlayState=this.playState;
        this.player.play(this.playState);
		
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		speed.x=this.beginSpeed.x*this.fp;
		
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
				//this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,0);
			}
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    onEndContact: function (contact, selfCollider, otherCollider) {// 只在两个碰撞体结束接触时被调用一次
		
    },
});
