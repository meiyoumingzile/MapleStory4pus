cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
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
			collCeilCnt:0,
			isLie:false,
			isFall:false,
			isClimb:false,
			climbOb:[null,null],//0是梯子，1是梯子头
	        act:"walk", //state[2]+"_"+act+"_"+左右是状态。
			
	        player:null,
			img:cc.SpriteFrame,
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

	        leadCollSize:cc.v2(0,0),//人物站立碰撞体大小
			nowArmsCnt:0,
			nowArms:"axe",
			life:cc.v2(0,0),
			time:cc.v2(0,8),
    	};
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		this.data.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.coll=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		
		this.phyColl=this.node.getComponents(cc.PhysicsBoxCollider)[0];//获得碰撞体
		this.foot = this.node.getComponents(cc.PhysicsBoxCollider)[1];
		this.head = this.node.getComponents(cc.PhysicsBoxCollider)[2];
    },

    onKeyDown (event) {
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
        }
    },

    onKeyUp (event) {
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
				this.node.scaleX=-ALL.scaleLead.x;
				this.data.key_left=false;
                break;
            case KEY.right:
				this.node.scaleX=ALL.scaleLead.x;
				this.data.key_right=false;
                break;
            case KEY.up:
                this.data.key_up=false;
                break;
			case KEY.down:
				this.data.key_down=false;
                break;
        }
    },


    update: function (dt) {//dt是距离上一帧的时间间隔
        var speed = this.body.linearVelocity;
		this.dealKey(dt,speed);//判断按键状态
		this.dealState(dt,speed);//处理人物状态和动画切换
		this.updateParameter(dt,speed);
		this.calSpeed(dt,speed);
        this.body.linearVelocity = speed;
    }, 
	    
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		var worldManifold = contact.getWorldManifold();
		var points = worldManifold.points;
		if(self.tag==1){
			if(other.node.name.indexOf("Object")!=-1){
				this.data.collFloorCnt++;
			}
		}else if(self.tag==2){
			if(other.node.name.indexOf("Object")!=-1){
				this.data.collCeilCnt++;
			}
		}else{//self.tag==0
			if(other.node.name=="Object_Ladder"){//爬梯子
				this.data.climbOb[1]=other.node;
				if(this.data.key_down||this.data.isClimb){
					contact.disabled=true;
				}
			}
			if(other.node.name.indexOf("Enemy")!=-1){
				this.collEnemy(contact, self, other);
			}else if(other.node.name.indexOf("Object")!=-1){
				this.data.isFall=false;//
			}
		}
		
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
		var worldManifold = contact.getWorldManifold();
		var points = worldManifold.points;
		if(self.tag==1){
			if(other.node.name.indexOf("Object")!=-1){
				this.data.collFloorCnt--;
			}
		}else if(self.tag==2){
			if(other.node.name.indexOf("Object")!=-1){
				this.data.collCeilCnt--;
			}
		}else{//self.tag==0
			if(other.node.name=="Object_Ladder"){//爬梯子
				this.data.climbOb[1]=null;
			}
		}
    },
    onPreSolve: function (contact, self, other) {// 每次处理碰撞体接触逻辑时每一帧都调用
		if(self.tag==1){
			
		}else if(self.tag==2){

		}else{//self.tag==0
			if(other.node.name=="Object_Ladder"){//爬梯子
				if(this.data.key_down||this.data.isClimb){
					contact.disabled=true;
					this.data.isClimb=true;
				}
			}
			if(other.node.name.indexOf("Enemy")!=-1){
				this.collEnemy(contact, self, other);
			}
		}
    }, 
    onPostSolve: function (contact, self, other) {// 每次处理完碰撞体接触逻辑时被调用
	
    },  
	onCollisionEnter: function (other, self){
		if(other.name.indexOf("WATER")!=-1){
			this.data.state[0]="water";
			if(this.data.state[2]!="Lead"&&this.data.state[2]!="Seadragon"){
				this.setPhy("Lead");
			}
		}else if(other.node.name.indexOf("Ladder")!=-1){
			this.data.climbOb[0]=other.node;
		}else if(other.node.name.indexOf("goods")!=-1){
			this.getGoods(self, other);
		}
	},
	onCollisionStay: function (other,self){
	},
	onCollisionExit: function (other, self){
		if(other.name.indexOf("WATER")!=-1){
			this.data.state[0]="air";
		}else if(other.node.name.indexOf("Ladder")!=-1){
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
	dealKey:function (dt,speed){//处理按键
		//this.data.maxSpeedx=MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//this.data.maxSpeedup=MaxSpeedKind[this.data.state[0]]["up"];
		//this.data.maxSpeeddown=MaxSpeedKind[this.data.state[0]]["down"];
		//this.data.jumpSpeedy=BeginSpeedKind[this.data.state[0]]["jump"];
		this.judgeClimb(speed);
		this.data.preisLie=this.data.isLie;
		this.data.isLie=(this.data.key_down ||this.data.collCeilCnt>0)&& this.data.collFloorCnt>0 &&this.data.state[2].indexOf("Lead")!=-1&&(this.data.climbOb[1]==null);
		//cc.log(this.data.climbOb==null);
		if(this.data.isLie){//判断碰撞体形状
			this.setPhy("lieLead");
		}else if(this.data.preisLie!=this.data.isLie){//上一帧和当前帧的isLie不同
			this.setPhy("Lead");
		}
		
		this.judgeJumpScene();
		if(this.data.state[0].indexOf("air")!=-1){
			var maxJumptime=8;
			if(this.data.key_jump&&!this.data.isLie){//按了跳跃还没有趴着
				if(this.data.state[2].indexOf("Pterosaur")!=-1){
					speed.y=this.data.jumpSpeedy/2;
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
		
		
		var leadAcc=LEADDATA.BeginAccKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		this.data.maxSpeedx=LEADDATA.MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//cc.log(this.data.maxSpeedx);
		this.data.maxSpeedup=LEADDATA.MaxSpeedKind[this.data.state[0]]["up"];
		this.data.maxSpeeddown=LEADDATA.MaxSpeedKind[this.data.state[0]]["down"];

		if(this.data.state[2].indexOf("Pterosaur")!=-1){//是飞龙
			this.data.maxSpeeddown/=3;
		}
		this.data.jumpSpeedy=LEADDATA.BeginSpeedKind[this.data.state[0]]["jump"];
		if(this.data.key_left&&this.data.key_right==false){//左边
			this.node.scaleX=-ALL.scaleLead.x;
			this.data.selfacc.x=-leadAcc;//加速度方向和脸的方向一样。
		}else if(this.data.key_left==false&&this.data.key_right){//右边
			this.node.scaleX=ALL.scaleLead.x;
			this.data.selfacc.x=leadAcc;
		}else{
			this.data.selfacc.x=0;
		}
		
	},
	dealState: function (dt,speed){//改变人物状态:act
		if(this.judgeAttack()){//返回是否处在攻击动作
		}else if(this.data.state[0].indexOf("air")!=-1){
			if(this.data.isClimb){
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
		if(this.data.isClimb){
			this.body.gravityScale=0;
		}else if(this.data.state[2].indexOf("Pterosaur")!=-1){//是飞龙
			this.body.gravityScale=LEADDATA.PhysicalPara[this.data.state[0]]["gravityScale"]/2;
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

	collEnemy:function(contact, self, other){
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
				}else{
					this.speed=this.body.linearVelocity;
					this.speed.x=300*(this.node.x>other.node.x?1:-1)
					this.body.linearVelocity=this.speed;
					if(this.data.state[2]=="Lead"&&this.data.specialEffect=="null"){//是主角本人则掉血
						if(other.node.name.indexOf("specialStone")!=-1){//是specialStone掉时间
							if(this.data.isFall==false){
								this.data.isFall=true;
								this.data.specialEffect="twinkle";
								var count = 0;
								this.callbackChangeLife = function(){
									if(count === 20) {
										this.node.opacity=255;
										this.data.specialEffect="null";
										this.unschedule(this.callbackChangeLife);
									}else{
										this.node.opacity=count%2*255;
										count++;
									}
								}
								this.schedule(this.callbackChangeLife,0.0500,80,0);
								this.body.linearVelocity=cc.v2(300*(this.node.scaleX>0?1:-1),300);
								this.changeTime(-2);//主角掉时间
							}
						}else{//是普通怪物掉血
							this.data.isFall=false;
							this.changeLife(-ep.damage,0);//主角掉血
						}
					}else if(this.data.state[2]!="Lead"&&this.data.specialEffect=="null"){
						this.changeLife(0,0);
						ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
						ep.die();
						this.setPhy();
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
		this.data.nowArmsCnt++;
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
				this.data.nowArmsCnt=0;
		}else if(this.data.nowArms=="waterGun"){
			this.callbackwaterGun = function(){//前摇时间0.2
				var newarm=cc.instantiate(ALL.FAB["Arm_waterBullet"]);
				newarm.getComponent("Arm_waterBullet").init(cc.v2(500*(this.node.scaleX>0?1:-1),50));
				//cc.log(newarm);
				var armX=this.node.x+this.node.width/2*(this.node.scaleX>0?1:-1);
				var armY=this.node.y;
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
				this.unschedule(this.callbackwaterGun);
			}
			this.schedule(this.callbackwaterGun,0.2,0,0);
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
	judgeAttack:function(){//返回是否处理后面动作。false代表继续处理
		if(this.data.isFall||this.data.isClimb){
			return false;
		}
		if(this.data.key_attack&&this.data.canAttack&&this.data.nowArmsCnt<LEADDATA.ARMS.maxCnt[this.data.nowArms]){//按了攻击有没处于攻击动作,还没有处于非攻击实践
			this.newArm();
			this.data.act="attack"+"_"+this.data.nowArms;
			this.data.canAttack=false;
			this.data.isAttackAct=true;
			var attackActCnt=LEADDATA.AttackTime["yes"][this.data.nowArms]*10;
			var sumCnt=LEADDATA.AttackTime["no"][this.data.nowArms]*10+attackActCnt;
			var count=0;
			this.callbackAttack1 = function(){
				if(count==attackActCnt){
					this.data.isAttackAct=false;
				}
				if(count==sumCnt){
					this.data.canAttack=true;
					this.unschedule(this.callbackAttack1);
				}
				count++;
			}
			this.schedule(this.callbackAttack1,0.1,sumCnt,0);
		}
		return this.data.isAttackAct;
	},
	getGoods:function(self, other){
		var i=0;
		for(i=0;i<this.pets.length&&other.node.name.indexOf(this.pets[i])==-1;i++);
		if(i<this.pets.length){//判断是不是骑着龙
			this.setPhy(this.pets[i]);
			this.changeArm();
		}else{
			this.changeArm(other.node.name.replace("goods_",""));
			cc.log(other.node.name.replace("goods_",""));
			cc.log(this.data.nowArms);
		}
		
	},
	setPhy:function(man="Lead"){
		this.data.state[2]=man;
		var sz=LEADDATA.PhysicalPara.size[man];
		this.phyColl.size.width=sz.x;
		this.phyColl.size.height=sz.y;
		this.phyColl.offset=LEADDATA.PhysicalPara.offset[man];
		this.changeArm(this.data.nowArms);
		
		this.foot.size.width=sz.x;
		this.foot.offset.y=this.phyColl.offset.y-sz.y/2;
		this.phyColl.apply();
	},
	die:function(){
		// newLife.spriteFrame=this.img_false;
	},
	changeArm:function(arm=""){
		var d=LEADDATA.ARMS.indList[this.data.state[2]].indexOf(arm);
		this.data.preArms=this.data.nowArms;
		if(d!=-1){
			this.data.nowArms=arm;
			return true;
		}else{
			this.data.nowArms=LEADDATA.ARMS.indList[this.data.state[2]][0];
			return false;
		}
	},
	judgeJumpScene:function(){
		if(this.data.key_up){
			var ch=ALL.jumpScenesList;
			for(var i=0;i<ch.length;i++){
				if(Math.abs(this.node.x-ch[i].x)<ch[i].width/2&&Math.abs(this.node.y-ch[i].y)<ch[i].height/2){
					//携带信息
					
					cc.director.loadScene(ch[i].name)//ch[i].name是要切换场景的名称
				}
			}
		}
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
		}else if(this.data.state[2].indexOf("Lead")!=-1&&this.data.climbOb[0]&&Math.abs(this.node.x-this.data.climbOb[0].x)<10
			&&(this.data.climbOb[0].y>this.node.y&&this.data.key_up||this.data.climbOb[0].y<this.node.y&&this.data.key_down)){
			this.data.isClimb=true;
		}
		
	},
});

