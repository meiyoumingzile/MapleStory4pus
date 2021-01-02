cc.Class({
    extends: cc.Component,

    properties: {
		rangeX:[],
		rangeY:[],
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
		if(this.ep.mkScript){
			this.rangeX=[mk.node.x-mk.node.width/2,mk.node.x+mk.node.width/2];
			this.rangeY=[mk.node.y-mk.node.height/2,mk.node.y+mk.node.height/2];
		}
		
		this.__speed=cc.v2(0,0);
        this.node.scaleX*=(this.node.x>ALL.Lead.x?-1:1);
		var d=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1].x;
		this.body.linearVelocity.x=d*Math.cos(this.node.angle/180*Math.PI)*(this.node.x>ALL.Lead.x?-1:1);//[-90,90]
		this.body.linearVelocity.y=d*Math.sin(this.node.angle/180*Math.PI)*(this.node.x>ALL.Lead.x?-1:1);
		if(this.node.angle==180){
			this.node.scaleX=-this.node.scaleX;
			this.body.linearVelocity.x=-this.body.linearVelocity.x;
		}
		
		this.playState="Enemy_"+this.ep.category+this.ep.kind;
		
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		var a=false;
		if(speed.x!=0&&(this.rangeX[0]>this.node.x||this.rangeX[1]<this.node.x)){
			this.node.x=speed.x>0?this.rangeX[1]-0.01:this.rangeX[0]+0.01;
			a=true;
		}
		if(speed.y!=0&&(this.rangeY[0]>this.node.y||this.rangeY[1]<this.node.y)){
			this.node.Y=speed.y>0?this.rangeY[1]-0.01:this.rangeY[0]+0.01;
			a=true;
		}
		if(a){
			this.node.scaleX=-this.node.scaleX;
			this.__speed.x=speed.x;
			this.__speed.y=speed.y;
			this.body.linearVelocity=cc.v2(0,0);
			
			
			this.callbackAttack = function(){
				this.body.linearVelocity=cc.v2(-this.__speed.x,-this.__speed.y);
			}
			this.schedule(this.callbackAttack,0.5,1,0);
		}
    },


	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次

		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }else if(other.node.name.indexOf("Object")!=-1&&this.ep.isOnFloor(contact)){
			
			//this.stopFloor();
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    onEndContact: function (contact, selfCollider, otherCollider) {// 只在两个碰撞体结束接触时被调用一次
		
    },
});
