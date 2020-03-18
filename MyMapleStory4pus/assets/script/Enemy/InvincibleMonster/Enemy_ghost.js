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
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
        this.player = this.node.getComponent(cc.Animation);
		var mk=this.ep.mkScript;
		this.dx=Math.max(mk.node.width,100)/2;
		this.dy=Math.max(mk.node.height,100)/2;
		if(this.ep.mkScript){
			this.rangeX=[mk.node.x-this.dx,mk.node.x+this.dx];
			this.rangeY=[mk.node.y-this.dy,mk.node.y+this.dy];
		}
		
		this.__speed=cc.v2(0,0);
		this.ep.specialEffect=ENDATA[this.ep.category]["specialEffect"][this.ep.kind-1];
		this.safeDis=ENDATA[this.ep.category]["safeDis"][this.ep.kind-1];
        this.node.scaleX*=(this.node.x>ALL.Lead.x?-1:1);
		var d=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1].mag();
		this.followSpeed=d;
		this.body.linearVelocity.x=d*Math.cos(this.node.angle/180*Math.PI)*(this.node.x>ALL.Lead.x?-1:1);//[-90,90]
		this.body.linearVelocity.y=d*Math.sin(this.node.angle/180*Math.PI)*(this.node.x>ALL.Lead.x?-1:1);
		if(this.node.angle==180){
			this.node.scaleX=-this.node.scaleX;
			this.body.linearVelocity.x=-this.body.linearVelocity.x;
		}
		if(this.ep.kind==3){
			this.body.linearVelocity=cc.v2(0,0);
			this.safeDis=cc.v2(cc.winSize.width,cc.winSize.height);
		}
		this.playState="Enemy_"+this.ep.category+this.ep.kind;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		if(Math.abs(this.node.x-ALL.Lead.x)<this.safeDis.x&&Math.abs(this.node.y-ALL.Lead.y)<this.safeDis.y){
			this.setRangeXY();
			var cx=this.node.x-ALL.Lead.x;
			var cy=this.node.y-ALL.Lead.y;
			var fx=cx>0?-1:1;
			var fy=cy>0?-1:1;
			this.node.scaleX=Math.abs(this.node.scaleX)*fx;
			var d=cc.v2(cx,cy).mag();
			var cosX=Math.abs(cx)/d;
			var sinX=Math.abs(cy)/d;
			this.body.linearVelocity=cc.v2(this.followSpeed*cosX*fx,this.followSpeed*sinX*fy);
		}else{//安全距离以外
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
				this.body.linearVelocity=cc.v2(-this.__speed.x,-this.__speed.y);
			}
		}
		
		
    },


	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name.indexOf("Arms_")!=-1){//碰到了人物武器,在人物武器类里实现
			
		}
    },
	
	setRangeXY(){
		this.rangeX=[this.node.x-this.dx,this.node.x+this.dx];
		this.rangeY=[this.node.y-this.dy,this.node.y+this.dy];
	},
});
