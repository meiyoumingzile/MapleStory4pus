cc.Class({
    extends: cc.Component,

    properties: {
		fp:1,
		jumpSpeed:cc.v2(0,0),
		beginPos:cc.v2(0,0),
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
		
		this.jumpSpeed=mk.noteSpeed.y>0?mk.noteSpeed:ENDATA[this.ep.category]["jumpSpeed"][this.ep.kind-1];
		this.body.linearVelocity=cc.v2(this.jumpSpeed.x*this.fp,this.jumpSpeed.y);
		this.beginPos=cc.v2(this.node.x,this.node.y);
		
		this.state="jump";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		if(speed.y<0){
			this.state="drop";
			if(Math.abs(this.beginPos.y-this.node.y)<1&&speed.y<0){
				speed=cc.v2(this.jumpSpeed.x*this.fp,this.jumpSpeed.y);
			}
		}else{
			this.state="jump";
		}
		this.changeAction(speed);
		this.body.linearVelocity=speed;
    },


	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1){
			
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			
        }else if(other.node.name.indexOf("Object")!=-1){
			
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
