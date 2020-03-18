cc.Class({
    extends: cc.Component,

    properties: {
		rangeX:[],
		fp:1,
		newDropOb:null,
		haveOb:false,
    },

    // use this for initialization
    onLoad: function () {
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
   
		var mk=this.ep.mkScript;
		if(this.ep.mkScript){
			this.rangeX=[mk.node.x-mk.node.width/2,mk.node.x+mk.node.width/2];
		}
		this.fp=(this.node.x>ALL.Lead.x?-1:1);
        this.node.scaleX*=this.fp;
		this.beginSpeed=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,this.beginSpeed.y);
	
		this.state="walk";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		
		this.makeOb();
		var cnt=0;
		var t1=ENDATA[this.ep.category]["stopGap"][this.ep.kind-1]*10;
		var t2=ENDATA[this.ep.category]["attackTime"][this.ep.kind-1]*10;
		
		this.callbackAttack = function(){
			if(cnt==t1){
				this.fp=(this.node.x>ALL.Lead.x?-1:1);//面向主角
				this.node.scaleX=Math.abs(this.node.scaleX)*this.fp;
				this.body.linearVelocity=cc.v2(0,this.body.linearVelocity.y);
				this.state="attack";
				this.haveOb=false;
				if(this.newDropOb.parent){
					this.newDropOb.getComponent(cc.RigidBody).gravityScale=1;
					this.newDropOb.getComponent(cc.RigidBody).linearVelocity=cc.v2(800*this.fp,200);
				}
			}else if(cnt==t2+t1){
				this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,this.beginSpeed.y);
				this.state="walk";
				this.makeOb();
				cnt=-1;
			}
			cnt++;
		}
		this.schedule(this.callbackAttack,0.1,ALL.INF,0);
		
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		if(this.haveOb){
			if(this.newDropOb.parent){
				this.newDropOb.x=this.node.x;
				this.newDropOb.y=this.node.y+this.phyColl.size.height/2+20;//设置位置
			}
			if(speed.x!=0&&(this.rangeX[0]>this.node.x||this.rangeX[1]<this.node.x)){
				this.node.x=speed.x>0?this.rangeX[1]-0.01:this.rangeX[0]+0.01;
				this.fp=-this.fp;
				this.node.scaleX=-this.node.scaleX;
				this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,-this.body.linearVelocity.y);
			}
		}else{

		}
		this.changeAction();
    },

	onDestroy: function(){
		var ob=this.newDropOb;
		if(ob.parent){
			ob.destroy();
		}
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
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    
    
	makeOb: function(){
		this.newDropOb=cc.instantiate(ALL.FAB["Enemy_dropOb"]);
        this.newDropOb.getComponent("Enemy_dropOb").init(4,cc.v2(0,0));
        this.newDropOb.setPosition(this.node.x,this.node.y+this.phyColl.size.height/2+15);
		this.newDropOb.getComponent(cc.RigidBody).gravityScale=0;
        ALL.MainCanvas.addChild(this.newDropOb);
		this.haveOb=true;
	},
	changeAction:function(){
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },
	dieFun:function(){
		if(this.newDropOb.parent){
			this.newDropOb.destroy();
		}
	},
});
