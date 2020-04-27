
cc.Class({
    extends: cc.Component,
 
    properties: {
		bottomBar:{
            default:null,
            type:cc.Node,
        }, 
		list:{
			default:null,
            type:cc.List,
		},
		is_debug: true, // 是否显示调试信息;
        gravity: cc.v2(0, -800), // 系统默认的
		lifeGroup:[],
		timeGroup:[],
		fruitFrameList:[],
    },
 
    // use this for initialization
    onLoad: function () {
		        // 游戏引擎的总控制
        // cc.Director, cc.director 区别呢？ 
        // 大写的cc.Director是一个类, 小写cc.direcotr全局的实例
        cc.director.getPhysicsManager().enabled = true; // 开启了物理引擎
		cc.director.getPhysicsManager().enabledDebugDraw = true;//显示碰撞框
		cc.director.getCollisionManager().enabled = true;//初始化启用碰撞系统
		cc.director.getCollisionManager().enabledDebugDraw = true;//显示碰撞框
		ALL.jumpSenceDoor=this.findChildren(this.node,"JUMPSCENES"); //
		ALL.scDoor=this.findChildren(ALL.jumpSenceDoor,"DOOR"); //
		ALL.comScDoor=this.findChildren(ALL.jumpSenceDoor,"COMPELDOOR"); //
		this.initGalobalVar();
        // 独立的形状，打开一个调试区域,游戏图像的，逻辑区域;
        // 开始调试模式:
        if (this.is_debug) { // 开启调试信息
            var Bits = cc.PhysicsManager.DrawBits; // 这个是我们要显示的类型
            cc.director.getPhysicsManager().debugDrawFlags = Bits.e_jointBit | Bits.e_shapeBit;
        } else { // 关闭调试信息
            cc.director.getPhysicsManager().debugDrawFlags = 0;
        }
		cc.director.getPhysicsManager().gravity = this.gravity;// 重力加速度的配置
    },
	__preload: function () {//3种样式，5种类型
		cc.director.pause();
		this.onLoadResources();
		
    },
	initGalobalVar:function(){
        ALL.MainCanSc=this.node.getComponent("SumCanvas");
		//cc.log(this.Lead);
        ALL.MainCanvas=this.node;
		this.lifeGroup=this.findChildren(this.bottomBar,"lifeGroup");
		this.timeGroup=this.findChildren(this.bottomBar,"timeGroup");
		
		//以下是屏幕适配
		let sz=cc.view.getVisibleSize();
		var scale=sz.width/this.bottomBar.width;
		this.bottomBar.scaleX=scale;//屏幕适配
		this.bottomBar.scaleY=scale;//屏幕适配
		ALL.menu=this.findChildren(this.bottomBar.parent,"MENU");
	},
    // update: function (dt) {
 
    // },
	onDestroy:function(){
        ALL.lastSence=this.node.parent.name;
    },
	findChildren:function(node,name){//节点代表要找的节点 和 字符串代表名称
		var arr=node.getChildren();
		for(var i=0;i<arr.length;i++){
			if(arr[i].name==name){
				return arr[i];
			}
		}
		return null;
	},
    getIntoSence:function(next,X,Y){//进入下一个场景
        ALL.NextSence=next;
        
        
        cc.director.loadScene("Waiting");
    },

    addEffect:function(X,Y,self,effect){//添加效果
        var neweffect=cc.instantiate(ALL.FAB["effects"]);
        neweffect.setPosition(X,Y);
        neweffect.getComponent("effect").kind=effect;
        self.node.parent.addChild(neweffect);
    },

    setSenceData:function(self){
        REM.time=ALL.time;
        REM.life=ALL.life;
        REM.LeadPos=self.node.position;
        REM.nowArms=ALL.nowArms;

        REM.Data.state=self.Data.state;
        REM.Data.state_character=self.Data.state_character;
        REM.Data.state_pos=self.Data.state_pos;
        REM.Data.specialEffect=self.Data.specialEffect;
        REM.nowSence=ALL.nowSence;
    },

    getSenceData:function(self,isRemPos){
        ALL.nowArmsNum.x=0;
        ALL.Times.getComponent("Times").changeToTime(REM.time);
        ALL.Lifes.getComponent("Lifes").changeToLife(REM.life);
        if(isRemPos==null){
        }else{
            self.node.position=REM.LeadPos;
            self.node.x+=5;
            self.node.y+=5;
        }
        
        ALL.nowArms=REM.nowArms;


        self.Data.state=REM.Data.state;
        self.Data.state_character=REM.Data.state_character;
        self.Data.state_pos=REM.Data.state_pos;
        self.Data.specialEffect=REM.Data.specialEffect;
        self.Data.nowArms=REM.Data.nowArms;
    },
	onLoadResources:function(){
		var self=this;
		var fruitUrl="picture/Goods/Fruit";
		var oll=[false,false,false,false];
		var resSuccess=function(){//临时函数，判断异步加载完毕
			var i=0;
			for(i=0;i<oll.length&&oll[i];i++);
			if(i==oll.length){
				MainLead.dataBegin();
				return true;
			}else{
				return false;
			}
		};
		cc.loader.loadResDir(fruitUrl,cc.SpriteFrame,function (err, assets) {
			self.fruitFrameList=assets;
			oll[0]=true;
			if(resSuccess()){
				cc.director.resume();
			}
		});
		cc.loader.loadResDir("prefab",cc.Prefab,function (err, assets) {
			for(var i=0;i<assets.length;i++){
				ALL.FAB[assets[i].name]=assets[i];
			}
			for(var k in ENDATA.IND){//索引怪物小类别和大类别
				ALL.FAB[k]=ALL.FAB[ENDATA.IND[k]];
			}
			oll[1]=true;
			if(resSuccess()){
				cc.director.resume();
			}
		});
		cc.loader.loadResDir("animation/Lead",function (err, assets) {
			var an=ALL.Lead.getComponent(cc.Animation);
			for(var i=0;i<assets.length;i++){
				an.addClip(assets[i]);
			}
			oll[2]=true;
			if(resSuccess()){
				cc.director.resume();
			}
		});
		cc.loader.loadResDir("picture/Goods",cc.SpriteFrame,function (err, assets) {
			for(var i=0;i<assets.length;i++){
				ALL.GamePropFrame[assets[i].name]=assets[i];
			}
			oll[3]=true;
			if(resSuccess()){
				cc.director.resume();
			}
		});
	},
	
	
	deepClone:function(a,obj) {
		let tmp = JSON.stringify(obj); 
		let result = JSON.parse(tmp); 
		a=obj;
	},
	deepClone1(obj) {
		//判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
		var objClone = Array.isArray(obj) ? [] : {};
		//进行深拷贝的不能为空，并且是对象或者是
		if (obj&&typeof obj === "object") {
		  for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
			  if (obj[key] && typeof obj[key] === "object") {
				objClone[key] = this.deepClone1(obj[key]);
			  } else {
				objClone[key] = obj[key];
			  }
			}
		  }
		}
		return objClone;
	},
	addEbulletA:function(kind,X,Y,dir){
        var newEbullet=cc.instantiate(ALL.FAB["Enemy_Ebullet_A"]);
        newEbullet.getComponent("Enemy_Ebullet_A").init(kind,dir);
        newEbullet.setPosition(X,Y);
        ALL.MainCanvas.addChild(newEbullet);
    },
	randomNum:function(minNum,maxNum){
		switch(arguments.length){
			case 1:
			return parseInt(Math.random()*minNum+1,10);
			break;
			case 2:
			return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
			break;
			default:
			return 0;
			break;
		}
	},
	getWindows:function(){
		let windowSize=cc.view.getVisibleSize();
		return cc.v2(windowSize.width,windowSize.height);
	},

	isBaseVar(a){
		return a instanceof String||a instanceof Boolean||a instanceof Number; 
	},
	inRange(a,min,max){
		if(a<min){
			return -1;
		}else if(a>max){
			return 1;
		}
		return 0; 
	},
});