cc.Class({
    extends: cc.Component,

    properties: {
		ffp:cc.v2(0,0),
		len:cc.v2(0,0),
		tarPos:cc.v2(0,0),
		roadKind:1,
		motionCnt:1,
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
		this.ffp.x=(this.node.x>ALL.Lead.x?-1:1);//cc.bezierTo
		this.ffp.y=(ALL.MainCanSc.randomNum(0,1)==0?1:-1);
        this.node.scaleX*=this.ffp.x;
		
		this.playState="Enemy_"+this.ep.category+this.ep.kind;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		
		this.beginSpeed=mk.noteSpeed;
		this.len=ENDATA[this.ep.category]["jumpLen"][this.ep.kind-1];
		this.unitTime=ENDATA[this.ep.category]["unitTime"][this.ep.kind-1];
		this.followSpeed=Math.max(this.beginSpeed.mag(),ENDATA[this.ep.category]["followSpeed"][this.ep.kind-1]);
		this.motionFun=mk.canAttack?this.updateFlyState1:this.updateFlyState2;
		//this.body.linearVelocity=this.beginSpeed;
		this.ffp.x=(this.node.x>ALL.Lead.x?-1:1);
		this.tarPos=cc.v2(this.node.x,this.node.y);
		
		this.roadKind=-1;
		this.motionCnt=-1;
		this.isAct=mk.canAttack;
		this.jumpDis= this.binsim(0,this.len.x/2,this.simpson(0,this.len.x/2,this.len.x/2,this.len.y),this.len.x/2,this.len.y);//利用积分计算距离来得到运动轨迹的时间，y=-(h/a*a)*x^2+h ,区间[-a,+a],第一型曲线积分
		//this.tarPos=cc.v2(this.node.x,this.node.y);
    },

    update: function (dt) {
		var speed=this.body.linearVelocity;
		this.ep.visDie();
		this.motionFun(speed);
		this.node.scaleX=this.ffp.x*ALL.scaleEnemy.x;
		if(this.isAct)
			this.body.linearVelocity=speed;
    },

	ff: function(x,a,h){//被积函数
		var y=-2*h*x/(a*a);
		//cc.log(y);
		return Math.sqrt(1+y*y);
	},
	simpson : function(l,r,a,h){
		return (this.ff(l,a,h)+this.ff(r,a,h)+4*this.ff((r+l)/2,a,h))*(r-l)/6;
	},
	binsim: function(l,r,pre,a,h){
		var m=(l+r)/2;
		var ml=this.simpson(l,m,a,h);
		var mr=this.simpson(m,r,a,h);
		if(Math.abs(ml+mr-pre)<=ALL.inf)
			return  ml+mr;
		return  this.binsim(l,m,ml,a,h)+this.binsim(m,r,mr,a,h);
	},
	//以上是辛普森法计算过程
	
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
    updateFlyState1:function(speed){//3种飞行状态
		if(this.motionCnt<0){
			//this.roadKind=ALL.MainCanSc.randomNum(0,3);
			this.roadKind=(this.roadKind+1)%4;
			this.motionCnt=1;
			this.tarPos=cc.v2(this.node.x,this.node.y);
			if(this.roadKind==1){
				this.motionCnt=3;
			}else if(this.roadKind==2){//晃动6下
				this.motionCnt=6;
				this.ffp.x=(ALL.MainCanSc.randomNum(0,1)==0?1:-1);
				this.ffp.y=1;
			}else if(this.roadKind==3){
				this.motionCnt=4;
			}
		}
		
		if(this.roadKind==0){
			this.isAct=true;
			var d=cc.v2(MainLead.node.x,MainLead.node.y+MainLead.node.height/2+this.phyColl.size.height/2+20);
			if(Math.abs(this.node.x-d.x)>10||Math.abs(this.node.y-d.y)>10){//不在目标内
				this.tarPos=d;
				var cx=this.node.x-this.tarPos.x;
				var cy=this.node.y-this.tarPos.y;
				this.ffp.x=cx>0?-1:1;
				this.ffp.y=cy>0?-1:1;
				var d=cc.v2(cx,cy).mag();
				var cosX=Math.abs(cx)/d;
				var sinX=Math.abs(cy)/d;
				speed.x=this.followSpeed*cosX*this.ffp.x;
				speed.y=this.followSpeed*sinX*this.ffp.y;
			}else{
				
				this.motionCnt--;
			}
			
		}else if(this.roadKind==1){
			if(Math.abs(this.node.x-this.tarPos.x)<=ALL.inf&&Math.abs(this.node.y-this.tarPos.y)<=ALL.inf){
				if(this.motionCnt>0){
					var r=ALL.MainCanSc.randomNum(5,100);//半径
					this.time=r/this.unitTime;
					this.ffp.x=(ALL.MainCanSc.randomNum(0,1)==0?1:-1);
					this.tarPos=cc.v2(this.node.x+r*this.ffp.x,this.node.y);
					this.isAct=false;
					this.body.linearVelocity=cc.v2(0,0);
					this.node.runAction(cc.moveTo(this.time, this.tarPos,1));//要等待moveTo执行完毕
				}
				this.motionCnt--;
			}
		}else if(this.roadKind==2){
			if(Math.abs(this.node.x-this.tarPos.x)<=ALL.inf&&Math.abs(this.node.y-this.tarPos.y)<=ALL.inf){
				if(this.motionCnt>0){
					this.time=this.jumpDis*2/this.unitTime;
					this.tarPos=cc.v2(this.node.x+this.len.x*this.ffp.x,this.node.y);
					this.isAct=false;
					this.body.linearVelocity=cc.v2(0,0);
					this.node.runAction(cc.jumpTo(this.time, this.tarPos, this.len.y*this.ffp.y,1));
					this.ffp.y*=-1;	
				}
				this.motionCnt--;
			}
		}else if(this.roadKind==3){
			if(Math.abs(this.node.x-this.tarPos.x)<=ALL.inf&&Math.abs(this.node.y-this.tarPos.y)<=ALL.inf){
				if(this.motionCnt>0){
					var r=ALL.MainCanSc.randomNum(50,150);//半径
					var k=ALL.MainCanSc.randomNum(1,360)/180*3.14;//角度
					var cosk=Math.cos(k);
					this.ffp.x=cosk>0?1:-1;
					this.time=r/this.unitTime;
					this.tarPos=cc.v2(this.node.x+r*cosk,this.node.y+r*Math.sin(k));
					this.isAct=false;
					this.body.linearVelocity=cc.v2(0,0);
					this.node.runAction(cc.moveTo(this.time, this.tarPos, this.len.y*this.ffp.y,1));
				}
				this.motionCnt--;
			}
			
		}
    },
	
	 updateFlyState2:function(speed){//3种飞行状态
		//cc.log(Math.abs(this.node.x-this.tarPos.x),Math.abs(this.node.y-this.tarPos.y));
		if(Math.abs(this.node.x-this.tarPos.x)<ALL.inf&&Math.abs(this.node.y-this.tarPos.y)<ALL.inf){
			var per=ALL.MainCanSc.randomNum(0,10);
			var a=Math.abs(ALL.Lead.x-this.node.x);
			if(per<2&&((this.ffp.x==1)^(this.node.x<ALL.Lead.x))==false&&a>this.len.x){//怪物面向人物，并且还恰好有几率
				var h=Math.abs(ALL.Lead.y-this.node.y);
				this.ffp=cc.v2(ALL.Lead.x>this.node.x?1:-1,ALL.Lead.y>this.node.y?1:-1);
				var dis= this.binsim(0,a,this.simpson(0,a,a,h),a,h);//利用积分计算距离来得到运动轨迹的时间，y=-(h/a*a)*x^2+h ,区间[-a,+a],第一型曲线积分
				this.time=dis*2/this.unitTime;
				//cc.log( dis*2,this.time);
				this.tarPos=cc.v2(this.node.x+a*this.ffp.x,this.node.y);
				this.node.runAction(cc.jumpTo(this.time, this.tarPos, h*this.ffp.y,1));
			}else if(per>9||this.motionCnt!=-1){//一定几率左右动
				this.motionCnt=(this.motionCnt==-1?3:this.motionCnt-1);//反复做运动多次
				this.time=this.len.y*2/this.unitTime;
				this.tarPos=cc.v2(this.node.x,this.node.y);
				this.node.runAction(cc.jumpTo(this.time, this.tarPos, this.len.y*this.ffp.y,1));
			}else if(a>600){//超出范围则往回移动
				this.ffp.x*=-1;	
				this.time=this.jumpDis*2/this.unitTime;
				this.tarPos=cc.v2(this.node.x+this.len.x*this.ffp.x,this.node.y);
				this.node.runAction(cc.jumpTo(this.time, this.tarPos, this.len.y*this.ffp.y,1));
			}else{
				this.time=this.jumpDis*2/this.unitTime;
				this.tarPos=cc.v2(this.node.x+this.len.x*this.ffp.x,this.node.y);
				this.node.runAction(cc.jumpTo(this.time, this.tarPos, this.len.y*this.ffp.y,1));
			}
			this.ffp.y*=-1;	
		}
	 },
});
