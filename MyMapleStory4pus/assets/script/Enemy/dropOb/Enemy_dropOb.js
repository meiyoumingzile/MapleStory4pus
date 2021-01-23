
cc.Class({
    extends: cc.Component,

    properties: {
		beginSpeed:cc.v2(0,0),
		collFloorCnt:0,
		motionFun:null,//添加控制运动的脚本
		pics:[cc.SpriteFrame],
		sc:cc.v2(1,1),
    },

    onLoad: function () {
	//	this.init(5);
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.phyColl=this.node.getComponent(cc.PhysicsPolygonCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
		
		this.ep.dieDis.x*=4;
		this.ep.dieDis.y*=4;
		this.ep.category="dropOb";
		var points=ENDATA[this.ep.category]["phySize"][this.ep.kind-1];
		this.phyColl.points=points;
		this.phyColl.apply();
		this.body.linearVelocity=cc.v2(this.beginSpeed.x,this.beginSpeed.y);
		this.node.scaleX=ALL.scaleEnemy.x*this.sc.x;
		this.node.scaleY=ALL.scaleEnemy.y*this.sc.y;
		this.ep.specialEffect=(ENDATA[this.ep.category]["specialEffect"]!=undefined?ENDATA[this.ep.category]["specialEffect"][this.ep.kind-1]:"null");//人物状态
		//cc.log(this.ep.specialEffect);
		//this.body.gravityScale=1;//
		if(this.ep.kind>=7){
			this.playState="Enemy_dropOb"+this.ep.kind;
			this.lastPlayState=this.playState;
			this.player.play(this.playState);
		}else{
			this.node.getComponent(cc.Sprite).spriteFrame= this.pics[this.ep.kind-1];
		}
    },
	
	// use this for initialization
	init: function(kind,beginSpeed=cc.v2(0,0),sc=cc.v2(1,1)){//ep.kind代表种类，beginSpeed代表速度，sc代表大小
        this.ep=this.node.getComponent("EnemyPublic");
		this.ep.kind=kind;
		this.beginSpeed=beginSpeed;
		this.sc=sc;
	},
	
    update: function (dt) {
		this.ep.visDie();
		if(this.ep.kind==7&&Math.sign(this.body.linearVelocity.y)*Math.sign(this.node.scaleY)==1){
			this.node.scaleY=-this.node.scaleY;
		}
		if(this.motionFun!=null){
			this.motionFun();
		}
	},
		
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){
			
        }else if(other.node.name.indexOf("Object")!=-1){
			if(this.ep.kind==3){
				if(this.ep.isOnFloor(contact)&&this.collFloorCnt++==0){
					this.body.linearVelocity=cc.v2(177*(this.node.x>ALL.Lead.x?-1:1),401);
				}else{
					this.ep.die();
				}
			}else if(this.ep.kind==4){
				if(this.ep.isOnFloor(contact)&&this.collFloorCnt++==0){
					this.body.linearVelocity=cc.v2(this.body.linearVelocity.x/3,300);
				}else{
					this.ep.die();
				}
			}else if(this.ep.kind==5){
				var sc=this.sc;
				var p=cc.v2(this.node.x,this.node.y);
				var Y=this.body.linearVelocity.y;
				this.ep.die(function(){
					if(sc.x==1&&sc.y==1){
						for(var i=-2;i<3;i++){
							if(i!=0){
								var newDropOb=cc.instantiate(ALL.RES.FAB["Enemy_dropOb"]);
								newDropOb.getComponent("Enemy_dropOb").init(5,cc.v2(i*160,-Y/2.4),cc.v2(0.4,0.4));
								newDropOb.setPosition(p.x,p.y+10);
								newDropOb.getComponent(cc.RigidBody).gravityScale=1;
								ALL.MainCanvas.addChild(newDropOb);
							}
						}
					}
				});
			}else{
				this.ep.die();
			}
        }else if(other.node.name.indexOf("Arms")!=-1){
            
        }
	},

});
