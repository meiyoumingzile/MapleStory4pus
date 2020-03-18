cc.Class({
    extends: cc.Component,

    properties: {
		tarPos:cc.v2(0,0),
    },

    // use this for initialization
    onLoad: function () {//3种样式，5种类型
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
        this.player = this.node.getComponent(cc.Animation);
		this.beginSpeed=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.ffp=cc.v2(this.node.x>ALL.Lead.x?-1:1,0);
        this.node.scaleX*=this.ffp.x;
		this.body.linearVelocity=cc.v2(ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1].x*this.ffp.x,0);
        this.playState="Enemy_"+this.ep.category+this.ep.kind;
        this.lastPlayState=this.playState;
        this.player.play(this.playState);
    },

    update: function (dt) {
		this.ep.visDie();
		if(this.ep.kind==4){
			this.moveup();
		}
    },


	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		/*if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1){
			var points =  contact.getWorldManifold().points;
			var f=this.ep.getFpWithObject(contact, self, other);
			if(this.ffp.x==f.x&&(points.length>1||points[0].y+this.phyColl.size.height/2>this.node.y)){//碰撞点多余一个或者碰到了非
				this.ffp.x=-this.ffp.x;
				this.ep.setScaleX(this.ffp.x);
			}
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}*/
    },
    onEndContact: function (contact, selfCollider, otherCollider) {// 只在两个碰撞体结束接触时被调用一次
		
    },
	moveup: function(){
		var speed=this.body.linearVelocity;

		if(Math.abs(ALL.Lead.x-this.node.x)<10&&speed.y==0){
			this.ffp.y=(this.node.y>ALL.Lead.y?-1:1);
			speed.x=0;
			speed.y=this.beginSpeed.y*this.ffp.y;
			
			this.tarPos=cc.v2(this.node.x,this.node.y+100*this.ffp.y);
		}
		if(speed.y!=0&&Math.abs(this.tarPos.x-this.node.x)<ALL.inf&&Math.abs(this.tarPos.y-this.node.y)<ALL.inf){
			this.ffp=cc.v2(this.node.x>ALL.Lead.x?-1:1,0);
			this.ep.setScaleX(this.ffp.x);
			speed.x=this.beginSpeed.x*this.ffp.x;
			speed.y=0;
		}
		this.body.linearVelocity=speed;
	},
});
