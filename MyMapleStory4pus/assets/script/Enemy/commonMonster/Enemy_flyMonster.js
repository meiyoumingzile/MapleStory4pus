cc.Class({
    extends: cc.Component,

    properties: {
		pathV2:[],
		ffp:cc.v2(0,0),
		len:cc.v2(0,0),
		tarPos:cc.v2(0,0),
    },

    // use this for initialization
    onLoad: function () {
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
		var mk=this.ep.mkScript;
        this.ep.specialEffect="null";
		this.ffp.x=(this.node.x>ALL.Lead.x?-1:1);//cc.bezierTo
		this.ffp.y=(ALL.MainCanSc.randomNum(0,1)==0?1:-1);
        this.node.scaleX*=this.ffp.x;
		
		this.playState="Enemy_"+this.ep.category+this.ep.kind;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		
		var arr=mk.node.getChildren();
		for(var i=0;i<arr.length;i++){
			this.pathV2[i]=cc.v2(arr[i].x+mk.node.x,arr[i].y+mk.node.y);
		}
		this.len=mk.noteSpeed;
		this.unitTime=ENDATA[this.ep.category]["unitTime"][this.ep.kind-1];
		this.jumpDis= this.binsim(0,this.len.x/2,this.simpson(0,this.len.x/2,this.len.x/2,this.len.y),this.len.x/2,this.len.y);//利用积分计算距离来得到运动轨迹的时间，y=-(h/a*a)*x^2+h ,区间[-a,+a],第一型曲线积分
		this.time=1;
		this.tarPos=cc.v2(this.node.x,this.node.y);
		if(this.pathV2.length>0){//优先走规定的节点
			this.tarPos=cc.v2(this.pathV2[0].x,this.pathV2[0].y);
			this.time=this.pathV2[0].sub(cc.v2(this.node.x,this.node.y)).mag()/this.unitTime;
			this.node.runAction(cc.moveTo(this.time,this.pathV2[0]));
		}
    },

    update: function (dt) {
		//cc.log(this.body.linearVelocity);
		this.ep.visDie();
	//cc.log(this.tarPos,this.node.x,this.node.y);
		if(Math.abs(this.node.x-this.tarPos.x)<0.01&&Math.abs(this.node.y-this.tarPos.y)<0.01){
			this.time=this.jumpDis*2/this.unitTime;
			//cc.log( dis*2,this.time);
			this.tarPos=cc.v2(this.node.x+this.len.x*this.ffp.x,this.node.y);
			this.node.runAction(cc.jumpTo(this.time, this.tarPos, this.len.y*this.ffp.y,1));
			this.ffp.y*=-1;	
			if(this.len.x<=1)
				this.ffp.x*=-1;	
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
		if(Math.abs(ml+mr-pre)<0.01)
			return  ml+mr;
		return  this.binsim(l,m,ml,a,h)+this.binsim(m,r,mr,a,h);
	},
	//以上是计算函数   ，在[l,r]上的定积分,
	
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
