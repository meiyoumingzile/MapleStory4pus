cc.Class({
 extends: cc.Component,

    properties: {
		fp:1,
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
		
		this.beginSpeed=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,this.beginSpeed.y);
		if(this.ep.category=="specialStone"){
			this.playState="Enemy_specialStone"+this.ep.kind;
			this.ep.damage=0;
			this.node.removeComponent(cc.PhysicsBoxCollider);//移除矩形碰撞；
		}else{
			this.playState="Enemy_"+this.ep.category+this.ep.kind;
			this.node.removeComponent(cc.PhysicsPolygonCollider);//移除多边形碰撞；
		}
		
		this.node.name=this.playState;//改变名称
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
    },
	start: function(){
		if(this.ep.category=="rock"){//在onLoad里无法修改name
			this.node.name="Enemy_specialStone_"+this.ep.category+this.ep.kind;
		}
	},
    update: function (dt) {
		this.ep.visDie();
    },
	
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1){
			var points =  contact.getWorldManifold().points;
			var f=this.ep.getFpWithObject(contact, self, other);
			
			if(this.fp==f.x&&points.length>0&&(points.length>1||points[0].y>this.node.y)){//碰撞点多余一个或者碰到了非
				this.fp=-this.fp;
				this.node.scaleX=-this.node.scaleX;
				this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,this.beginSpeed.y);
			}
			if(f.y==-1){
				this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,this.beginSpeed.y);
			}
        }else if(other.node.name.indexOf("Arm_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
	
});
