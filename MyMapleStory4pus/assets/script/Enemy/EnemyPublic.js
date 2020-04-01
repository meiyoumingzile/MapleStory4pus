cc.Class({
    extends: cc.Component,

    properties: {
		life:cc.v2(1,1),//人物的生命
		mkScript:null,
		specialEffect:"null",//有三种，null,twinkle,invincible 。null代表可以被攻击，twinkle不可被攻击也无法攻击别人，invincible不可被攻击且可以攻击别人
		damage:1,
		category:"",
		kind:1,
		canDie:true,//是不是可以死亡，对于某些物体不会因为其他原因死亡
		dieDis:cc.v2(0,0),
    },

    // use this for initialization
    onLoad: function () {
		
    },
	__preload: function () {//预加载，它在onload之前
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
		var mk=this.mkScript;
		this.dieDis=cc.v2(ALL.enemyUpdateSize.x,ALL.enemyUpdateSize.y);
		if(mk){
			this.category=mk.category;
			this.node.name="Enemy_"+this.category+"_"+this.kind;
			this.kind=mk.kind;
			var x=mk.life>0?mk.life:ENDATA[mk.category]["life"][mk.kind-1];
			this.life=cc.v2(x,x);
			this.mkscx=mk.node.scaleX;
			this.mkscy=mk.node.scaleY;
			this.setScaleX();
			this.setScaleY();
			this.node.color=mk.node.color;
			if(this.phyColl&&ENDATA[mk.category]["phySize"]){
				if(ENDATA[mk.category]["phySize"].x!=undefined){
					this.phyColl.size.width=ENDATA[mk.category]["phySize"].x;
					this.phyColl.size.height=ENDATA[mk.category]["phySize"].y;
				}else if(ENDATA[mk.category]["phySize"][mk.kind-1].x){
					this.phyColl.size.width=ENDATA[mk.category]["phySize"][mk.kind-1].x;
					this.phyColl.size.height=ENDATA[mk.category]["phySize"][mk.kind-1].y;
				}
				this.phyColl.apply();
			}
			
			this.node.angle=mk.rot;
		}
		
    },
	isOnFloor:function(contact){//判断是不是站在地面上
		var points =  contact.getWorldManifold().points;
		let i=0;
		for(i=0;i<points.length&&points[i].y<this.node.y;i++);
		return i==points.length;
	},
	getFpWithObject:function(contact, self, other){//判断碰撞物关系，一个向量,不确定返回(0,0)，若怪物的坐标大于碰撞点的坐标，结果是-1
		var points =  contact.getWorldManifold().points;
		var fp=cc.v2(0,0);
		var cnt=[0,0,0,0];
		//cc.log(self);
		for(var i=0;i<points.length;i++){
			if(points[i].x<this.node.x){
				cnt[0]++;
			}else if(points[i].x>this.node.x){
				cnt[1]++;
			}
			if(points[i].y<this.node.y){
				cnt[2]++;
			}else if(points[i].y>this.node.y){
				cnt[3]++;
			}
		}
		if(cnt[0]==points.length){
			fp.x=-1;
		}else if(cnt[1]==points.length){
			fp.x=1;
		}
		if(cnt[2]==points.length){
			fp.y=-1;
		}else if(cnt[3]==points.length){
			fp.y=1;
		}
		return fp;
	},
    changeLife:function(value,arm=""){//返回值结果用来判断怎么处理
		if(value<0){//{//受到伤害的动画效果
			if(this.specialEffect=="null"){
				var li=ENDATA[this.category]["damArm"];
				if(li&&li.indexOf(arm)==-1){//li存在但长度是0则代表无敌
					return 0;//自己不可被该武器攻击
				}
				this.life.x+=value;
				this.specialEffect="twinkle";
				var count = 0;
				this.callback = function(){
					if(count == 11) {
						this.node.opacity=255;
						if(this.specialEffect=="twinkle"){
							this.specialEffect="null";
						}
						this.unschedule(this.callback);
					}else if(count%2==0){
						this.node.opacity=0;
						count++;
					}else{
						this.node.opacity=255;
						count++;
					}
				}
				this.schedule(this.callback,0.0500,50,0);
				return 1;//攻击成功自己受到伤害
			}else{
				return 2;//自己处于非可受伤状态
			}
		}else{
			return -1;//未受伤
		}
    },
	changeLife1:function(value,arm=""){//扣血却没有闪烁效果
		if(value<0){//{//受到伤害的动画效果
			if(this.specialEffect=="null"){
				var li=ENDATA[this.category]["damArm"];
				if(li&&li.indexOf(arm)==-1){//li存在但长度是0则代表无敌
					return 0;//自己不可被该武器攻击
				}
				this.life.x+=value;
				return 1;//攻击成功自己受到伤害
			}else{
				return 2;//自己处于非可受伤状态
			}
		}else{
			return -1;//未受伤
		}
    },
    visDie:function(fun=null){
        if(this.life.x<=0||Math.abs(this.node.x-ALL.Lead.x)>this.dieDis.x||Math.abs(this.node.y-ALL.Lead.y)>this.dieDis.y){
            this.die(fun);
            ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
        }
    },
	die:function(fun=null){
		if(fun){
			fun();
		}
		if(this.canDie){
			if(this.mkScript){
				this.mkScript.__cnt--;
			}
			this.node.destroy();
		}
	},
	setScaleX:function(fp=1){
		this.node.scaleX= ALL.scaleEnemy.x*this.mkscx*fp;
	},
	setScaleY:function(fp=1){
		this.node.scaleY= ALL.scaleEnemy.y*this.mkscy*fp;
	},
	init:function(category,kind){
		this.category=category;
		this.kind=kind;
	},

	pause:function(is=true){

	},
	clone(){
		
	}
});
