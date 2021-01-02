cc.Class({
    extends: cc.Component,

    properties: {
		pathV2:[],
		len:cc.v2(0,0),
		tarPos:cc.v2(0,0),
		isLine:true,//是否是直线
    },

    // use this for initialization
    onLoad: function () {
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
		var mk=this.ep.mkScript;
		this.ep.specialEffect=(ENDATA[this.ep.category]["specialEffect"]!=undefined?ENDATA[this.ep.category]["specialEffect"][this.ep.kind-1]:"null");//人物状态
		
		this.playState="Enemy_"+this.ep.category+this.ep.kind;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		this.len=mk.noteSpeed;
		this.isLine=this.len.y==0;
		
		var arr=mk.node.getChildren();
		for(var i=0;i<arr.length;i++){
			this.pathV2[i]=cc.v2(arr[i].x+mk.node.x,arr[i].y+mk.node.y);
		}
		this.tarPos=cc.v2(this.node.x,this.node.y);
		this.__i=0;
    },

    update: function (dt) {
		this.ep.visDie();
		if(this.pathV2.length>0&&Math.abs(this.node.x-this.tarPos.x)<0.01&&Math.abs(this.node.y-this.tarPos.y)<0.01){
			this.tarPos=this.pathV2[this.__i++];
			this.__i%=this.pathV2.length;
			this.moveTarPos(this.tarPos);
		}
    },

	ff: function(x,a,h){//被积函数
		var y=-2*h*x/(a*a);;
		return Math.sqrt(1+y*y);
	},
	simpson : function(l,r,a,h){
		return (this.ff(l,a,h)+this.ff(r,a,h)+4*this.ff((r+l)/2,a,h))*(r-l)/6;
	},
	binsim: function(l,r,pre,a,h){
		var m=(l+r)/2;
		var ml=this.simpson(l,m,a,h);
		var mr=this.simpson(m,r,a,h);
		if(Math.abs(ml+mr-pre)<ALL.inf)
			return  ml+mr;
		return  this.binsim(l,m,ml,a,h)+this.binsim(m,r,mr,a,h);
	},
	//以上是辛普森法计算过程
	
	moveTarPos:function(tar){
		var d=cc.v2(this.node.x,this.node.y).sub(tar).mag();
		if(d<=ALL.inf){
			return;
		}
		if(this.isLine){
			this.time=d/this.len.x;
			this.node.runAction(cc.moveTo(this.time,tar));
		}else{
			var d2=d/2;
			var dis= this.binsim(0,d2,this.simpson(0,d2,d2,this.len.y),d2,this.len.y);//利用积分计算距离来得到运动轨迹的时间，y=-(h/a*a)*x^2+h ,区间[-a,+a],第一型曲线积分
			this.time=dis*2/this.len.x;
			this.node.runAction(cc.jumpTo(this.time,tar,this.len.y,1));
		}
		
	}
});
