/*
全局变量
*///////////////////
window.MainLead=cc.node;
window.ALL = {
    MainCanSc:{//公用脚本,也就是sumcanvas
        default:null,
        type:cc.script,
    }, 
    Lead:{
        default:null,
        type:cc.Node,
    },
    MainCanvas:{//主画布
    	default:null,
        type:cc.Node,
    },
	CamNode:null,
    
    SaveLead:null,
    NextSence:"",
    nowSence:"",
    lastSence:"",

	FAB:{},//预制体资源
	GamePropFrame:{},//道具图标资源
    INF:1000000000,
    inf:0.1,
    scDoor:[],//
    comScDoor:[],//compel强制跳转厂家
    EnemyScript:[],
	enemyUpdateSize:cc.v2(1000,1000),//怪物刷新范围
	scaleLead:cc.v2(1,1),
	scaleEnemy:cc.v2(1,1),
    scaleOb:cc.v2(1,1),
    menu:null,
};

window.DOOR ={
    test1:{
        home:cc.v2(-4271.367,-162),//传送到哪里
    },
    home:{
        test1:cc.v2(-400,80),//传送到哪里
        homeDown1:cc.v2(0,400),//传送到哪里
    },
    homeDown1:{
        test1:cc.v2(-400,80),//传送到哪里
        home:cc.v2(0,400),//传送到哪里
        cave1_1:cc.v2(0,0),
    },
    Volcano2:{
        door1:cc.v2(4770,-220),
    },
},


window.KEY={
    up:cc.macro.KEY.w,
    down:cc.macro.KEY.s,
    left:cc.macro.KEY.a,
    right:cc.macro.KEY.d,
    attack:cc.macro.KEY.j,
    acc:cc.macro.KEY.l,
    jump:cc.macro.KEY.k,
    pause:cc.macro.KEY.space,
};

window.SchedulerDir={
   arm:{

   },
};