cc.Class({
    extends: cc.Component,

    properties: {
		rangeX:[],
		fp:1,
		__attack:true,
    },

    // use this for initialization
    onLoad: function () {
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
		
		var mk=this.ep.mkScript;
		this.obPos=mk.node.getChildren()[0];
		var d=Math.max(mk.node.width,this.phyColl.size.width)/2;
		this.rangeX=[mk.node.x-d,mk.node.x+d];
		this.stopGap=ENDATA[this.ep.category]["stopGap"][this.ep.kind-1];
		this.fp=(this.node.x>ALL.Lead.x?-1:1);
        this.node.scaleX*=this.fp;
		this.beginSpeed=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,0);
	
		this.state="walk";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		
		
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		if(speed.x!=0&&(this.rangeX[0]>this.node.x||this.rangeX[1]<this.node.x)){
			this.node.x=speed.x>0?this.rangeX[1]-0.01:this.rangeX[0]+0.01;
			this.fp=-this.fp;
			this.node.scaleX=-this.node.scaleX;
			this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,-this.body.linearVelocity.y);
		}
		if(this.__attack&&Math.abs(this.node.x-ALL.Lead.x)<cc.winSize.width/2&&Math.abs(this.node.y-ALL.Lead.y)<cc.winSize.height/2){
			this.__attack=false;
			this.callbackAttack = function(){
				//this.fp=(this.node.x>ALL.Lead.x?-1:1);//面向主角
				//this.node.scaleX=Math.abs(this.node.scaleX)*this.fp;
				this.__attack=true;
				this.body.linearVelocity=cc.v2(0,this.beginSpeed.y);
			}
			this.schedule(this.callbackAttack,this.stopGap,1,0);
		}
		this.changeAction(speed);
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
			if(f.y==-1&&this.body.linearVelocity.y<-50){
				this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.fp,0);
				this.makeOb();
			}
        }else if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
    
	makeOb: function(){
		var newDropOb=cc.instantiate(ALL.FAB["Enemy_dropOb"]);
        newDropOb.getComponent("Enemy_dropOb").init(5,cc.v2(0,-1000));
        newDropOb.setPosition(this.node.x,this.node.y+(this.obPos?this.obPos.y:1000));
		newDropOb.getComponent(cc.RigidBody).gravityScale=1;
        ALL.MainCanvas.addChild(newDropOb);
	},
	changeAction:function(speed){
		if(speed.y>1){
			this.state="jump";
		}else if(speed.y<-1){
			this.state="drop";
		}else{
			this.state="walk";
		}
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },

});
