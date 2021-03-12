/*
全局变量
*///////////////////
window.MainLead=cc.node;
window.ALL = {
    FAB:{},//预制体资源
    RES:{
        is:false,
        GamePropFrame:{},//道具图标资源
        FAB:{},//预制体资源
        LeadAnim:[],
        LeadMusic:[],
    },
	GamePropFrame:{},//道具图标资源
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
    
    jumpSenceDoor:null,
    scDoor:null,//
    comScDoor:null,//compel强制跳转场景

    INF:1000000000,
    inf:0.1,
    
    EnemyScript:[],
    enemyUpdateSize:cc.v2(1000,1000),//怪物刷新范围
    obUpdateSize:cc.v2(2000,2000),//怪物墙的范围
	scaleLead:cc.v2(1,1),
	scaleEnemy:cc.v2(1,1),
    scaleOb:cc.v2(1,1),
    menu:null,
    menuSc:null,
    bgMusic:null,
    musicVolume:1,
};

window.SAVE={
    SaveLead_data:null,
    LeadBegin:{
        targetPos:null,//不设置则调到门附近
        saveDeviation:cc.v2(0,0),
        scaleX:0,
    },
    preSence:"",
    preDoor:{
        kind:"",
        tag:"",
        name:"",
    },
   
};
window.KEY={
    up:cc.macro.KEY.w,
    down:cc.macro.KEY.s,
    left:cc.macro.KEY.a,
    right:cc.macro.KEY.d,
    attack:cc.macro.KEY.j,
    acc:cc.macro.KEY.l,
    jump:cc.macro.KEY.k,
    pause:cc.macro.KEY.space,
    c:cc.macro.KEY.c,
};

window.SchedulerDir={
   arm:{

   },
};