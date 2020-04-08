cc.Class({
    extends: cc.Component,

    properties: {
		data:null,
		//SchedulerDir:{},
    },
	
    // use this for initialization
    onLoad: function () {
		this.pets=["Fierydragon","Brontosaurus","Pterosaur","Stegosaurus","Seadragon"];
    	this.preArms="axe";
		this.data={

	        state:["air","walk","Lead"],
			specialEffect:"null",
/*状态，三个代表：第1个代表周围环境，第2个代表人的运动状态：walk,run ;
第3个代表碰撞体状态有："Lead","lieLead","Fierydragon","Brontosaurus","Pterosaur","Stegosaurus","Seadragon"。
*/			
			collFloorCnt:0,
			collFloorDir:{},
			collCeilCnt:0,
			collCeilDir:{},
			collSideCnt:[0,0],
			collSideDir:[{},{}],
			collWaterCnt:0,
			collWaterDir:{},
			isChangingPhy:0,
			isLie:false,
			isFall:false,
			isClimb:false,
			climbOb:[null,null],//0是梯子，1是梯子头

	        act:"walk", //state[2]+"_"+act+"_"+左右是状态。
			preActList:["walk","walk"],
	        
			canAttack:true,
			isAttackAct:false,//是否处于攻击状态

	        //speed: cc.v2(0, 0),
			jumpSpeedy: 0,      //跳跃初始速度
			jumptime:0,
	        maxSpeedx:0,        //限制的最大速度
			maxSpeedup:0, 		//限制的最大速度
			maxSpeeddown:0,     //限制的最大速度
			selfacc: cc.v2(0,0),//自己的加速度
			
			
	        key_left:false,
	        key_right:false,
	        key_down:false,
	        key_up:false,
	        key_attack:false,
	        key_acc:false,
	        key_jump:false,
			key_pause:false,
	        
			nowArmsCnt:{},
			nowArms:"axe",
			gotProp:{goods_axe:true},
			armColl:{},
			player:null,
			life:cc.v2(0,0),
			time:cc.v2(0,8),
			pause:false,
    	};
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		this.data.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.coll=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponents(cc.PhysicsBoxCollider)[0];//获得碰撞体
		this.head = this.node.getComponents(cc.PhysicsBoxCollider)[1];
		
		//var g=this.node.getComponents(cc.script);
		/*if(ALL.SaveLead!=null){
			var root=this.node.parent;
			this.node=ALL.SaveLead;
			//this.node.parent=root;
			ALL.SaveLead=null;
		}*/
		/*if(ALL.SaveLead!=null){
			this.node.destroy();
			this.node=ALL.SaveLead;
			cc.log(this.node.data);
		}*/
    },

    onKeyDown (event) {
		if(this.data.pause)
			return ;
        switch(event.keyCode) {
            case KEY.jump: //1是跳
				this.data.key_jump=true;
				break;
			case KEY.attack: //2是攻击
				this.data.key_attack=true;
				break;
			case KEY.acc: //3是加速
				this.data.key_acc=true;
				break;
            case KEY.left:
				this.data.key_left=true;
                break;
            case KEY.right:
				this.data.key_right=true;
                break;
            case KEY.up:
                this.data.key_up=true;
                break;
			case KEY.down:
				this.data.key_down=true;
				break;
			case KEY.pause:
				this.data.key_pause=true;
				break;
        }
    },

    onKeyUp (event) {
		if(this.data.pause)
			return ;
        switch(event.keyCode) {
            case KEY.jump: //1是跳
				this.data.key_jump=false;
				break;
			case KEY.attack: //1是攻击
				this.data.key_attack=false;
				break;
			case KEY.acc: //3是加速
				this.data.key_acc=false;
				break;
            case KEY.left:
				this.data.key_left=false;
                break;
            case KEY.right:
				this.data.key_right=false;
                break;
            case KEY.up:
				this.data.key_up=false;
                break;
			case KEY.down:
				this.data.key_down=false;
				break;
			case KEY.pause:
				this.data.key_pause=false;
				break;
        }
    },


	update: function (dt) {//dt是距离上一帧的时间间隔
		if(this.data.pause||this.data.key_pause){
			this.pause(true);
			return ;
		}
		this.data.preScaleX=this.node.scaleX;
		this.data.preAct=this.data.act;
		var speed = this.body.linearVelocity;
	
		this.updatePhyColl(dt,speed);//判断按键状态
		this.dealKey(dt,speed);//判断按键状态
		this.dealState(dt,speed);//处理人物状态和动画切换
		this.updateParameter(dt,speed);
		this.calSpeed(dt,speed);
		this.body.linearVelocity = speed;
    }, 
	    
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(this.data.pause){
			return ;
		}
		var cf=this.collFp(contact);
		var sc=Math.abs(this.data.preScaleX-this.node.scaleX);
		if(self.tag==1){
			if(other.node.name.indexOf("Object")!=-1){
				if(!this.data.collCeilDir[other._id]){
					this.data.collCeilDir[other._id]=other;
					this.data.collCeilCnt++;
				}
			}
			if(other.name.indexOf("WATER")!=-1){
				this.intoWater();
			}
		}else{//self.tag==0
			if(other.name.indexOf("WATER")!=-1){
				if(sc<ALL.inf&&!this.data.collWaterDir[other._id]){
					this.data.collWaterCnt++;
					this.data.collWaterDir[other._id]=true;
				}
			}
			if(other.node.name=="Object_Ladder"){//爬梯子
				this.data.climbOb[1]=other.node;
			}
			if(other.node.name.indexOf("Enemy")!=-1){
				this.collEnemy(contact, other,cf);
			}else if(other.node.name.indexOf("Object")!=-1){
				if(cf.y==-1&&!this.data.collFloorDir[other._id]){
					this.data.collFloorDir[other._id]=other;
					this.data.collFloorCnt++;
				}
				if(cf.x==-1&&!this.data.collSideDir[0][other._id]){
					this.data.collSideDir[0][other._id]=other;
					this.data.collSideCnt[0]++;
				}
				if(cf.x==1&&!this.data.collSideDir[1][other._id]){
					this.data.collSideDir[1][other._id]=other;
					this.data.collSideCnt[1]++;
				}
				this.data.isFall=false;//
			}
		}
		
    },
	onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
		if(this.data.pause){
			return ;
		}
		var sc=Math.abs(this.data.preScaleX-this.node.scaleX);
		if(self.tag==1){
			if(other.node.name.indexOf("Object")!=-1){
				if(this.data.collCeilDir[other._id]){
					delete this.data.collCeilDir[other._id];
					this.data.collCeilCnt--;
				}
			}
			if(other.name.indexOf("WATER")!=-1){
				this.data.state[0]="air";
			}
		}else{//self.tag==0
			if(other.name.indexOf("WATER")!=-1){
				if(this.data.collWaterDir[other._id]&&sc<ALL.inf){
					delete this.data.collWaterDir[other._id];
					this.data.collWaterCnt--;
				}
			}
			if(other.node.name=="Object_Ladder"){//爬梯子
				this.data.climbOb[1]=null;
			}
			if(other.node.name.indexOf("Object")!=-1){
				if(this.data.collFloorDir[other._id]){
					delete this.data.collFloorDir[other._id];
					this.data.collFloorCnt--;
				}
				if(this.data.collSideDir[0][other._id]){
					delete this.data.collSideDir[0][other._id];
					this.data.collSideCnt[0]--;
				}
				if(this.data.collSideDir[1][other._id]){
					delete this.data.collSideDir[1][other._id];
					this.data.collSideCnt[1]--;
				}
				this.data.isFall=false;//
			}
		}
    },
	onPreSolve: function (contact, self, other) {// 每次处理碰撞体接触逻辑时每一帧都调用
		if(this.data.pause){
			return ;
		}
		var sc=Math.abs(this.data.preScaleX-this.node.scaleX);
		if(self.tag==1){
		}else{//self.tag==0
			var cf=this.collFp(contact);
			if(other.node.name=="Object_Ladder"){//爬梯子
				if(this.data.key_down||this.data.isClimb){
					contact.disabled=true;
					this.data.isClimb=true;
				}
			}
			if(other.node.name.indexOf("Enemy")!=-1){
				this.collEnemy(contact, other,cf);
			}else if(other.node.name.indexOf("Object")!=-1){
				if(cf.y!=-1&&this.data.collFloorDir[other._id]){
					delete this.data.collFloorDir[other._id];
					this.data.collFloorCnt--;
				}
				if(cf.x!=-1&&this.data.collSideDir[0][other._id]){
					delete this.data.collSideDir[0][other._id];
					this.data.collSideCnt[0]--;
				}
				if(cf.x!=1&&this.data.collSideDir[1][other._id]){
					delete this.data.collSideDir[1][other._id];
					this.data.collSideCnt[1]--;
				}
			}
		}
    }, 
	onCollisionEnter: function (other, self){
		if(this.data.pause)
			return ;
		if(other.node.name.indexOf("Ladder")!=-1){
			this.data.climbOb[0]=other.node;
		}else if(other.node.name.indexOf("goods")!=-1){
			this.getGoods(other.node.name.replace("goods_",""));
		}
	},
	onCollisionExit: function (other, self){
		if(this.data.pause)
			return ;
		if(other.node.name.indexOf("Ladder")!=-1){
			this.data.climbOb[0]=null;
		}
	},
	dataBegin:function(){
		
		this.changeLife(8,8);
		this.changeTime(5);
		
		this.data.maxSpeedx=LEADDATA.MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		this.data.maxSpeedup=LEADDATA.MaxSpeedKind[this.data.state[0]]["up"];
		this.data.maxSpeeddown=LEADDATA.MaxSpeedKind[this.data.state[0]]["down"];
		this.data.jumpSpeedy=LEADDATA.BeginSpeedKind[this.data.state[0]]["jump"];
		this.setPhy();
		var nowDraw=this.data.state[2]+"_"+this.data.act;
		
		this.node.scale=ALL.scaleLead; //人物大小适配场景
		//this.node.scaleX=用来调整开场方向
		this.data.player.play(nowDraw);
		this.data.preDraw=nowDraw;
		

	},
	updatePhyColl:function(dt,speed){
		
	},
	dealKey:function (dt,speed){//处理按键
		//this.data.maxSpeedx=MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//this.data.maxSpeedup=MaxSpeedKind[this.data.state[0]]["up"];
		//this.data.maxSpeeddown=MaxSpeedKind[this.data.state[0]]["down"];
		//this.data.jumpSpeedy=BeginSpeedKind[this.data.state[0]]["jump"];
		this.judgeClimb(speed);
		this.data.preisLie=this.data.isLie;
		this.data.isLie=this.setIsLie();
		//cc.log(this.data.climbOb==null);
		if(this.data.isLie){//判断碰撞体形状
			this.setPhy("lieLead");
		}else if(this.data.preisLie!=this.data.isLie){//上一帧和当前帧的isLie不同
			this.setPhy("Lead");
		}
		if(this.data.state[0].indexOf("air")!=-1){
			var maxJumptime=8;
			if(this.data.key_attack&&this.data.collWaterCnt>0&&this.data.state[2]=="umbrellaLead"){
				speed.y=0;
			}else if(this.data.key_jump&&!this.data.isLie){//按了跳跃还没有趴着
				if(this.data.act=="climb"&&this.data.climbOb[1]&&this.data.climbOb[0]){
					this.node.y=this.data.climbOb[0].y+this.data.climbOb[1].y+(this.data.climbOb[1].height+this.node.height)/2;
				}else if(this.data.state[2].indexOf("Pterosaur")!=-1){
					//cc.log(this.data.collCeilCnt,speed.y);
					if(this.data.collCeilCnt==0){
						speed.y=this.data.jumpSpeedy/2;
					}else{
						speed.y=0;
					}
				}else if(this.data.collFloorCnt>0){//如果在地面上，且 按了跳跃，则就挑起
			
					speed.y=this.data.jumpSpeedy;
					this.data.jumptime=1;
				}else if(this.data.jumptime>0&&this.data.jumptime<maxJumptime){//如果不在地面上且还按了跳跃且之前几帧按过跳跃可以“大跳”
					this.data.jumptime++;
					if(this.data.jumptime<maxJumptime/2){
						speed.y=this.data.jumpSpeedy;
					}else{
						speed.y=this.data.jumpSpeedy*(1+this.data.jumptime/(maxJumptime*2));//期初几秒加速
					}
				}else if(this.data.preDraw.indexOf("swim")!=-1){//从水里跳出来，且 按了跳跃，则就挑起，但高度低
					this.data.jumptime=maxJumptime/2;
					speed.y=this.data.jumpSpeedy;
				}
			}else{
				this.data.jumptime=0;
			}
			
			if(this.data.state[2]=="Pterosaur"&&this.data.collFloorCnt>0){//是飞龙且在地面上不可以加速
				this.data.state[1]="walk";
			}else if(this.data.key_acc){//按了加速
				this.data.state[1]="run";
			}else if(!this.data.key_acc){
				this.data.state[1]="walk";
			}
		}else if(this.data.state[0].indexOf("water")!=-1){
			this.data.jumptime=0;
			if(this.data.key_jump&&!this.data.isLie){//按了跳跃还没有趴着
				speed.y=this.data.jumpSpeedy;
			}
			if(this.data.key_acc){//按了加速
				this.data.state[1]="run";
			}else{
				this.data.state[1]="walk";
			}
		}
		
		
		var keyFp=0;
		if(this.data.key_left&&this.data.key_right==false){//左边
			keyFp=-1;
		}else if(this.data.key_left==false&&this.data.key_right){//右边
			keyFp=1;
		}
		var leadAcc=LEADDATA.BeginAccKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		this.data.maxSpeedx=LEADDATA.MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//cc.log(this.data.maxSpeedx);
		this.data.maxSpeedup=LEADDATA.MaxSpeedKind[this.data.state[0]]["up"];
		this.data.maxSpeeddown=LEADDATA.MaxSpeedKind[this.data.state[0]]["down"];

		if(this.data.state[2]=="Pterosaur"){//是飞龙下降速度减慢
			this.data.maxSpeeddown/=3;
		}else if(this.data.state[2]=="scooterLead"){//是滑板车
			if(speed.x*keyFp<0){//如果减速,则加速度减半
				leadAcc/=2;
			}
		}else if(this.data.state[2]=="umbrellaLead"){//是雨伞下落速度减慢
			this.data.maxSpeeddown/=3;
			if(this.data.act=="float"){//雨伞滑行速度减慢。
				this.data.maxSpeedx=LEADDATA.MaxSpeedKind["water"][this.data.state[1]][this.data.state[2]];
				leadAcc=LEADDATA.BeginAccKind["water"][this.data.state[1]][this.data.state[2]];
			}
		}

		this.data.jumpSpeedy=LEADDATA.BeginSpeedKind[this.data.state[0]]["jump"];
		if(this.data.collFloorCnt==0&&(this.data.collSideCnt[0]>0||this.data.collSideCnt[1]>0||this.data.act=="climb")){
			this.data.selfacc.x=0;
		}else if(keyFp!=0){//左右运动
			this.node.scaleX=keyFp*ALL.scaleLead.x;
			this.data.selfacc.x=keyFp*leadAcc;//加速度方向和脸的方向一样。
		}else{
			this.data.selfacc.x=0;
		}
	},
	dealState: function (dt,speed){//改变人物状态:act

	/*	if((this.data.act!="walk"||this.data.act!="run")&&this.data.collFloorCnt>0){
			this.data.
		}*/
		if(this.judgeJumpScene()){
			return;
		}else if(this.judgeAttack()){//返回是否处在攻击动作
		}else if(this.data.state[0].indexOf("air")!=-1){
			if(this.data.collWaterCnt>0&&this.data.key_attack&&this.data.state[0]=="air"){//举着伞按了攻击
				this.data.act="float";
			}else if(this.data.isClimb){
				this.setPhy();
				var x=Math.ceil(this.node.x/20)%2;
				var y=Math.ceil(this.node.y/60)%2;
				this.node.scaleX=(x+y==1?1:-1);
				this.data.act="climb";
			}else if(this.data.isLie){
				this.data.state[2]="lieLead";
				if(Math.abs(speed.x)<10){//在地板上,判断速度
					this.data.act="walk";
				}else{
					this.data.act="run";
				}
			}else if(this.data.collFloorCnt<=0){//没在地板上就跳
				this.data.act=this.data.isFall?"fall":"jump";
			}else{
				
				if(Math.abs(speed.x)<100){//在地板上,判断速度
					this.data.act="walk";
				}else{
					if((speed.x>0)^(this.node.scaleX>0)){//速度和面向不同
						this.data.act="slip";
					}else{
						this.data.act="run";
					}
				}
			}

		}else if(this.data.state[0].indexOf("water")!=-1){
		//	cc.log();
			if(this.data.isClimb){
				this.setPhy();
				var x=Math.ceil(this.node.x/20)%2;
				var y=Math.ceil(this.node.y/60)%2;
				this.node.scaleX=(x+y==1?1:-1);
				this.data.act="climb";
			}else if(this.data.collFloorCnt<=0){//没在地板上就跳
				this.data.act="swim";
			}else if(Math.abs(speed.x)<100){//在地板上,判断速度
				this.data.act="walk";
			}else{
				this.data.act="run";
			}
		}

		
		//以上是改变this.data.act
		
		var nowDraw=this.data.state[2]+"_"+this.data.act;
        if(this.data.preDraw!=nowDraw){
            this.data.preDraw=nowDraw;
            this.data.player.play(nowDraw);
        }
	},
	
	updateParameter:function(dt,speed){
		if(this.data.isClimb||(this.data.state[2]=="umbrellaLead"&&this.data.key_attack&&this.data.collWaterCnt>0)){//举着伞按了攻击
			this.body.gravityScale=0;
		}else if(this.data.state[2].indexOf("Pterosaur")!=-1){//是飞龙
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"]/2;
		}else if(this.data.state[2]=="umbrellaLead"&&speed.y<-1){//向下运动且举着雨伞，则中立减半
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"]/8;
		}else{
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"];
		}
		
		this.body.linearDamping=LEADDATA.PhysicalPara[this.data.state[0]]["linearDamping"];
	},
	calSpeed: function(dt,speed){
		var nextx=speed.x+this.data.selfacc.x* dt;
		if(Math.abs(nextx) < this.data.maxSpeedx||Math.abs(nextx) < Math.abs(speed.x)){
			speed.x=nextx;
		}
		var nexty=speed.y+this.data.selfacc.y* dt;
		if((-nexty < this.data.maxSpeeddown&&nexty<0)||(nexty < this.data.maxSpeeddown&&nexty>0)||Math.abs(nexty) < Math.abs(speed.y)){
			speed.y=nexty;
		}
		if(Math.abs(speed.x)<1&&this.data.selfacc.x<1){//控制精度
			speed.x=0;
		}
		if(Math.abs(speed.y)<1&&this.data.selfacc.y<1){//控制精度
			speed.y=0;
		}
	},

	collEnemy:function(contact,other,cf){
		var ep=other.node.getComponent("EnemyPublic");
		if(ep==null){
			cc.log("公用怪物脚本丢失");
			return;
		}
		//cc.log(other.node.name);
		if(this.data.specialEffect=="null"){
			
			if(ep.specialEffect=="null"){
				if(this.data.state[2]=="Stegosaurus"&&this.data.act.indexOf("attack")!=-1){//是剑龙攻击     
					ep.changeLife(-LEADDATA.DAM["Stegosaurus"],"Stegosaurus");//怪物掉血，剑龙攻击成功
				}else if(this.data.state[2]=="scooterLead"&&cf.y==-1){
					
				}else{
					this.speed=this.body.linearVelocity;
					this.speed.x=300*(this.node.x>other.node.x?1:-1)
					this.body.linearVelocity=this.speed;
					if(this.data.specialEffect=="null"){//主角本人状态正常
						if(this.data.state[2].indexOf("Lead")!=-1){//是主角本人则掉血
							if(other.node.name.indexOf("specialStone")!=-1){//是specialStone掉时间
								this.setPhy();
								if(this.data.isFall==false){
									this.data.isFall=true;
									this.data.specialEffect="twinkle";
									var count = 0;
									this.callbackCollSpecialStone = function(){
										if(count === 20) {
											this.node.opacity=255;
											this.data.specialEffect="null";
											this.unschedule(this.callbackCollSpecialStone);
										}else{
											this.node.opacity=count%2*255;
											count++;
										}
									}
									this.schedule(this.callbackCollSpecialStone,0.0500,80,0);
									this.body.linearVelocity=cc.v2(300*(this.node.scaleX>0?1:-1),300);
									this.changeTime(-2);//主角掉时间
								}
							}else{//是普通怪物掉血
								this.data.isFall=false;
								this.changeLife(-ep.damage,0);//主角掉血
							}
						}else{
							this.changeLife(0,0);
							ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
							ep.die();
							this.setPhy();
						}
					}
				}
			}else if(ep.specialEffect=="twinkle"){
				
			}else if(ep.specialEffect=="invincible"){
				this.speed=this.body.linearVelocity;
				this.speed.x=300*(this.node.x>other.node.x?1:-1)
				this.body.linearVelocity=this.speed;
				if(this.data.state[2]=="Lead"&&this.data.specialEffect=="null"){//是主角本人则掉血
					this.changeLife(-ep.damage,0);//主角掉血
				}else if(this.data.state[2]!="Lead"&&this.data.specialEffect=="null"){
					this.changeLife(0,0);
					ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
					ep.die();
					this.setPhy();
				}
			}
		}
	},
	
	changeLife: function(chLife,chLifeUp=0){//改变体力和体力上限
		var child = ALL.MainCanSc.lifeGroup.getChildren();
		var i=child.length;
		while(chLifeUp>0){//加一个上限
			let newLife = new cc.Node();
			newLife.addComponent(cc.Sprite);
			var X=-ALL.MainCanSc.lifeGroup.width/2+(i++)*90;
            newLife.setPosition(X,0);
			newLife.getComponent(cc.Sprite).spriteFrame =  ALL.GamePropFrame["life_flase"];
            ALL.MainCanSc.lifeGroup.addChild(newLife);
			chLifeUp--;this.data.life.y++;
        }
		if(chLife>0){
			var cnt=Math.min(chLife,this.data.life.y-this.data.life.x);//要回复几滴血
			var X=this.data.life.x;//初始血量位置
			this.data.life.x+=cnt;//数值上的回血
			for(var i=X;i<X+cnt;i++){
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.GamePropFrame["life_true"];
			}
		}else{
			var cnt=Math.min(-chLife,this.data.life.x);//掉几滴血
			var X=this.data.life.x;//初始血量
			this.data.life.x-=cnt;//数值上的扣血
			for(var i=X-1;i>=X-cnt;i--){
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.GamePropFrame["life_false"];
			}
			this.data.specialEffect="twinkle";
			var count = 0;
			this.callbackChangeLife = function(){
				if(count === 50) {
					this.node.opacity=255;
					this.data.specialEffect="null";
					this.unschedule(this.callbackChangeLife);
				}else{
					this.node.opacity=count%2*255;
					count++;
				}
			}
			this.schedule(this.callbackChangeLife,0.0500,80,0);
			if(this.data.life.x==0){
				this.die();
			}
		}
	},
	changeTime:function(chTime){//改变时间
		var child = ALL.MainCanSc.timeGroup.getChildren();
		if(chTime>0){
			var cnt=Math.min(chTime,this.data.time.y-this.data.time.x);//要回复几个时间
			var X=this.data.time.x;//初始时间位置
			this.data.time.x+=cnt;//数值上的加时间GamePropFrame
			for(var i=X;i<X+cnt;i++){
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.GamePropFrame["time_true"];
			}
		}else{
			var cnt=Math.min(-chTime,this.data.time.x);//掉几时间
			var X=this.data.time.x;//初始时间
			this.data.time.x-=cnt;//数值上的扣时间
			for(var i=X-1;i>=X-cnt;i--){
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.GamePropFrame["time_false"];
			}
			if(this.data.time.x==0){
				this.changeLife(-1);
				this.changeTime(8);
			}
		}
	},
	newArm:function(){//用来加载一个新武器
        if(this.data.nowArms=="axe"){
				var newarm=cc.instantiate(ALL.FAB["Arm_axe"]);
				newarm.getComponent("Arm_axe").init(cc.v2(800*(this.node.scaleX>0?1:-1),150));
				//cc.log(newarm);
				var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
				var armY=this.node.y+newarm.height/2;
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
        }else if(this.data.nowArms=="DragonFire"){
				var newarm=cc.instantiate(ALL.FAB["Arm_DragonFire"]);
				var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
				var armY=this.node.y+this.phyColl.offset.y+10;
				newarm.getComponent("Arm_DragonFire").init(cc.v2(800*(this.node.scaleX>0?1:-1),0),cc.v2(armX,armY));
				newarm.setPosition(armX,armY); 
				this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="DragonBattery"){
				var newarm=cc.instantiate(ALL.FAB["Arm_DragonBattery"]);
				var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
				var armY=this.node.y+this.phyColl.offset.y+(newarm.height-this.phyColl.size.height)/2;
				newarm.getComponent("Arm_DragonBattery").init(cc.v2(800*(this.node.scaleX>0?1:-1),0),cc.v2(armX,armY));
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="DragonSto"){
				var newarm=cc.instantiate(ALL.FAB["Arm_DragonSto"]);
				var armX=this.node.x+this.phyColl.size.width/2*(this.node.scaleX>0?1:-1);
				var armY=this.node.y-this.phyColl.size.height/2;
				newarm.getComponent("Arm_DragonSto").init(cc.v2(100*(this.node.scaleX>0?1:-1),Math.min(this.body.linearVelocity.y-100,0)),cc.v2(armX,armY));
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
			
		}else if(this.data.nowArms=="Stegosaurus"){
				this.data.nowArmsCnt[this.data.nowArms]=0;
		}else if(this.data.nowArms=="waterGun"){
			this.callbackwaterGun = function(){//前摇时间0.2
				var newarm=cc.instantiate(ALL.FAB["Arm_waterGun"]);
				newarm.getComponent("Arm_waterGun").init(cc.v2(500*(this.node.scaleX>0?1:-1),50));
				//cc.log(newarm);
				var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
				var armY=this.node.y;
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
				this.unschedule(this.callbackwaterGun);
			}
			this.schedule(this.callbackwaterGun,0.2,0,0);
		}else if(this.data.nowArms=="ham"){
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var cnt=0;
			var newarm=cc.instantiate(ALL.FAB["Arm_short"]);
			this.callbackHam = function(){//前摇时间0.2
				if(cnt==2){
					var width=this.data.isLie?94:60;
					
					var off=cc.v2((width+this.phyColl.size.width)/2*ALL.scaleLead.x,LEADDATA.PhysicalPara.offset[this.data.state[2]].y*ALL.scaleLead.y);
					newarm.getComponent("Arm_short").init("ham",off,cc.v2(width,this.phyColl.size.height));
					newarm.setPosition(this.node.x+off.x*(this.node.scaleX>0?1:-1),this.node.y+off.y);
					this.node.parent.addChild(newarm);
				}else if(cnt==attackActCnt){
					newarm.die();
					this.unschedule(this.callbackHam);
				}
				cnt++;
			}
			this.schedule(this.callbackHam,0.1,attackActCnt,0);
		}else if(this.data.nowArms=="fire"){
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var cnt=0;
			var newarm=cc.instantiate(ALL.FAB["Arm_short"]);
			this.callbackHam = function(){//前摇时间0.1
				if(cnt==1){
					var fireWidth=this.data.isLie?100:70;
					var off=cc.v2((fireWidth+this.phyColl.size.width)/2*ALL.scaleLead.x,LEADDATA.PhysicalPara.offset[this.data.state[2]].y*ALL.scaleLead.y);
					newarm.getComponent("Arm_short").init("fire",off,cc.v2(fireWidth,this.phyColl.size.height));
					newarm.setPosition(this.node.x+off.x*(this.node.scaleX>0?1:-1),this.node.y+off.y);
					this.node.parent.addChild(newarm);
				}else if(cnt==attackActCnt){
					newarm.die();
					this.unschedule(this.callbackHam);
				}
				cnt++;
			}
			this.schedule(this.callbackHam,0.1,attackActCnt,0);
		}else if(this.data.nowArms=="spear"){
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var cnt=0;
			var newarm=cc.instantiate(ALL.FAB["Arm_short"]);
			this.callbackHam = function(){//无前摇
				if(cnt==0){
					if(this.data.key_up&&!this.data.isLie){
						var width=30;
						var off=cc.v2(0,66*ALL.scaleLead.y);
						newarm.getComponent("Arm_short").init("spear",off,cc.v2(width,this.phyColl.size.height));
					}else{
						var width=90;
						var off=cc.v2((width+this.phyColl.size.width)/2*ALL.scaleLead.x,2*LEADDATA.PhysicalPara.offset[this.data.state[2]].y*ALL.scaleLead.y);
						newarm.getComponent("Arm_short").init("spear",off,cc.v2(width,this.phyColl.size.height/2));
					}
					newarm.setPosition(this.node.x+off.x*(this.node.scaleX>0?1:-1),this.node.y+off.y);
					this.node.parent.addChild(newarm);

				}else if(cnt==attackActCnt){
					newarm.die();
					this.unschedule(this.callbackHam);
				}
				cnt++;
			}
			this.schedule(this.callbackHam,0.1,attackActCnt,0);
		}else if(this.data.nowArms=="scooter"){
		
			this.data.armColl.scooter=cc.instantiate(ALL.FAB["Arm_short"]);
			var height=2;
			var off=cc.v2(0,-(this.phyColl.size.height+44)/2);
			this.data.armColl.scooter.getComponent("Arm_short").init("scooter",off,cc.v2(this.phyColl.size.width+10,height));
			this.data.armColl.scooter.setPosition(this.node.x+off.x*(this.node.scaleX>0?1:-1),this.node.y+off.y);
			this.node.parent.addChild(this.data.armColl.scooter);
		}else if(this.data.nowArms=="bomb"){
			var newarm=cc.instantiate(ALL.FAB["Object_bomb"]);
			var sx=0;
			if(this.data.key_left){
				sx=-Math.abs(this.body.linearVelocity.x)-100;
			}else if(this.data.key_right){
				sx=Math.abs(this.body.linearVelocity.x)+100;
			}
			newarm.getComponent("Arm_bomb").init(cc.v2(sx,0));//设置速度
			//cc.log(newarm);
			var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
			var armY=this.node.y+newarm.height/2;
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="boomerang"){
			var newarm=cc.instantiate(ALL.FAB["Arm_boomerang"]);
			var fp=(this.node.scaleX>0?1:-1);
			var sx=fp*933;
			if(this.data.key_up&&!this.data.isLie){//向上打
				newarm.getComponent("Arm_boomerang").init(cc.v2(0,Math.abs(sx)),fp,Math.PI/2+(fp==1?0:Math.PI));//设置速度
			}else{
				newarm.getComponent("Arm_boomerang").init(cc.v2(sx,0),fp,0);//设置速度
			}
			var armY=this.borderY(1);
			var armX=this.node.x+(this.phyColl.size.width+newarm.width)/2*fp;
			
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="umbrella"){
			this.data.armColl[this.data.nowArms]=cc.instantiate(ALL.FAB["Arm_short"]);
			var arm=this.data.armColl[this.data.nowArms];
			var height=5;
			var fp=(this.node.scaleX>0?1:-1);
			var off=cc.v2(15,this.phyColl.size.height-height);
			arm.getComponent("Arm_short").init("umbrella",off,cc.v2(130,height));
			arm.name="Object0_umbrellaColl";
			//arm.group="Object0";
			arm.setPosition(this.node.x+off.x*fp,this.node.y+off.y);
			this.node.parent.addChild(arm);
		}
    },
	
	
	
	
	
	
	
	//小型函数。
	findChildNode:function(name){//判断是不是站在地面上
		var child=this.node.getChildren();
		for(var i=0;i<child.length;i++){
			if(child[i].name==name){
				return  child[i];
			}
		}
		return null;
	},
	borderX:function(fp=1){//判断是不是站在地面上
		return this.node.x+this.phyColl.offset.x+this.phyColl.size.width/2*fp;
	},
	borderY:function(fp=1){//判断是不是站在地面上
		return this.node.y+this.phyColl.offset.y+this.phyColl.size.height/2*fp;
	},
	collFp:function(contact,is=false){//判断碰撞物关系，一个向量,不确定返回(0,0)，若怪物的坐标大于碰撞点的坐标，结果是-1
		var points =  contact.getWorldManifold().points;
		var fp=cc.v2(0,0);
		if(points.length<1)
			return fp;
		var cnt=[0,0,0,0];
		for(var i=0;i<points.length;i++){
			if(is)
				cc.log("i:"+i,this.borderY(-1)+2-points[i].y,this.data.collFloorCnt);
			if(points[i].x<this.borderX(-1)+2){
				cnt[0]++;
			}else if(points[i].x>this.borderX(1)-2){
				cnt[1]++;
			}
			if(points[i].y<this.borderY(-1)+1){
				cnt[2]++;
			}else if(points[i].y>this.borderY(1)-2){
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
	judgeAttack:function(){//返回是否处理后面动作。false代表继续处理
		if(this.data.nowArms=="umbrella"){
			if(this.data.state[2]!="umbrellaLead"&&this.data.key_attack//没举着雨伞 且按了攻击
				&&!this.data.isLie&&!this.data.isClimb&&!this.data.isFall&&this.data.state[0]!="water"){
				this.setPhy("umbrellaLead");
			}else if(this.data.state[2]=="umbrellaLead"&&!this.data.key_attack){//举着雨伞 且没按攻击
				this.setPhy("Lead");
				this.delArm();
			}
			return false;
		}
		if(this.data.isFall||this.data.isClimb||this.data.nowArms=="scooter"){
			return false;
		}
		if(this.data.nowArmsCnt[this.data.nowArms]==undefined){
			this.data.nowArmsCnt[this.data.nowArms]=0;
		}
		if(this.data.key_attack&&this.data.canAttack&&this.data.nowArmsCnt[this.data.nowArms]<LEADDATA.ARMS.maxCnt[this.data.nowArms]){//按了攻击有没处于攻击动作,还没有处于非攻击实践
			this.newArm();
			this.data.act="attack"+"_"+this.data.nowArms+this.getAttackFp();
			this.data.canAttack=false;
			this.data.isAttackAct=true;
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var sumCnt=LEADDATA.AttackTime["no"][this.data.nowArms]*10+attackActCnt;
			var count=0;
			this.callbackAttackFun = function(){
				if(count==attackActCnt){
					this.data.isAttackAct=false;
				}
				if(count==sumCnt){
					this.data.canAttack=true;
					this.unschedule(this.callbackAttackFun);
				}
				count++;
			}
			this.schedule(this.callbackAttackFun,0.1,sumCnt,0);
		}
		return this.data.isAttackAct;
	},
	getGoods:function(name){
		var i=0;
		for(i=0;i<this.pets.length&&name.indexOf(this.pets[i])==-1;i++);
		if(i<this.pets.length){//判断是不是骑着龙
			this.setPhy(this.pets[i]);
		}else{
			this.setArm(name);
			if(this.data.state[2].indexOf("Lead")==-1){
				this.setPhy();
			}else if(name=="scooter"){
				if(this.data.collFloorCnt>0){
					
				}
				this.setPhy("scooterLead");
			}else if(this.data.isLie){
				this.setPhy("lieLead");
			}else{
				this.setPhy();
			}
			//cc.log(other.node.name.replace("goods_",""));
		//	cc.log(this.data.nowArms);
		}
		
	},
	displayProp(name,is){//道具名称
		var menu=ALL.menu.getComponent("menu_control");
		var i=0;
		for(i=0;i<menu.itemList.length&&menu.itemList[i].name==name;i++);
		var node=i<menu.itemList.length?menu.itemList[i]:null;
		this.data.gotProp[name]=is;
		if(node)
			node.SpriteFrame=ALL.GamePropFrame[is?name:"withoutIco"];
    },
	getAttackFp:function(){
		if(this.data.key_up&&!this.data.isLie&&!this.data.isFall&&
			LEADDATA["ARMS"]["attackUp"].indexOf(this.data.nowArms)!=-1){//可以向上发射的武器包含了当前武器
			return "Up";
		}
		return "";
	},
	setPhy:function(man="Lead"){
		if(this.data.state[2]!=man){
			this.data.state[2]=man;
			var arm=LEADDATA.ARMS.changePhyArm[man];
			if(arm&&this.data.armColl[arm]){
				this.data.armColl[arm].die();
				delete this.data.armColl[arm];
			}
			if(LEADDATA.ARMS.indList[man].indexOf(this.data.nowArms)==-1){
				this.setArm(LEADDATA.ARMS.indList[man][0]);
			}
			if(this.data.state[2]=="umbrellaLead"){
				if(this.data.collWaterCnt<=0)
					this.newArm();
			}else{
				if(this.data.state[2]=="scooterLead"){
					this.newArm();
				}
				var sz=LEADDATA.PhysicalPara.size[man];
				var off=LEADDATA.PhysicalPara.offset[man];
				if(this.phyColl.size.height<sz.y)
					this.node.y=this.borderY(-1)-off.y+sz.y/2-1;
				this.phyColl.size.width=sz.x;
				this.phyColl.size.height=sz.y;
				this.phyColl.friction=man in LEADDATA.PhysicalPara.friction?LEADDATA.PhysicalPara.friction[man]:LEADDATA.PhysicalPara.friction.other;
				this.phyColl.offset=cc.v2(off.x,off.y);
				var h=man.indexOf("lie")==-1?sz.y:LEADDATA.PhysicalPara.size["Lead"].y;
				this.head.offset.y=(h-this.head.size.height)/2+1;
				//要根据下边界调整y的位置，否则改变碰撞盒子的offset会导致碰撞体下移。
				this.phyColl.apply();
			}
		}
	},
	die:function(){
		// newLife.spriteFrame=this.img_false;
	},
	setArm:function(arm){
		if(this.data.nowArms!=arm){
		//	cc.log(this.data.armColl[this.data.nowArms]);
			this.delArm();
			if(this.data.state[0]=="water"){
				if(LEADDATA.ARMS.attackWater.indexOf(arm)!=-1){
					this.data.nowArms=arm;
					this.data.isAttackAct=false;//
					this.data.canAttack=true;//
					this.unschedule(this.callbackAttackFun);//取消攻击计时器
					return true;
				}
				return false;
			}else{
				this.data.nowArms=arm;
				this.data.isAttackAct=false;//
				this.data.canAttack=true;//
				this.unschedule(this.callbackAttackFun);//取消攻击计时器
				return true;
			}
		}
		return false;
	},
	setIsLie:function(){
		if((this.data.key_down ||this.data.collCeilCnt>0)&&this.data.collFloorCnt>0&&this.data.state[2].indexOf("Lead")!=-1){
			if(this.data.climbOb[1]==null&&this.data.nowArms!="scooter"){
				return true;
			}else if(this.data.climbOb[1]&&this.data.collFloorCnt>1){
				return true;
			}
		}
		return false;
	},
	judgeJumpScene:function(){
		if(this.data.key_up){
			var ch=ALL.jumpScenesList;
			for(var i=0;i<ch.length;i++){
				if(Math.abs(this.node.x-ch[i].x)<ch[i].width/2&&Math.abs(this.node.y-ch[i].y)<ch[i].height/2){
					//携带信息
					ALL.SaveLead=cc.instantiate(this.node);
					cc.director.loadScene(ch[i].name)//ch[i].name是要切换场景的名称
					return true;
				}
			}
		}
		return false;
	},
	judgeClimb:function(speed){
		if(this.data.isClimb){
			if(this.data.state[2].indexOf("Lead")==-1||this.data.climbOb[0]==null||this.data.key_jump||(this.data.collFloorCnt>0&&this.data.key_down)){
				this.data.isClimb=false;
			}else{
				speed.x=0;
				this.node.x=this.data.climbOb[0].x;
				if(this.data.key_up){
					speed.y=140;
				}else if(this.data.key_down){
					speed.y=-140;
				}else{
					speed.y=0;
				}
			}
		}else if(this.data.state[2].indexOf("Lead")!=-1&&this.data.climbOb[0]&&Math.abs(this.node.x-this.data.climbOb[0].x)<5
			&&(this.data.climbOb[0].y>this.node.y&&this.data.key_up||this.data.climbOb[0].y<this.node.y&&this.data.key_down)){
			this.data.isClimb=true;
			/*if(Math.abs(this.node.x-this.data.climbOb[0].x)<5&&(this.data.climbOb[0].y>this.node.y&&this.data.key_up||this.data.climbOb[0].y<this.node.y&&this.data.key_down)){
				this.data.isClimb=true;
			}
			if(Math.abs(this.node.x-this.data.climbOb[0].x)>=5&&this.data.climbOb[0].y<this.node.y&&this.data.key_down){
				this.data.isLie=true;
			}*/
		}
	},
	intoWater: function(){
		this.data.state[0]="water";
		if(this.data.state[2]!="Lead"&&this.data.state[2]!="Seadragon"){
			this.delArm();
			this.setPhy("Lead");
		}
	},
	delArm:function(){
		if(this.data.armColl[this.data.nowArms]){
			this.data.armColl[this.data.nowArms].die();
			delete this.data.armColl[this.data.nowArms];
		}
	},
	pause:function(is=true){
		if(is){
			this.data.pause=true;
			this.data.player.pause();
			ALL.menu.active=true;
			cc.director.pause();
			this.resetKey(false);
		}else{
			this.data.pause=false;
			this.data.player.resume();
			ALL.menu.active=false;
			cc.director.resume();
		}
	},
	resetKey:function(is){
		this.data.key_left=is;
		this.data.key_right=is;
	    this.data.key_down=is;
		this.data.key_up=is;
		this.data.key_attack=is;
		this.data.key_acc=is;
		this.data.key_jump=is;
		this.data.key_pause=is;
	},
});

