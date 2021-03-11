cc.Class({
    extends: cc.Component,

    properties: {
		data:null,
		//SchedulerDir:{},
    },
	
    // use this for initialization
    onLoad: function () {
		this.preArms="axe";
		this.scheduleDir={},
		this.coll={
			collFloorCnt:0,
			collFloorDir:{},
			collFloorLavaCnt:0,

			collCeilCnt:0,
			collCeilDir:{},
			collSideCnt:[0,0],//collSideCnt[0]是左
			collSideDir:[{},{}],
			collWaterCnt:0,
			collWaterDir:{},

			collEnemyDir:{},
			collEnemyCnt:0,

			Laddder:[null,null],//0是梯子，1是梯子头
			liftingOb:[null,null],//0举着的物体,1时前面的物体
			willLiftingOb:false,
			collSand:null,
		},
		this.key={
			left:false,
	        right:false,
	        down:false,
	        up:false,
	        attack:false,
	        acc:false,
	        jump:false,
			pause:false,
		},
		this.data={
			throughSences:[],
	        state:["air","walk","Lead"],
			specialEffect:"null",
/*状态，三个代表：第1个代表周围环境，第2个代表人的运动状态：或walk,run ;
第3个代表碰撞体状态有："Lead","lieLead","Fierydragon","Brontosaurus","Pterosaur","Stegosaurus","Seadragon"。
*/			
			isChangingPhy:0,
			isLie:false,
			isFall:false,
			isClimb:false,
			theKeyliftOb:false,
	        act:"walk", //state[2]+"_"+act+"_"+左右是状态。
	        
			canAttack:true,
			isAttackAct:false,//是否处于攻击状态
			scaleReverse:false,
	        //speed: cc.v2(0, 0),
			jumpSpeedy: 0,      //跳跃初始速度
			jumptime:0,
			jumpAidTime:0,
			injuringTime:0,//受到刺和熔浆上海

	        maxSpeedx:0,        //限制的最大速度
			maxSpeedup:0, 		//限制的最大速度
			maxSpeeddown:0,     //限制的最大速度
			selfacc: cc.v2(0,0),//自己的加速度
	        speed: cc.v2(0,0),//自己的速度
			nowArmsCnt:{},
			nowArms:"axe",
			hiddenProp:{},
			armColl:{},
			life:cc.v2(0,0),
			time:cc.v2(0,8),
			pause:false,
			halfHeart:false,

			//以下是宝物和武器是否拥有
			nowStage:6,
			lifeUpJudge:[false,false,false, false,false ,false,false ,false,false],//体力上限是否吃到
			goods:{goods_axe:true,goods_spear:true,},
			potCnt:0,
			potBit:[false,false,false,false,false,false,false,false,false],//哪个瓶子有没有
			keyBit:[false,false,true,false,false,false,false,false,false],//哪个钥匙有没有
			chooseDragon:"",//选择的龙
			isSaveDragon:false,//有没有存包里
    	};
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		
		this.phyColl=this.node.getComponents(cc.PhysicsBoxCollider)[0];//获得碰撞体
		this.head = this.node.getComponents(cc.PhysicsBoxCollider)[1];
		ALL.Lead=this.node;//主角节点
		MainLead=this;//主角节点的脚本
		//this.dataBegin()在其他脚本调用了。
		//cc.log(this.node.x,this.node.position.x);
    },

    onKeyDown (event) {
		//cc.log("h");
		if(this.data.pause)
			return ;
        switch(event.keyCode) {
            case KEY.jump: //1是跳
				this.key.jump=true;
				break;
			case KEY.attack: //2是攻击
				this.key.attack=true;
				this.data.theKeyliftOb=false;
				break;
			case KEY.acc: //3是加速
				this.key.acc=true;
				break;
            case KEY.left:
				this.key.left=true;
                break;
            case KEY.right:
				this.key.right=true;
                break;
            case KEY.up:
                this.key.up=true;
                break;
			case KEY.down:
				this.key.down=true;
				break;
			case KEY.pause:
				this.key.pause=true;
				break;
			case KEY.c:
				this.cheat();
			break;
        }
    },

    onKeyUp (event) {
		if(this.data.pause)
			return ;
        switch(event.keyCode) {
            case KEY.jump: //1是跳
				this.key.jump=false;
				break;
			case KEY.attack: //1是攻击
				this.key.attack=false;
				break;
			case KEY.acc: //3是加速
				this.key.acc=false;
				break;
            case KEY.left:
				this.key.left=false;
                break;
            case KEY.right:
				this.key.right=false;
                break;
            case KEY.up:
				this.key.up=false;
                break;
			case KEY.down:
				this.key.down=false;
				break;
			case KEY.pause:
				this.key.pause=false;
				break;
        }
    },


	update: function (dt) {//dt是距离上一帧的时间间隔
		if(this.data.pause||this.key.pause){
			this.pause(true);
			return ;
		}
		
		this.data.preScaleX=this.node.scaleX;
		this.data.preAct=this.data.act;
		this.data.speed = this.body.linearVelocity;
		var otherSpeed=cc.v2(0,0);
		for(var a in this.coll.collFloorDir){
			otherSpeed=this.coll.collFloorDir[a].getComponent(cc.RigidBody).linearVelocity;
		}
		this.data.relSpeed = cc.v2(this.data.speed.x-otherSpeed.x,this.data.speed.y-otherSpeed.y);
		//cc.log(speed);
		this.updatePhyColl(dt,this.data.speed);//处理人物碰撞
		this.dealKey(dt,this.data.speed);//判断按键状态
		this.dealState(dt,this.data.relSpeed);//处理人物状态和动画切换
		this.updateParameter(dt,this.data.speed);
		this.calSpeed(dt,this.data.speed);
		this.body.linearVelocity = this.data.speed;
    }, 
	    
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(this.data.pause){
			return ;
		}
		var cf=this.collFp(contact);
		var sc=Math.abs(this.data.preScaleX-this.node.scaleX);
		if(self.tag==1){
			if(other.node.name.indexOf("Object")!=-1){
				if(other.name.indexOf("SAND")!=-1&&this.data.speed.y<0){//沙子
					this.intoSand(contact,other);
				}
				if(other.node.name.indexOf("Object2")!=-1&&cf.y!=-1||this.data.isClimb){
					contact.disabled=true;
				}else if(!this.coll.collCeilDir[other._id]){
					this.coll.collCeilDir[other._id]=other;
					this.coll.collCeilCnt++;
				}
				if(this.coll.liftingOb[0]==null&&other.node.name.indexOf("LIFT")!=-1){
					if(other.node.x>this.borderX(-1)&&other.node.x<this.borderX(1)){
						this.putLiftOb(other.node);
					}
				}
			}
			if(other.name.indexOf("WATER")!=-1){
				this.intoWater();
			}
		}else{//self.tag==0
			
			if(other.name.indexOf("WATER")!=-1){
				if(sc<ALL.inf&&!this.coll.collWaterDir[other._id]){
					this.coll.collWaterCnt++;
					this.coll.collWaterDir[other._id]=true;
				}
			}
			if(other.node.name=="Object2_Ladder"){//爬梯子
				this.coll.Laddder[1]=other.node;
			}
			if(other.name.indexOf("jumpAid")!=-1&&other.node.script){//碰到弹跳器
				if(this.body.linearVelocity.y<0&&other.node.script.jumpState){
					other.node.script.jumpState();//在里面实现人物速度，this.data.jumpAidTime=20;
				}
			}
			if(other.node.name.indexOf("Enemy")!=-1){
				if(!this.coll.collEnemyDir[other._id]){
					this.coll.collEnemyDir[other._id]=other;
					this.coll.collEnemyCnt++;
				}
				this.collEnemy(other);
			}else if(other.node.name.indexOf("Object")!=-1){
				if(other.node.name.indexOf("Object2")!=-1&&(cf.y!=-1||this.data.isClimb)){
					contact.disabled=true;
				}else{
					//cc.log(cf);
					if(other.name.indexOf("SAND")!=-1&&this.data.speed.y<0){//沙子
						this.intoSand(contact,other);
					}
					if(cf.y==-1&&!this.coll.collFloorDir[other._id]){
						this.coll.collFloorDir[other._id]=other;
						this.coll.collFloorCnt++;
						this.coll.collFloorLavaCnt+=other.name.indexOf("LAVA")!=-1?1:0;//脚踩熔浆
					}
					if(cf.x==-1&&!this.coll.collSideDir[0][other._id]){
						this.coll.collSideDir[0][other._id]=other;
						this.coll.collSideCnt[0]++;
					}
					if(cf.x==1&&!this.coll.collSideDir[1][other._id]){
						this.coll.collSideDir[1][other._id]=other;
						this.coll.collSideCnt[1]++;
					}
					//this.data.isFall=false;//
				}
				if(this.coll.liftingOb[1]==null&&other.node.name.indexOf("LIFT")!=-1){
					if(this.node.scaleX==Math.sign(other.node.x-this.node.x)&&other.node.y>this.borderY(-1)&&other.node.y<this.borderY(1)){
						this.coll.liftingOb[1]=other.node;
					}
				}
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
				if(this.coll.collCeilDir[other._id]){
					delete this.coll.collCeilDir[other._id];
					this.coll.collCeilCnt--;
				}
				if(this.coll.liftingOb[0]&&other.node.name.indexOf("LIFT")!=-1){
					this.coll.liftingOb[0]=null;
				}

			}
			if(other.name.indexOf("WATER")!=-1){
				if(this.coll.collWaterCnt<1||this.coll.collWaterCnt==1&&this.data.speed.y>0){
					this.data.state[0]="air";
				}
			}
		}else{//self.tag==0
			if(other.name.indexOf("WATER")!=-1){
				if(sc<ALL.inf&&this.coll.collWaterDir[other._id]){
					delete this.coll.collWaterDir[other._id];
					this.coll.collWaterCnt--;
				}
			}
			if(other.node.name=="Object_Ladder"){//爬梯子
				this.coll.Laddder[1]=null;
			}

			if(other.node.name.indexOf("Enemy")!=-1){
				if(this.coll.collEnemyDir[other._id]){
					delete this.coll.collEnemyDir[other._id];
					this.coll.collEnemyCnt--;
				}
			}
			if(other.node.name.indexOf("Object")!=-1){
				if(this.coll.collFloorDir[other._id]){
					delete this.coll.collFloorDir[other._id];
					this.coll.collFloorCnt--;
					this.coll.collFloorLavaCnt-=other.name.indexOf("LAVA")!=-1?1:0;//脚踩熔浆
					if(this.coll.collFloorLavaCnt<0){
						cc.log("this.coll.collFloorLavaCnt错误："+this.coll.collFloorLavaCnt);
					}
				}
				if(other.name.indexOf("SAND")!=-1){//沙子
					this.outSand();
				}
				if(this.coll.collSideDir[0][other._id]){
					delete this.coll.collSideDir[0][other._id];
					this.coll.collSideCnt[0]--;
				}
				if(this.coll.collSideDir[1][other._id]){
					delete this.coll.collSideDir[1][other._id];
					this.coll.collSideCnt[1]--;
				}
				if(this.coll.liftingOb[1]&&other.node.name.indexOf("LIFT")!=-1){
					this.coll.liftingOb[1]=null;
				}
				//this.data.isFall=false;//
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
			if(other.node.name=="Object_Ladder"&&!contact.disabled){//爬梯子
				this.data.isClimb=this.judgeIsClimb();
				if(this.data.isClimb){
					contact.disabled=true;
					this.data.isClimb=true;
				}
			}
			
			if(other.node.name.indexOf("Enemy")!=-1){
				this.collEnemy(other);
			}else if(other.node.name.indexOf("Object")!=-1){
				if(other.node.name.indexOf("Object2")!=-1&&(cf.y!=-1||this.data.isClimb||this.key.down&&this.key.jump)){
					contact.disabled=true;
					if(this.coll.collFloorDir[other._id]){
						delete this.coll.collFloorDir[other._id];
						this.coll.collFloorCnt--;
					}
				}else{
					if(other.name.indexOf("SAND")!=-1&&this.data.speed.y<0){//沙子
						this.intoSand(contact,other);
					}
					if(cf.y==-1&&!this.coll.collFloorDir[other._id]){
						this.coll.collFloorDir[other._id]=other;
						this.coll.collFloorCnt++;
						this.coll.collFloorLavaCnt+=other.name.indexOf("LAVA")!=-1?1:0;//脚踩熔浆
					}
					if(cf.x==-1&&!this.coll.collSideDir[0][other._id]){
						this.coll.collSideDir[0][other._id]=other;
						this.coll.collSideCnt[0]++;
					}
					if(cf.x==1&&!this.coll.collSideDir[1][other._id]){
						this.coll.collSideDir[1][other._id]=other;
						this.coll.collSideCnt[1]++;
					}
					//this.data.isFall=false;//
				}
			}
		}
	}, 
	
	onCollisionEnter: function (other, self){
		if(this.data.pause)
			return ;
		if(other.node.name.indexOf("Ladder")!=-1){
			this.coll.Laddder[0]=other.node;
		}else if(other.node.name.indexOf("goods")!=-1){
			this.useGoods(other.node.name.replace("goods_",""));
		}
	},
	onCollisionExit: function (other, self){
		if(this.data.pause)
			return ;
		if(other.node.name.indexOf("Ladder")!=-1){
			this.coll.Laddder[0]=null;
		}
	},
	dataBegin:function(){//初始化人物信息
		var an=this.node.getComponent(cc.Animation);
		for(var i=0;i<ALL.RES.LeadAnim.length;i++){
			an.addClip(ALL.RES.LeadAnim[i]);
		}
		if(SAVE.SaveLead_data!=null){//从上一个场景而来
			this.changeLife(SAVE.SaveLead_data.life.x,SAVE.SaveLead_data.life.y);
			this.changeTime(SAVE.SaveLead_data.time.x);
			ALL.MainCanSc.usingArm.getComponent(cc.Sprite).spriteFrame=ALL.RES.GamePropFrame["goods_"+this.data.nowArms];
			//以上是初始化人物界面
			this.data=SAVE.SaveLead_data;
			this.data.specialEffect="null";
			var find=ALL.MainCanSc.findChildren;
			var p=SAVE.LeadBegin.targetPos;
			try{
				if(SAVE.LeadBegin.targetPos==null){
					p=find(find(find(ALL.jumpSenceDoor,SAVE.preDoor.kind),SAVE.preDoor.tag),SAVE.preSence);
				}
			}catch(ex){
				cc.log(ex);
			}
			this.setHalfHeart();
			//cc.log(p);
			this.node.setPosition(cc.v2(p.x+SAVE.LeadBegin.saveDeviation.x,p.y+SAVE.LeadBegin.saveDeviation.y));
			ALL.CamNode.getComponent("camera_control").setCameraPos(this.node.position);
			SAVE.SaveLead_data=null;
			this.setPhy(this.data.state[2],true);
			this.setScaleX(SAVE.LeadBegin.scaleX);
			this.body.linearVelocity = this.data.speed;
			if(this.data.speed.y>0&&this.data.speed.y<810&&SAVE.LeadBegin.saveDeviation.y>0&&this.data.state[2]!="Pterosaur"){//如果是从下往上

				this.body.linearVelocity=cc.v2(this.data.speed.x,810);
				this.data.jumptime=1;
				//cc.log(this.data.jumptime);
			}
		}else{
			this.changeLife(8,8);
			this.changeTime(5);
			this.setHalfHeart();
			ALL.MainCanSc.usingArm.getComponent(cc.Sprite).spriteFrame=ALL.RES.GamePropFrame["goods_"+this.data.nowArms];
			//以上是初始化人物界面


			this.data.maxSpeedx=LEADDATA.MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
			this.data.maxSpeedup=LEADDATA.MaxSpeedKind[this.data.state[0]]["up"];
			this.data.maxSpeeddown=LEADDATA.MaxSpeedKind[this.data.state[0]]["down"];
			this.data.jumpSpeedy=LEADDATA.BeginSpeedKind[this.data.state[0]]["jump"];
			this.setPhy();
		}
		ALL.menuSc.init();
		var nowDraw=this.data.state[2]+"_"+this.data.act;
		this.player.play(nowDraw);
		this.data.preDraw=nowDraw;

	},
	updatePhyColl:function(dt,speed){
		//cc.log(this.phyColl);
		
		if(this.coll.liftingOb[0]){//有物体
			this.setLiftOb();
			if(this.data.state[2]=="Lead"){//是自身就变成“举”的动作
				this.setPhy("liftLead");
			}
		}else{//没物体
			if(this.data.state[2]=="liftLead"){//是“举”的动作，但是却没物体
				this.setPhy();
			}
		}
		if(this.data.isLie){//判断碰撞体形状
			this.setPhy("lieLead");
		}else if(this.data.isClimb||this.data.isFall||this.data.preisLie!=this.data.isLie){
			this.setPhy();
		}else if(this.data.preisLie!=this.data.isLie){//上一帧和当前帧的isLie不同
			
		}
	},
	dealKey:function (dt,speed){//处理按键
		//this.data.maxSpeedx=MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//this.data.maxSpeedup=MaxSpeedKind[this.data.state[0]]["up"];
		//this.data.maxSpeeddown=MaxSpeedKind[this.data.state[0]]["down"];
		//this.data.jumpSpeedy=BeginSpeedKind[this.data.state[0]]["jump"];
		this.calcClimb(speed);
		this.data.preisLie=this.data.isLie;
		this.data.isLie=this.judgeIsLie();
		//cc.log(this.data.isLie);
		if(this.data.state[0].indexOf("air")!=-1){
			var maxJumptime=9;
			if(this.data.jumpAidTime>0){
				this.data.jumpAidTime--;
				speed.y=this.data.jumpSpeedy*2;
			}else if(this.key.attack&&this.coll.collWaterCnt>0&&this.data.state[2]=="umbrellaLead"){
				speed.y=0;
			}else if(this.key.jump&&!this.data.isLie&&!this.key.down){//按了跳跃还没有趴着
				if(this.data.act=="climb"&&this.coll.Laddder[1]&&this.coll.Laddder[0]){
					speed.y=this.data.jumpSpeedy;
				}else if(this.coll.collSand&&speed.y<ALL.inf){//则就挑起.或者在流沙里,比飞龙优先
					speed.y=this.data.jumpSpeedy;	//cc.log(this.coll.collSand&&speed.y>0,this.coll.collFloorCnt);
					this.data.jumptime=4;
				}else if(this.data.state[2].indexOf("Pterosaur")!=-1){
					//cc.log(this.coll.collCeilCnt,speed.y);
					if(this.coll.collCeilCnt==0){
						speed.y=this.data.jumpSpeedy/2;
					}else{
						speed.y=0;
					}
				}else if(this.coll.collFloorCnt>0){//如果在地面上，且 按了跳跃则就挑起
					speed.y=this.data.jumpSpeedy;	//cc.log(this.coll.collSand&&speed.y>0,this.coll.collFloorCnt);
					this.data.jumptime=1;
				}else if(this.data.jumptime>0&&this.data.jumptime<maxJumptime){//如果不在地面上且还按了跳跃且之前几帧按过跳跃可以“大跳”
					this.data.jumptime++;
					if(this.data.jumptime<maxJumptime/2){
						speed.y=this.data.jumpSpeedy;
					}else if(this.data.jumptime<maxJumptime){
						speed.y=this.data.jumpSpeedy*(1+this.data.jumptime/(maxJumptime*2));//期初几秒加速
					}
				}else if(this.data.preDraw.indexOf("swim")!=-1){//从水里跳出来，且 按了跳跃，则就挑起，但高度低
					this.data.jumptime=maxJumptime/2;
					speed.y=this.data.jumpSpeedy;
				}
			}else{
				this.data.jumptime=0;
			}
			
			if(this.data.state[2]=="Pterosaur"&&this.coll.collFloorCnt>0){//是飞龙且在地面上不可以加速
				this.data.state[1]="walk";
			}else if(this.key.acc){//按了加速
				this.data.state[1]="run";
			}else if(!this.key.acc){
				this.data.state[1]="walk";
			}
		}else if(this.data.state[0].indexOf("water")!=-1){
			this.data.jumptime=0;
			if(this.key.jump&&!this.data.isLie&&!this.key.down){//按了跳跃还没有趴着
				speed.y=this.data.jumpSpeedy;
			}
			if(this.key.acc){//按了加速
				this.data.state[1]="run";
			}else{
				this.data.state[1]="walk";
			}
		}
		
		
		var keyFp=0;
		if(this.key.left&&this.key.right==false){//左边
			keyFp=-1;
		}else if(this.key.left==false&&this.key.right){//右边
			keyFp=1;
		}
		var leadAcc=LEADDATA.BeginAccKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		this.data.maxSpeedx=LEADDATA.MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//cc.log(this.data.maxSpeedx);
		this.data.maxSpeedup=LEADDATA.MaxSpeedKind[this.data.state[0]]["up"];
		this.data.maxSpeeddown=LEADDATA.MaxSpeedKind[this.data.state[0]]["down"];
		this.data.jumpSpeedy=LEADDATA.BeginSpeedKind[this.data.state[0]]["jump"];

		if(this.coll.collSand&&this.data.state[2]!='Stegosaurus'){//在沙子里
			this.data.maxSpeeddown=30;
			this.data.maxSpeedx=LEADDATA.MaxSpeedKind[this.data.state[0]]["walk"][this.data.state[2]];
			this.data.jumpSpeedy=80;
		}else if(this.data.state[2]=="Pterosaur"){//是飞龙下降速度减慢
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
		}else if(this.data.nowArms=="spear"){//拿了毛并且攻击了
			var arm=this.data.armColl[this.data.nowArms];
			if(!this.data.isLie&&arm&&arm.collWood){
				leadAcc=0;
				var wood=arm.collWood.node;
				var woodBody=wood.getComponent(cc.RigidBody);
				if(wood.angle==0){
					speed.x=woodBody.linearVelocity.x;
				}else if(wood.angle==90||wood.angle==270){
					speed.x=woodBody.linearVelocity.x;
					speed.y=woodBody.linearVelocity.y;
				}
			}else if(arm&&!arm.collWood&&arm.protecting==false){
				arm.die();
			}
		}
		
		if(this.coll.collFloorCnt==0&&(this.coll.collSideCnt[0]>0&&keyFp==-1||this.coll.collSideCnt[1]>0&&keyFp==1||this.data.act=="climb")){
			this.data.selfacc.x=0;
		}else if(keyFp!=0){//左右运动
			this.setScaleX(keyFp);
			
			this.data.selfacc.x=keyFp*leadAcc*(keyFp==Math.sign(speed.x)?1:0.8);//加速度方向和脸的方向一样。
		}else{
			this.data.selfacc.x=0;
		}
	},
	dealState: function (dt,speed){//改变人物状态:act

	/*	if((this.data.act!="walk"||this.data.act!="run")&&this.coll.collFloorCnt>0){
			this.data.
		}*/
		if(this.data.scaleReverse){//特判人物方向改变的时点，避免转身时候闪一帧跳跃动画
			this.data.scaleReverse=false;
			return;
		}

		//处理碰撞敌人
		//
		for(var en in this.coll.collEnemyDir){
			this.collEnemy(this.coll.collEnemyDir[en]);
		}


		if(this.judgeJumpScene()){
			return;
		}else if(this.data.injuringTime>0){//判断落入刺和熔浆被打
			this.data.act="injuring";
			this.data.injuringTime--;
		}else if(this.judgeAttack()){//返回是否处在攻击动作
		}else if(this.data.state[0].indexOf("air")!=-1){
			if(this.coll.collWaterCnt>0&&this.key.attack&&this.data.state[0]=="air"){//举着伞按了攻击
				this.data.act="float";
			}else if(this.data.isClimb){
				//cc.log(this.node.scaleX);
				var x=Math.abs(Math.ceil(this.node.x/20))%2;
				var y=Math.abs(Math.ceil(this.node.y/30))%2;
				this.setScaleX((x+y==1?1:-1));
				this.data.act="climb";
			}else if(this.data.isLie){
				if(Math.abs(speed.x)<10){//在地板上,判断速度
					this.data.act="walk";
				}else{
					this.data.act="run";
				}
			}else if(this.coll.collFloorCnt<1&&!this.coll.collSand||this.coll.collSand&&speed.y>0){//没在地板上或者在流沙里就跳
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
				var x=Math.abs(Math.ceil(this.node.x/20))%2;
				var y=Math.abs(Math.ceil(this.node.y/30))%2;
				this.setScaleX((x+y==1?1:-1));
				this.data.act="climb";
			}else if(this.coll.collFloorCnt<=0){//没在地板上就跳
				this.data.act="swim";
			}else if(Math.abs(speed.x)<100){//在地板上,判断速度
				this.data.act="walk";
			}else{
				this.data.act="run";
			}
		}

		if(this.coll.collFloorLavaCnt>0&&this.data.state[2]=="Fierydragon"){
			this.data.act+="_lava";
		}
		//以上是改变this.data.act
		
		var nowDraw=this.data.state[2]+"_"+this.data.act;
        if(this.data.preDraw!=nowDraw){
            this.data.preDraw=nowDraw;
            this.player.play(nowDraw);
        }
	},
	
	updateParameter:function(dt,speed){
		if(this.data.isClimb||(this.data.state[2]=="umbrellaLead"&&this.key.attack&&this.coll.collWaterCnt>0)){//举着伞按了攻击
			this.body.gravityScale=0;
		}else if(this.data.state[2].indexOf("Pterosaur")!=-1){//是飞龙
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"]/4;
		}else if(this.data.state[2]=="umbrellaLead"&&speed.y<-1){//向下运动且举着雨伞，则中立减半
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"]/8;
		}else if(this.data.nowArms=="spear"&&!this.data.isLie&&this.data.armColl[this.data.nowArms]&&this.data.armColl[this.data.nowArms].collWood){
			this.body.gravityScale=0;
		}else{
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"];
		}
		this.body.linearDamping=LEADDATA.PhysicalPara[this.data.state[0]]["linearDamping"];
		if(this.coll.collSand&&this.data.state[2]!='Stegosaurus'){
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"]/8;
			this.body.linearDamping*=2;
		}
	},
	calSpeed: function(dt,speed){
		var nextx=speed.x+this.data.selfacc.x* dt;
		
		if(Math.abs(nextx) < this.data.maxSpeedx||Math.abs(nextx) < Math.abs(speed.x)){
			speed.x=nextx;
		}
		speed.y+=this.data.selfacc.y* dt;
		if(speed.y<0&&-speed.y> this.data.maxSpeeddown){
			speed.y=-this.data.maxSpeeddown;
		}
		if(Math.abs(speed.x)<1&&this.data.selfacc.x<5){//控制精度
			speed.x=0;
		}
		if(this.coll.collSideDir[1]){
			//cc.log(this.coll.collSideDir[1]);
		}
	},

	collEnemy:function(other){
		var ep=other.node.getComponent("EnemyPublic");
		if(ep==null){
			cc.log("公用怪物脚本丢失");
			return;
		}
		if(this.data.specialEffect=="null"){
			
			if(ep.specialEffect=="null"){
				if(this.data.state[2]=="Stegosaurus"&&this.data.act.indexOf("attack")!=-1){//是剑龙攻击     
					ep.changeLife(-LEADDATA.DAM["Stegosaurus"],"Stegosaurus");//怪物掉血，剑龙攻击成功
				}else if(this.data.state[2]=="scooterLead"){
					
				}else{
					this.speed=this.body.linearVelocity;
					this.speed.x=300*(this.node.x>other.node.x?1:-1)
					this.body.linearVelocity=this.speed;
					if(this.data.specialEffect=="null"){//主角本人状态正常
						if(this.data.state[2].indexOf("Lead")!=-1){//是主角本人则掉血
							if(other.node.name.indexOf("specialStone")!=-1){//是specialStone掉时间
								//this.setPhy();//改变碰撞体在update里
								if(this.data.isFall==false){
									this.data.isFall=true;
									this.data.specialEffect="twinkle";
									var count = 0;
									this.callbackCollSpecialStone = function(){
										if(count === 20) {
											this.node.opacity=255;
											this.data.specialEffect="null";
											this.data.isFall=false;
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
							//cc.log();
							this.changeLife(0,0);
							ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
							ep.attackedDie();
							this.setPhy();
						}
					}
				}
			}else if(ep.specialEffect=="twinkle"){
				
			}else if(ep.specialEffect=="invincible"){
				if(this.data.state[2]=="Fierydragon"&&(ep.category=="lava"||other.node.name.indexOf("LAVA")!=-1)){//是喷火龙
					//喷火龙碰到岩浆什么都不做
				}else{
					this.speed=this.body.linearVelocity;
					this.speed.x=300*(this.node.x>other.node.x?1:-1)
					if(this.speed.y<0&&(ep.category=="lava"||ep.category=="stab")){
						this.speed.y=300;
						this.data.injuringTime=20;
					}
					this.body.linearVelocity=this.speed;
					if(this.data.state[2].indexOf("Lead")!=-1&&this.data.specialEffect=="null"){//是主角本人则掉血
						this.changeLife(-ep.damage,0);//主角掉血
					}else if(this.data.state[2].indexOf("Lead")==-1&&this.data.specialEffect=="null"){
						this.changeLife(0,0);
						ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
						ep.attackedDie();
						this.setPhy();
					}
				}
			}
		}
	},
	
	setHalfHeart:function(change=false){
		if(change){
			if(this.data.halfHeart){
				ALL.MainCanSc.halfHeart.getComponent(cc.Sprite).spriteFrame= null;
				this.changeLife(0,1);
			}else{
				ALL.MainCanSc.halfHeart.getComponent(cc.Sprite).spriteFrame= ALL.RES.GamePropFrame["halfHeart2"];
			}
			this.data.halfHeart=!this.data.halfHeart;
		}else{
			ALL.MainCanSc.halfHeart.getComponent(cc.Sprite).spriteFrame=this.data.halfHeart?ALL.RES.GamePropFrame["halfHeart2"]:null;
		}
	},
	changeLife: function(chLife,chLifeUp=0){//改变体力和体力上限
		var child = ALL.MainCanSc.lifeGroup.getChildren();
		var i=child.length;
		while(chLifeUp>0&&this.data.life.y<LEADDATA.LIFE.up){//加一个上限
			let newLife = new cc.Node();
			newLife.addComponent(cc.Sprite);
			var X=-ALL.MainCanSc.lifeGroup.width/2+(i++)*90;
            newLife.setPosition(X,0);
			newLife.getComponent(cc.Sprite).spriteFrame =  ALL.RES.GamePropFrame["life_false"];
            ALL.MainCanSc.lifeGroup.addChild(newLife);
			chLifeUp--;this.data.life.y++;
		}
		if(chLife>0){
			var cnt=Math.min(chLife,this.data.life.y-this.data.life.x);//要回复几滴血
			var X=this.data.life.x;//初始血量位置
			this.data.life.x+=cnt;//数值上的回血
			for(var i=X;i<X+cnt;i++){
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.RES.GamePropFrame["life_true"];
			}
		}else if(chLife<0){
			var cnt=Math.min(-chLife,this.data.life.x);//掉几滴血
			var X=this.data.life.x;//初始血量
			this.data.life.x-=cnt;//数值上的扣血
			for(var i=X-1;i>=X-cnt;i--){
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.RES.GamePropFrame["life_false"];
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
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.RES.GamePropFrame["time_true"];
			}
		}else{
			var cnt=Math.min(-chTime,this.data.time.x);//掉几时间
			var X=this.data.time.x;//初始时间
			this.data.time.x-=cnt;//数值上的扣时间
			for(var i=X-1;i>=X-cnt;i--){
				child[i].getComponent(cc.Sprite).spriteFrame = ALL.RES.GamePropFrame["time_false"];
			}
			if(this.data.time.x==0){
				this.changeLife(-1);
				this.changeTime(8);
			}
		}
	},
	newArm:function(){//用来加载一个新武器
		var newarm=null;
        if(this.data.nowArms=="axe"){
			newarm=cc.instantiate(ALL.RES.FAB["Arm_axe"]);
			this.data.armColl[this.data.nowArms]=newarm;
			newarm.getComponent("Arm_axe").init(cc.v2(800*(this.node.scaleX>0?1:-1),150));
			var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
			var armY=this.node.y+(this.data.isLie?0:newarm.height/2);
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
        }else if(this.data.nowArms=="fireDarts"){
			newarm=cc.instantiate(ALL.RES.FAB["Arm_fireDarts"]);
			this.data.armColl[this.data.nowArms]=newarm;
			newarm.getComponent("Arm_fireDarts").init(cc.v2(1000*(this.node.scaleX>0?1:-1),130));
			var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
			var armY=this.node.y+(this.data.isLie?0:newarm.height/2);
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
        }else if(this.data.nowArms=="DragonFire"){
			newarm=cc.instantiate(ALL.RES.FAB["Arm_DragonFire"]);
			this.data.armColl[this.data.nowArms]=newarm;
			var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
			var armY=this.node.y+this.phyColl.offset.y+10;
			newarm.getComponent("Arm_DragonFire").init(cc.v2(800*(this.node.scaleX>0?1:-1),0),cc.v2(armX,armY));
			newarm.setPosition(armX,armY); 
			this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="DragonBattery"){
			newarm=cc.instantiate(ALL.RES.FAB["Arm_DragonBattery"]);
			this.data.armColl[this.data.nowArms]=newarm;
			var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
			var armY=this.node.y+this.phyColl.offset.y+(newarm.height-this.phyColl.size.height)/2;
			newarm.getComponent("Arm_DragonBattery").init(cc.v2(800*(this.node.scaleX>0?1:-1),0),cc.v2(armX,armY));
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="DragonSto"){
			newarm=cc.instantiate(ALL.RES.FAB["Arm_DragonSto"]);
			this.data.armColl[this.data.nowArms]=newarm;
			var armX=this.node.x+this.phyColl.size.width/2*(this.node.scaleX>0?1:-1);
			var armY=this.node.y-this.phyColl.size.height/2;
			newarm.getComponent("Arm_DragonSto").init(cc.v2(100*(this.node.scaleX>0?1:-1),Math.min(this.body.linearVelocity.y-100,0)),cc.v2(armX,armY));
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="Stegosaurus"){
			this.data.nowArmsCnt[this.data.nowArms]=0;
		}else if(this.data.nowArms=="waterGun"){
			this.scheduleDir[this.data.nowArms] = function(){//前摇时间0.2
				var newarm=cc.instantiate(ALL.RES.FAB["Arm_waterGun"]);
				this.data.armColl[this.data.nowArms]=newarm;
				newarm.getComponent("Arm_waterGun").init(cc.v2(500*(this.node.scaleX>0?1:-1),50));
				var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
				var armY=this.node.y;
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
				this.data.armColl[this.data.nowArms]=newarm;
				this.unschedule(this.scheduleDir[this.data.nowArms]);
			}
			this.schedule(this.scheduleDir[this.data.nowArms],0.2,0,0);
		}else if(this.data.nowArms=="ham"){
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var cnt=0;
			newarm=cc.instantiate(ALL.RES.FAB["Arm_short"]);
			this.scheduleDir[this.data.nowArms] = function(){//前摇时间0.2
				if(cnt==2){
					var width=this.data.isLie?94:60;
					var off=cc.v2((width+this.phyColl.size.width)/2*ALL.scaleLead.x,LEADDATA.PhysicalPara.offset[this.data.state[2]].y*ALL.scaleLead.y);
					newarm.getComponent("Arm_short").init("ham",off,cc.v2(width,this.phyColl.size.height));
					newarm.setPosition(this.node.x+off.x*(this.node.scaleX>0?1:-1),this.node.y+off.y);
					this.node.parent.addChild(newarm);
					this.data.armColl[this.data.nowArms]=newarm;
				}else if(cnt==attackActCnt){
					this.data.armColl["ham"]&&newarm.die();
					this.unschedule(this.scheduleDir[this.data.nowArms]);
				}
				cnt++;
			}
			this.schedule(this.scheduleDir[this.data.nowArms],0.1,attackActCnt,0);
		}else if(this.data.nowArms=="fire"){
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var cnt=0;
			newarm=cc.instantiate(ALL.RES.FAB["Arm_short"]);
			this.scheduleDir[this.data.nowArms] = function(){//前摇时间0.1
				if(cnt==1){
					var fireWidth=this.data.isLie?100:70;
					var off=cc.v2((fireWidth+this.phyColl.size.width)/2*ALL.scaleLead.x,LEADDATA.PhysicalPara.offset[this.data.state[2]].y*ALL.scaleLead.y);
					newarm.getComponent("Arm_short").init("fire",off,cc.v2(fireWidth,this.phyColl.size.height));
					newarm.setPosition(this.node.x+off.x*(this.node.scaleX>0?1:-1),this.node.y+off.y);
					this.node.parent.addChild(newarm);
					this.data.armColl[this.data.nowArms]=newarm;
				}else if(cnt==attackActCnt){
					this.data.armColl["fire"]&&newarm.die();
					this.unschedule(this.scheduleDir[this.data.nowArms]);
				}
				cnt++;
			}
			this.schedule(this.scheduleDir[this.data.nowArms],0.1,attackActCnt,0);
		}else if(this.data.nowArms=="spear"){
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var cnt=0;
			newarm=cc.instantiate(ALL.RES.FAB["Arm_short"]);
			newarm.protecting=true;
			this.scheduleDir[this.data.nowArms] = function(){//无前摇
				if(!newarm){
					this.unschedule(this.scheduleDir[this.data.nowArms]);
					return;
				}
				if(cnt==0){
					if(this.key.up&&!this.data.isLie){
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
					this.data.armColl[this.data.nowArms]=newarm;

				}else if(cnt==attackActCnt){
					if(this.data.armColl[this.data.nowArms]&&!this.data.armColl[this.data.nowArms].collWood){
						newarm.die();
					}
					newarm.protecting=false;
					this.unschedule(this.scheduleDir[this.data.nowArms]);
				}
				cnt++;
			}
			this.schedule(this.scheduleDir[this.data.nowArms],0.1,attackActCnt,0);
		}else if(this.data.nowArms=="scooter"){
		
			this.data.armColl.scooter=cc.instantiate(ALL.RES.FAB["Arm_short"]);
			var height=2;
			var off=cc.v2(0,-(this.phyColl.size.height+44)/2);
			this.data.armColl.scooter.getComponent("Arm_short").init("scooter",off,cc.v2(this.phyColl.size.width+10,height));
			this.data.armColl.scooter.setPosition(this.node.x+off.x*(this.node.scaleX>0?1:-1),this.node.y+off.y);
			this.node.parent.addChild(this.data.armColl.scooter);
		}else if(this.data.nowArms=="bomb"){
			newarm=cc.instantiate(ALL.RES.FAB["Object_bomb"]);
			this.data.armColl[this.data.nowArms]=newarm;
			var sx=0;
			if(this.key.left){
				sx=-Math.abs(this.body.linearVelocity.x)-100;
			}else if(this.key.right){
				sx=Math.abs(this.body.linearVelocity.x)+100;
			}
			newarm.getComponent("Arm_bomb").init(cc.v2(sx,0));//设置速度
			//cc.log(newarm);
			var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
			var armY=this.node.y+newarm.height/2;
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="boomerang"){
			newarm=cc.instantiate(ALL.RES.FAB["Arm_boomerang"]);
			this.data.armColl[this.data.nowArms]=newarm;
			var fp=(this.node.scaleX>0?1:-1);
			var sx=fp*933;
			if(this.key.up&&!this.data.isLie){//向上打
				newarm.getComponent("Arm_boomerang").init(cc.v2(0,Math.abs(sx)),fp,Math.PI/2+(fp==1?0:Math.PI));//设置速度
			}else{
				newarm.getComponent("Arm_boomerang").init(cc.v2(sx,0),fp,0);//设置速度
			}
			var armY=this.borderY(-1)+(this.data.isLie?newarm.height/2:newarm.height*2);
			var armX=this.node.x+(this.phyColl.size.width+newarm.width)/3*fp;
			
			newarm.setPosition(armX,armY);
			this.node.parent.addChild(newarm);
		}else if(this.data.nowArms=="umbrella"){
			this.data.armColl[this.data.nowArms]=cc.instantiate(ALL.RES.FAB["Arm_short"]);
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
	borderX:function(fp=1){//
		return this.node.x+this.phyColl.offset.x+this.phyColl.size.width/2*fp;
	},
	borderY:function(fp=1){//边界
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
				cc.log("i:"+i,this.borderY(-1)+2-points[i].y,this.coll.collFloorCnt);
			if(points[i].x<this.borderX(-1)+2){		//接触时，获得的是接触前的borderX，borderY
				cnt[0]++;
			}else if(points[i].x>this.borderX(1)-2){
				cnt[1]++;
			}
			if(points[i].y<this.borderY(-1)+0.6){
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
		//cc.log(this.data.nowArmsCnt[this.data.nowArms]);
		if(this.key.attack&&this.data.armColl[this.data.nowArms]&&this.data.armColl[this.data.nowArms].collWood){
			this.data.armColl[this.data.nowArms].die();
		}
		if(this.coll.liftingOb[1]&&this.key.attack&&this.data.theKeyliftOb==false){
			var fp=Math.sign(this.coll.liftingOb[1].x-this.node.x);
			if(fp==-1&&this.key.left||fp==1&&this.key.right){
				this.data.theKeyliftOb=true;
				this.putLiftOb(this.coll.liftingOb[1]);
				this.coll.liftingOb[1]=null;
				return false;
			}
		}else if(this.coll.liftingOb[0]&&this.key.attack&&this.data.theKeyliftOb==false){
			var liftObBody=this.coll.liftingOb[0].getComponent(cc.RigidBody);
			if(liftObBody){
				liftObBody.linearVelocity=cc.v2(400*this.node.scaleX,500);
			}
			this.data.theKeyliftOb=true;
			this.coll.liftingOb[0]=null;
			this.data.act="attack";
			this.data.canAttack=false;
			this.data.isAttackAct=true;
			var attackActCnt=LEADDATA.AttackTime["yes"]["hurl"]*10;
			var sumCnt=LEADDATA.AttackTime["no"]["hurl"]*10+attackActCnt;
			var count=0;
			this.scheduleDir["attackStop"] = function(){
				if(count==attackActCnt){
					this.data.isAttackAct=false;
				}
				if(count==sumCnt){
					this.data.canAttack=true;
					this.unschedule(this.scheduleDir["attackStop"]);
				}
				count++;
			}
			this.schedule(this.scheduleDir["attackStop"],0.1,sumCnt,0);
			return this.data.isAttackAct;
		}else if(this.data.nowArms=="umbrella"){
			if(this.data.state[2]!="umbrellaLead"&&this.key.attack//没举着雨伞 且按了攻击
				&&!this.data.isLie&&!this.data.isClimb&&!this.data.isFall&&this.data.state[0]!="water"){
				this.setPhy("umbrellaLead");
			}else if(this.data.state[2]=="umbrellaLead"&&!this.key.attack){//举着雨伞 且没按攻击
				this.setPhy("Lead");
				this.delArm();
			}
			return false;
		}else if(this.data.nowArms=="spear"){//武器是矛
			var arm=this.data.armColl[this.data.nowArms];
			if(!this.data.isLie&&arm&&arm.collWood){
				var wood=arm.collWood.node;
				if(wood.angle==0&&(this.data.act=="attack_spearUp_wood"||this.data.act=="attack_spearUp")){
					this.data.act="attack"+"_"+this.data.nowArms+"Up"+"_wood";
					var pos=wood.convertToWorldSpaceAR(cc.v2(0,0));
					this.node.y=pos.y-arm.collWood.size.height-this.phyColl.size.height/2;
					wood.isCollLead=true;//把碰撞状态置为true
					return true;
				}else if((wood.angle==90||wood.angle==270)&&(this.data.act=="attack_spear_wood"||this.data.act=="attack_spear")){
					this.data.act="attack"+"_"+this.data.nowArms+"_wood";
					var pos=wood.convertToWorldSpaceAR(cc.v2(0,0));
					var fp=-this.node.scaleX;
					this.node.x=pos.x+fp*arm.collWood.size.width/2+fp*this.phyColl.size.width/2;
					wood.isCollLead=true;//把碰撞状态置为true
					return true;
				}
			}
		}


		if(this.data.isFall||this.data.isClimb||this.data.nowArms=="scooter"){
			return false;
		}
		if(this.data.nowArmsCnt[this.data.nowArms]==undefined){
			this.data.nowArmsCnt[this.data.nowArms]=0;
		}
	
		if(this.key.attack&&this.data.canAttack&&this.data.nowArmsCnt[this.data.nowArms]<LEADDATA.ARMS.maxCnt[this.data.nowArms]){//按了攻击有没处于攻击动作,还没有处于非攻击实践
			this.newArm();
			this.data.act="attack"+"_"+this.data.nowArms+this.getAttackFp();
			this.data.canAttack=false;
			this.data.isAttackAct=true;
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var sumCnt=LEADDATA.AttackTime["no"][this.data.nowArms]*10+attackActCnt;
			var count=0;
			this.scheduleDir["attackStop"] = function(){
				if(count==attackActCnt){
					this.data.isAttackAct=false;
				}
				if(count==sumCnt){
					this.data.canAttack=true;
					this.unschedule(this.scheduleDir["attackStop"]);
				}
				count++;
			}
			this.schedule(this.scheduleDir["attackStop"],0.1,sumCnt,0);
		}
		return this.data.isAttackAct;
	},
	useGoods:function(name){
		var i=0;
		for(i=0;i<LEADDATA.Pets.length&&name.indexOf(LEADDATA.Pets[i])==-1;i++);
		if(i<LEADDATA.Pets.length){//判断是不是骑着龙
			this.data.chooseDragon=LEADDATA.Pets[i];
			this.data.isSaveDragon=false;
			ALL.menuSc.displayDragon();
			this.data.isFall=false;
			this.data.isClimb=false;
			this.data.isLie=false;
			this.setPhy(LEADDATA.Pets[i]);
		}else{
			this.setArm(name);
			if(this.data.state[2].indexOf("Lead")==-1){
				this.setPhy();
			}else if(name=="scooter"){
				if(this.coll.collFloorCnt>0){
					
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
	getGoods:function(name,potId=0){//如果是瓶子，要传入id
		if(name=="pot"){
			var have=this.data.potBit[potId];
            if(have==false){
				this.data.potBit[potId]=true;
				this.data.potCnt++;
				ALL.menuSc.displayPot(this.data.potCnt);
            }
		}else if(this.data.goods[name]!=null){
			this.data.goods[name]=true;
			ALL.menuSc.displayProp(name);
		}
	},
	getAttackFp:function(){
		if(this.key.up&&!this.data.isLie&&!this.data.isFall&&
			LEADDATA["ARMS"]["attackUp"].indexOf(this.data.nowArms)!=-1){//可以向上发射的武器包含了当前武器
			return "Up";
		}
		return "";
	},
	setPhy:function(man="Lead",compel=false){//compel代表是否强制执行
		if(this.data.state[2]!=man||compel){
			this.data.state[2]=man;//唯一设置this.data.state[2]的地方
			var arm=LEADDATA.ARMS.changePhyArm[man];
			if(arm&&this.data.armColl[arm]){
				this.data.armColl[arm].die();
				delete this.data.armColl[arm];
			}
			var lead=LEADDATA.ARMS.indList[man];
			if(lead.indexOf(this.data.nowArms)==-1){
				this.setArm(lead[0]);
			}
			if(this.data.state[2]=="umbrellaLead"){
				if(this.coll.collWaterCnt<=0)
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
				//cc.log();
				this.phyColl.apply();
			}
		}
	},
	die:function(){
		// newLife.spriteFrame=this.img_false;
	},
	setArm:function(arm){
		var sp=ALL.MainCanSc.usingArm.getComponent(cc.Sprite);
		if(this.data.nowArms!=arm){
		//	cc.log(this.data.armColl[this.data.nowArms]);
			this.delArm();
			if(this.data.state[0]=="water"){
				if(LEADDATA.ARMS.attackWater.indexOf(arm)!=-1){
					this.data.nowArms=arm;
					this.data.isAttackAct=false;//
					this.data.canAttack=true;//
					this.unschedule(this.callbackAttackFun);//取消攻击计时器
					sp.spriteFrame=ALL.RES.GamePropFrame["goods_"+arm];
					return true;
				}
				return false;
			}else{
				this.data.nowArms=arm;
				this.data.isAttackAct=false;//
				this.data.canAttack=true;//
				this.unschedule(this.callbackAttackFun);//取消攻击计时器
				sp.spriteFrame=ALL.RES.GamePropFrame["goods_"+arm];
				return true;
			}
		}
		return false;
	},
	judgeIsLie:function(){
		//cc.log(this.coll.collFloorCnt>0)
		if(this.coll.collCeilCnt==1&&this.coll.liftingOb[0]){
			return false;
		}else if((this.key.down ||this.coll.collCeilCnt>0&&this.data.isLie)&&this.coll.collFloorCnt>0&&!this.data.isFall
			&&this.data.state[2].indexOf("Lead")!=-1&&Math.abs(this.data.relSpeed.y)<1){
			if(this.coll.Laddder[1]==null&&this.data.nowArms!="scooter"){
				this.setPhy("lieLead");
				return true;
			}else if(this.coll.Laddder[1]&&(this.coll.Laddder[0]==null||Math.abs(this.node.x-this.coll.Laddder[0].x)>=4)){
				this.setPhy("lieLead");
				return true;
			}
		}else if(this.key.down&&this.coll.collSand){//碰撞了沙子按了下
			if(this.coll.Laddder[1]==null&&this.data.nowArms!="scooter"){
				this.setPhy("lieLead");
				return true;
			}else if(this.coll.Laddder[1]&&(this.coll.Laddder[0]==null||Math.abs(this.node.x-this.coll.Laddder[0].x)>=4)){
				this.setPhy("lieLead");
				return true;
			}
		}
		return false;
	},
	judgeJumpScene:function(){//跳转场景
		if(this.key.up){
			var sc=ALL.scDoor.getChildren();
			for(var j=0;j<sc.length;j++){
				var ch=sc[j].getChildren();
				for(var i=0;i< ch.length;i++){
					var isInDoor=ch[i].isInDoor==undefined||ch[i].isInDoor&&ch[i].isInDoor==true;
					if(Math.abs(this.node.x-ch[i].x)<ch[i].width/2&&Math.abs(this.node.y-ch[i].y)<ch[i].height/2&&isInDoor){
						this.saveData(cc.v2(0,0));
						SAVE.preDoor.kind=ALL.scDoor.name;
						SAVE.preDoor.tag=sc[j].name;
						SAVE.preDoor.name=ch[i].name;
						cc.director.loadScene(ch[i].name)//ch[i].name是要切换场景的名称
						return true;
					}
				}
			}
		}
		var sc=ALL.comScDoor.getChildren();
		for(var j=0;j<sc.length;j++){//preDoorTag
			var ch=sc[j].getChildren();
			for(var i=0;i< ch.length;i++){
				if(Math.abs(this.node.x-ch[i].x)<ch[i].width/2&&Math.abs(this.node.y-ch[i].y)<ch[i].height/2){
					var len=cc.v2(this.node.x-ch[i].x,this.node.y-ch[i].y);
					if(Math.abs(ch[i].x)>ALL.MainCanvas.width/2){
						len.x=(ch[i].width+this.phyColl.size.width)/2*(ch[i].x>0?1:-1);
					}else if(Math.abs(ch[i].y)>ALL.MainCanvas.height/2){
						len.y=(ch[i].height+this.phyColl.size.height)/2*(ch[i].y>0?1:-1);
					}
					this.saveData(len);
					SAVE.preDoor.kind=ALL.comScDoor.name;
					SAVE.preDoor.tag=sc[j].name;
					SAVE.preDoor.name=ch[i].name;
					cc.director.loadScene(ch[i].name)//ch[i].name是要切换场景的名称
					return true;
				}
			}
		}
		return false;
	},
	jumpSence:function(name,pos){//无条件跳转场景
		this.saveData(cc.v2(0,0),pos);
		cc.director.loadScene(name)//ch[i].name是要切换场景的名称
	},
	calcClimb:function(speed){
		var clob=this.coll.Laddder[0];
		if(this.data.isClimb){
			if(this.data.state[2].indexOf("Lead")==-1||clob==null||this.key.jump){
				this.data.isClimb=false;
			}else{
				speed.x=0;
				this.node.x=clob.x;
				if(this.key.up){
					speed.y=140;
				}else if(this.key.down){
					speed.y=-140;
				}else{
					speed.y=0;
				}
			}
		}else{
			this.data.isClimb=this.judgeIsClimb();
		}
	},
	judgeIsClimb:function(){
		var clob=this.coll.Laddder[0];
		if(this.data.state[2]=="Lead"&&clob&&Math.abs(this.node.x-clob.x)<4){
			if((clob.y+clob.height/2>this.borderY(-1)&&this.key.up
				||clob.y-clob.height/2<this.borderY(1)&&this.key.down)){
					return true;
			}else if(this.coll.Laddder[1]!=null&&this.key.down){
				this.node.y-=10;
				return true;
			}
		}
		return false;
	},
	intoWater: function(){
		this.data.state[0]="water";
		if(this.data.state[2].indexOf("Lead")!=-1){
			if(LEADDATA.Pets.indexOf(this.data.chooseDragon)!=-1&&this.data.chooseDragon!="Seadragon"){
				ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
				this.data.isSaveDragon=false;
				ALL.menuSc.displayDragon();
			}
		}else if(this.data.state[2]=="Seadragon"){

		}else{
			this.delArm();
			if(LEADDATA.Pets.indexOf(this.data.chooseDragon)!=-1){
				ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
			}
			this.data.isSaveDragon=false;
			ALL.menuSc.displayDragon();
			this.setPhy();
		}
	},
	outWater: function(){
		this.data.state[0]="air";
	},
	intoSand: function(contact,other){
	
		if(this.data.state[2]!='Stegosaurus'){
			contact.disabled=true;
		}
		this.coll.collSand=other.name.indexOf("TOP")!=-1?null:other;
	},
	outSand: function(){
		this.coll.collSand=null;
	},
	putLiftOb:function(node){
		this.coll.liftingOb[0]=node;
	},
	setLiftOb:function(){
		var h=this.coll.liftingOb[0].getComponent(cc.PhysicsBoxCollider).size.height;
		var c=cc.v2(MainLead.node.x,MainLead.borderY(1)+h/2);
		this.coll.liftingOb[0].x=c.x;
		this.coll.liftingOb[0].y=c.y;
		this.coll.liftingOb[0].script.changeLifted();
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
			this.player.pause();
			ALL.menu.active=true;
			cc.director.pause();
			this.clearSelf();
		}else{
			this.data.pause=false;
			this.player.resume();
			ALL.menu.active=false;
			cc.director.resume();
		}
	},
	setScaleX:function(fp){
		var sc=ALL.scaleLead.x*fp;
		if(sc>0&&this.node.scaleX<0||sc<0&&this.node.scaleX>0){
			this.data.scaleReverse=true;
		}
		this.node.scaleX=sc;
	},
	memsetKey:function(is){
		this.key.left=is;
		this.key.right=is;
	    this.key.down=is;
		this.key.up=is;
		this.key.attack=is;
		this.key.acc=is;
		this.key.jump=is;
		this.key.pause=is;
	},
	clearSelf:function(){
		for(var a in this.scheduleDir){
			this.unschedule(this.scheduleDir[a]);
		}
		for(var a in this.data.armColl){
			this.data.armColl[a].die();
			delete this.data.armColl[a];
		}
		this.memsetKey(false);
		this.data.canAttack=true;
		this.data.isAttackAct=false;
	},
	saveData:function(deviation,targetPos=null){//deviation代表偏移距离
		SAVE.preSence=cc.director.getScene().name;
		this.clearSelf();
		SAVE.LeadBegin.saveDeviation=deviation;
		this.memsetKey(false);
		SAVE.SaveLead_data=cc.instantiate(this.data);
		SAVE.LeadBegin.targetPos=targetPos;
		SAVE.LeadBegin.scaleX=Math.sign(this.node.scaleX);
	},
	saveDragon(){
		if(LEADDATA.Pets.indexOf(this.data.chooseDragon)!=-1&&this.data.state[2]!="lieLead"){
			if(this.data.state[2]==this.data.chooseDragon&&this.data.isSaveDragon==false){//把有的龙存起来
				this.data.isSaveDragon=true;
				ALL.menuSc.displayDragon();
				this.setPhy();
				var sand=this.coll.collSand;
			//	cc.log(ALL.MainCanSc.getBorderY(sand,1),this.borderY(-1));
				if(sand&&ALL.MainCanSc.getBorderY(sand,1)<this.borderY(-1)){
					this.outSand();
				}
			}else if(this.data.state[2]!=this.data.chooseDragon&&this.data.isSaveDragon==true){//召唤龙
				this.data.isSaveDragon=false;
				ALL.menuSc.displayDragon();
				this.useGoods(this.data.chooseDragon);
			}
		}
	},
	cheat(){
        for(var name in ALL.menuSc.goodsNodeDir){
            this.data.goods[name]=true;//测试用的
			ALL.menuSc.displayProp(name);
			this.data.isSaveDragon=false;
			ALL.menuSc.displayDragon();
			this.useGoods("Pterosaur");
        }
        
    }
});
