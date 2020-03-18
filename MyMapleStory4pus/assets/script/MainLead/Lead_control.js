cc.Class({
    extends: cc.Component,

    properties: {
        data:null,
    },
	
    // use this for initialization
    onLoad: function () {
		this.pets=["Fierydragon","Brontosaurus","Pterosaur","Stegosaurus","Seadragon"];
		this.petsArm=["DragonFire","DragonBattery","DragonSto","Stegosaurus","Axe"];
    	
		this.data={
	        state:["air","walk","Lead"],
			specialEffect:"null",
/*状态，三个代表：第1个代表周围环境，第2个代表人的运动状态,第3个代表人的状态是否有坐骑。用来调节速度
*/	
			onFloor:false,
			isLie:false,
	        act:"walk", //state[2]+"_"+act+"_"+左右是状态。
			
	        player:null,
	        img:cc.SpriteFrame,
	        //speed: cc.v2(0, 0),
			jumpSpeedy: 0,      //跳跃初始速度
			jumptime:0,
			attacktime:0,
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
			nowArms:"Axe",
			life:cc.v2(0,0),
			time:cc.v2(0,8),
    	};
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		this.data.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.coll=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
		this.foot = this.findChildNode("foot");
		this.head = this.findChildNode("head");
		this.headScript = this.head.getComponent("LeadHead");
		this.footScript = this.head.getComponent("LeadFoot");
		this.dataBegin();
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
		this.calSpeed(dt,speed);
		this.dealState(dt,speed);//处理人物状态和动画切换
		//cc.log(this.data.selfacc.x);
		
        this.body.linearVelocity = speed;
    }, 
	    
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		var worldManifold = contact.getWorldManifold();
		var points = worldManifold.points;
		
		if(other.node.name.indexOf("Enemy")!=-1){
			this.collEnemy(contact, self, other);
		}
		//cc.log(points[0]);
		//this.points=points;
		//this.data.onFloor=this.isOnFloor(points);
		
		this.getGoods(contact, self, other);
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体结束接触时被调用一次
		
    },
    onPreSolve: function (contact, self, other) {// 每次将要处理碰撞体接触逻辑时被调用
		var worldManifold = contact.getWorldManifold();
		var points = worldManifold.points;
		
		if(other.node.name.indexOf("Enemy")!=-1){
			this.collEnemy(contact, self, other);
		}
    }, 
    onPostSolve: function (contact, self, other) {// 每次处理完碰撞体接触逻辑时被调用
	
    },  
	onCollisionEnter: function (other, self){
		if(other.name.indexOf("WATER")!=-1){
			this.data.state[0]="water";
			if(this.data.state[2]!="Lead"&&this.data.state[2]!="Seadragon"){
				this.toLead();
			}
		}
	},
	onCollisionStay: function (other,self){
		
	},
	onCollisionExit: function (other, self){
		if(other.name.indexOf("WATER")!=-1){
			this.data.state[0]="air";
		}
	},
	dataBegin:function(){
		this.changeLife(8,8);
		this.changeTime(5);
		this.data.maxSpeedx=MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		this.data.maxSpeedup=MaxSpeedKind[this.data.state[0]]["up"];
		this.data.maxSpeeddown=MaxSpeedKind[this.data.state[0]]["down"];
		this.data.jumpSpeedy=BeginSpeedKind[this.data.state[0]]["jump"];
		var nowDraw=this.data.state[2]+"_"+this.data.act;
		this.node.scale=ALL.scaleLead; //人物大小适配场景
		//this.node.scaleX=用来调整开场方向
		this.data.noattacktime=0;
		this.data.attacktime=0;
		this.data.player.play(nowDraw);
		this.data.preDraw=nowDraw;
		

	},
	dealKey:function (dt,speed){//处理按键
		//this.data.maxSpeedx=MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//this.data.maxSpeedup=MaxSpeedKind[this.data.state[0]]["up"];
		//this.data.maxSpeeddown=MaxSpeedKind[this.data.state[0]]["down"];
		//this.data.jumpSpeedy=BeginSpeedKind[this.data.state[0]]["jump"];
		//this.data.onFloor=this.isOnFloor();
		this.data.preisLie=this.data.isLie;
		//cc.log(this.headScript.collObiect);
		this.data.isLie=(this.data.key_down ||this.headScript.collObiect)&& this.data.onFloor &&this.data.state[2]=="Lead";
		this.body.gravityScale=PhysicalPara[this.data.state[0]]["gravityScale"];
		this.body.linearDamping=PhysicalPara[this.data.state[0]]["linearDamping"];
		if(this.data.isLie){//判断碰撞体形状
			this.phyColl.size.height=30;
			this.phyColl.offset.y=-20;
			this.phyColl.apply();
			//this.data.onFloor=true//控制状态，避免改变碰撞体时误判其为false；
		}else if(this.data.preisLie!=this.data.isLie){//上一帧和当前帧的isLie不同
			this.phyColl.size.height=70;
			this.phyColl.offset.y=0;
			this.phyColl.apply();
			//this.data.onFloor=false//控制状态，避免改变碰撞体时误判其为false；
		}
		if(this.data.state[0].indexOf("air")!=-1){
			var maxJumptime=8;
			if(this.data.key_jump&&!this.data.isLie){//按了跳跃还没有趴着
				if(this.data.state[2].indexOf("Pterosaur")!=-1){
					speed.y=this.data.jumpSpeedy/2;
				}else if(this.data.onFloor){//如果在地面上，且 按了跳跃，则就挑起
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
			
			if(this.data.state[2]=="Pterosaur"&&this.data.onFloor){//是飞龙且在地面上不可以加速
				this.data.state[1]="walk";
			}else if(this.data.isLie){//正在趴下则无法加速
				this.data.state[1]="climb";
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
			if(this.data.isLie){//正在趴下则无法加速
				this.data.state[1]="climb";
			}else if(this.data.key_acc){//按了加速
				this.data.state[1]="run";
			}else{
				this.data.state[1]="walk";
			}
		}
		
		
		var leadAcc=BeginAccKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		this.data.maxSpeedx=MaxSpeedKind[this.data.state[0]][this.data.state[1]][this.data.state[2]];
		//cc.log(this.data.maxSpeedx);
		this.data.maxSpeedup=MaxSpeedKind[this.data.state[0]]["up"];
		this.data.maxSpeeddown=MaxSpeedKind[this.data.state[0]]["down"];

		if(this.data.state[2].indexOf("Pterosaur")!=-1){//是飞龙
			this.data.maxSpeeddown/=3;
			this.body.gravityScale=PhysicalPara[this.data.state[0]]["gravityScale"]/2;
		}else{
			this.body.gravityScale=PhysicalPara[this.data.state[0]]["gravityScale"];
		}
		this.data.jumpSpeedy=BeginSpeedKind[this.data.state[0]]["jump"];
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
	dealState: function (dt,speed){//改变人物状态:act
		//cc.log(this.data.onFloor);
		if(this.data.isLie){//趴着
			if(this.judgeAttack()){//攻击
			}else if(Math.abs(speed.x)<100){//在地板上,判断速度
				this.data.act="lie";
			}else{//速度快
				this.data.act="lierun";
			}
		}else if(this.judgeAttack()){
		}else if(this.data.state[0].indexOf("air")!=-1){
			if(!this.data.onFloor){//没在地板上就跳
				this.data.act="jump";
			}else if(Math.abs(speed.x)<100){//在地板上,判断速度
				this.data.act="walk";
			}else{
				if((speed.x>0)^(this.node.scaleX>0)){//速度和面向不同
					this.data.act="slip";
				}else{
					this.data.act="run";
				}
			}
			if(this.data.state[2].indexOf("Pterosaur")!=-1){//飞龙
				if(speed.y>2){
					this.data.act="jump";
				}else if(speed.y<-2){
					this.data.act="taxi";
				}
			}
		}else if(this.data.state[0].indexOf("water")!=-1){
			if(!this.data.onFloor){//没在地板上就跳
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
	
	collEnemy:function(contact, self, other){
		var ep=other.node.getComponent("EnemyPublic");
		if(ep==null){
			cc.log("公用怪物脚本丢失");
			return;
		}
		if(this.data.specialEffect=="null"){
			if(ep.specialEffect=="null"){
				if(this.data.state[2]=="Stegosaurus"&&this.data.act=="attack"){//是剑龙攻击     
					ep.changeLife(-ALL.DAM["Stegosaurus"],"Arm_Stegosaurus");//怪物掉血，剑龙攻击成功
				}else{
					this.speed=this.body.linearVelocity;
					this.speed.x=300*(this.node.x>other.node.x?1:-1)
					this.body.linearVelocity=this.speed;
					if(this.data.state[2]=="Lead"&&this.data.specialEffect=="null"){//是主角本人则掉血
						this.changeLife(-ep.damage,0);//主角掉血
					}else if(this.data.state[2]!="Lead"&&this.data.specialEffect=="null"){
						this.changeLife(0,0);
						ALL.MainCanSc.addEffect(this.node.x,this.node.y,this,"blast");
						ep.die();
						this.toLead();
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
					this.toLead();
				}
			}
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
	isOnFloor:function(){//判断是不是站在地面上
		let i=0;
		
		//cc.log(collider);
		//for(i=0;i<this.points.length;i++){
			//cc.log(this.points[i]);
		//}
		/*var rect=this.foot.getComponent(cc.BoxCollider);
		var colliderList = cc.director.getPhysicsManager().testAABB(rect);*/
		//碰撞点的y加上碰撞体框子高的一半，小于节点本身的y,且说明是在地面上
		//return true;
	},
	judgeAttack:function(){
		//cc.log(this.data.nowArms);
		if(this.data.key_attack&&this.data.act.indexOf("attack")==-1&&this.data.noattacktime==0&&this.data.nowArmsCnt<ARMS.maxCnt[this.data.nowArms]){//按了攻击有没处于攻击动作,还没有处于非攻击实践
			this.newArm();
			this.data.act=this.data.isLie?"lieattack":"attack";
			this.data.attacktime=1;
			this.data.noattacktime=ALL.AttackTime["no"][this.data.nowArms];
		}else if(this.data.attacktime>0&&this.data.attacktime<ALL.AttackTime["yes"][this.data.nowArms]){//在攻击动画时间内
			this.data.attacktime++;
		}else{//不能攻击
			if(this.data.noattacktime>0){
				this.data.noattacktime--;
			}
			this.data.attacktime=0;
			return false;
		}
		return true;
	},
	newArm:function(){//用来加载一个新武器
        if(this.data.nowArms=="Axe"){
			
				this.data.nowArmsCnt++;
				var newarm=cc.instantiate(ALL.FAB["Arm_Axe"]);
				newarm.getComponent("Arm_Axe").init(cc.v2(600*(this.node.scaleX>0?1:-1),100));
				//cc.log(newarm);
				var armX=this.node.x+12*(this.node.scaleX>0?1:-1);
				var armY=this.node.y+30;
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
			   
        }else if(this.data.nowArms=="DragonFire"){
			
				this.data.nowArmsCnt++;
				var newarm=cc.instantiate(ALL.FAB["Arm_DragonFire"]);
				var armX=this.node.x+12*(this.node.scaleX>0?1:-1);
				var armY=this.node.y+10;
				newarm.getComponent("Arm_DragonFire").init(cc.v2(800*(this.node.scaleX>0?1:-1),0),cc.v2(armX,armY));
				newarm.setPosition(armX,armY); 
				this.node.parent.addChild(newarm);
			
		}else if(this.data.nowArms=="DragonBattery"){
			
				this.data.nowArmsCnt++;
				var newarm=cc.instantiate(ALL.FAB["Arm_DragonBattery"]);
				var armX=this.node.x+50*(this.node.scaleX>0?1:-1);
				var armY=this.node.y-16;
				newarm.getComponent("Arm_DragonBattery").init(cc.v2(800*(this.node.scaleX>0?1:-1),0),cc.v2(armX,armY));
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
			
		}else if(this.data.nowArms=="DragonSto"){
			
				this.data.nowArmsCnt++;
				var newarm=cc.instantiate(ALL.FAB["Arm_DragonSto"]);
				var armX=this.node.x+1*(this.node.scaleX>0?1:-1);
				var armY=this.node.y-16;
				
				newarm.getComponent("Arm_DragonSto").init(cc.v2(100*(this.node.scaleX>0?1:-1),Math.min(this.body.linearVelocity.y-100,0)),cc.v2(armX,armY));
				newarm.setPosition(armX,armY);
				this.node.parent.addChild(newarm);
			
		}
    },
	getGoods:function(contact, self, other){
		var i=0;
		for(i=0;i<this.pets.length&&other.name.indexOf(this.pets[i])==-1;i++);
		if(i<this.pets.length){//判断是不是骑着龙
			this.data.state[2]=this.pets[i];
			this.preArms=this.data.nowArms;
			this.data.nowArms=this.petsArm[i];
			//this.phyColl.size.height=80;
			this.phyColl.size.width=70;
			this.phyColl.offset.y=-5;
			this.foot.y=-5;//获得碰撞体
			this.phyColl.apply();
		}else{
			
		}
		
	},
	toLead:function(){
		this.data.state[2]="Lead",
		this.phyColl.size.height=70;
		this.phyColl.size.width=50;
		this.phyColl.offset.y=0;
		
			this.data.nowArms="Axe"
		this.foot.y=0;//获得碰撞体
		this.phyColl.apply();
	},
	changeLife:function(chLife,chLifeUp=0){//改变体力和体力上限
		var child = ALL.MainCanSc.lifeGroup.getChildren();
		var pngFalse="picture/Interface/Game/life_false.png";
		var pngTrue="picture/Interface/Game/life_true.png";
		var i=child.length;
		while(chLifeUp>0){//加一个上限
			let newLife = new cc.Node();
			newLife.addComponent(cc.Sprite);
			var X=-ALL.MainCanSc.lifeGroup.width/2+(i++)*90;
            newLife.setPosition(X,0);
			cc.loader.loadRes(pngFalse, cc.SpriteFrame, function (err, spriteFrame) {
				newLife.getComponent(cc.Sprite).spriteFrame = spriteFrame;
			});
            ALL.MainCanSc.lifeGroup.addChild(newLife);
			chLifeUp--;this.data.life.y++;
        }
		if(chLife>0){
			var cnt=Math.min(chLife,this.data.life.y-this.data.life.x);//要回复几滴血
			var X=this.data.life.x;//初始血量位置
			this.data.life.x+=cnt;//数值上的回血
			cc.loader.loadRes(pngTrue, cc.SpriteFrame, function (err, spriteFrame) {//ui显示上的回血
				for(var i=X;i<X+cnt;i++){
					child[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
				}
			});
		}else{
			var cnt=Math.min(-chLife,this.data.life.x);//掉几滴血
			var X=this.data.life.x;//初始血量
			this.data.life.x-=cnt;//数值上的扣血
			cc.loader.loadRes(pngFalse, cc.SpriteFrame, function (err, spriteFrame) {//ui显示上的回血
				for(var i=X-1;i>=X-cnt;i--){
					child[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
				}
			});
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
		var pngFalse="picture/Interface/Game/time_false.png";
		var pngTrue="picture/Interface/Game/time_true.png";
		if(chTime>0){
			var cnt=Math.min(chTime,this.data.time.y-this.data.time.x);//要回复几个时间
			var X=this.data.time.x;//初始时间位置
			this.data.time.x+=cnt;//数值上的加时间
			cc.loader.loadRes(pngTrue, cc.SpriteFrame, function (err, spriteFrame) {//ui显示上的时间
				for(var i=X;i<X+cnt;i++){
					child[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
				}
			});
		}else{
			var cnt=Math.min(-chTime,this.data.time.x);//掉几时间
			var X=this.data.time.x;//初始时间
			this.data.time.x-=cnt;//数值上的扣时间
			cc.loader.loadRes(pngFalse, cc.SpriteFrame, function (err, spriteFrame) {//ui显示上的时间
				for(var i=X-1;i>=X-cnt;i--){
					child[i].getComponent(cc.Sprite).spriteFrame = spriteFrame;
				}
			});
			if(this.data.time.x==0){
				this.changeLife(-1);
				this.changeTime(8);
			}
		}
	},
	die:function(){
		// newLife.spriteFrame=this.img_false;
	}
});

