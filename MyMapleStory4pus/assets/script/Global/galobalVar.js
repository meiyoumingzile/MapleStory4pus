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
    Doors:{
    	next:cc.v2(0,0),
    	Volcano1:{
    		door1:cc.v2(-2290,-160),
    		door2:cc.v2(2250,-250),
    	},
    	Volcano2:{
    		door1:cc.v2(4770,-220),
    	},
    },
	
    NextSence:"",
    nowSence:"",
    lastSence:"",

	FAB:{},//预制体资源
	GamePropFrame:{},//道具图标资源
    INF:1000000000,
    inf:0.1,
    jumpScenesList:[],
    EnemyScript:[],
	enemyUpdateSize:cc.v2(1000,1000),//怪物刷新范围
	scaleLead:cc.v2(1,1),
	scaleEnemy:cc.v2(1,1),
	scaleOb:cc.v2(1,1),
};




window.KEY={
    up:cc.macro.KEY.w,
    down:cc.macro.KEY.s,
    left:cc.macro.KEY.a,
    right:cc.macro.KEY.d,
    attack:cc.macro.KEY.j,
    acc:cc.macro.KEY.l,
    jump:cc.macro.KEY.k,
};

