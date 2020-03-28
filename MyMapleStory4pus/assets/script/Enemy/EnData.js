//敌人的基本数据
window.ENDATA={
	IND:{//转换名称
		snail:"walkMonster",
		beetle:"walkMonster",
		bear:"walkMonster",
		penguin:"walkMonster",
		crab:"walkMonster",
		
		skull:"floatMonster",
		spider:"floatMonster",
		
		pig:"runMonster",
		ostrich:"runMonster",
		fox:"runMonster",
		
		octopus:"barrageMonster",
		tunas:"barrageMonster",
		
		cricket:"jumpMonster",
		kangaroo:"jumpMonster",
		frog:"jumpMonster",
		rabbit:"jumpMonster",
		
		bat:"flyMonster",
		crow:"flyMonster",
		glowworm:"flyMonster",
		seahorse:"flyMonster",
		whelk:"flyMonster",
		
		followCloud:"followFlyMonster",
		dragonfly:"followFlyMonster",
		eagle:"followFlyMonster",
		
		sealion:"mouse",
		landConch:"hedgehog",
		
		fire:"FrCyStRo",
		cyclone:"FrCyStRo",
		rock:"FrCyStRo",
		specialStone:"FrCyStRo",
	},
	EbulletA:{
		phySize:[cc.v2(25,25),cc.v2(70,20),cc.v2(70,20),cc.v2(120,20),cc.v2(40,20),cc.v2(40,40),cc.v2(80,20),cc.v2(30,30)],
		beginSpeed:[cc.v2(50,50),cc.v2(400,0),cc.v2(500,0),cc.v2(500,0),cc.v2(350,0),cc.v2(700,120),cc.v2(200,0),cc.v2(100,100)],
	},
	dropOb:{
		phySize:[
		[cc.v2(-40,45),cc.v2(0,-45),cc.v2(40,45)],[cc.v2(-35,25),cc.v2(0,-25),cc.v2(35,25)],
		[cc.v2(-14,0),cc.v2(0,-16),cc.v2(14,0),cc.v2(0,16)],[cc.v2(-14,0),cc.v2(0,-16),cc.v2(14,0),cc.v2(0,16)],[cc.v2(-40,-5),cc.v2(0,25),cc.v2(40,-5),cc.v2(20,-20),cc.v2(-20,-20)],
		[cc.v2(-40,25),cc.v2(40,25),cc.v2(40,-25),cc.v2(-40,-25)],[cc.v2(0,20),cc.v2(-20,-6),cc.v2(0,-22),cc.v2(20,-6)],
		[cc.v2(0,26),cc.v2(-30,-6),cc.v2(0,-26),cc.v2(30,-6)],[cc.v2(0,20),cc.v2(-26,-14),cc.v2(26,-14)],
		[cc.v2(15,15),cc.v2(-15,15),cc.v2(-15,-15),cc.v2(15,-15)],
		],
		//beginSpeed:[cc.v2(50,50),cc.v2(400,0),cc.v2(500,0),cc.v2(500,0),cc.v2(350,0),cc.v2(700,120),cc.v2(200,0),cc.v2(100,100)],
		specialEffect:["null","null","invincible","invincible","null","invincible","invincible","invincible","invincible"],
	},
	worm:{
		jumpSpeed:[cc.v2(200,600),cc.v2(250,750),cc.v2(250,750),cc.v2(250,750),cc.v2(250,750)],
		stopGap:[4,3.6,5,4,5],
		attackGap:[2,1.8,1.8,1.8,1.5],
		phySize:[cc.v2(70,80),cc.v2(70,60),cc.v2(80,70),cc.v2(80,70),cc.v2(80,70)],
		life:[1,2,5,5,1],
		armKind:[2,4,5,6,3],
	},
	snail:{
		phySize:cc.v2(90,50),
		beginSpeed:[cc.v2(10,10),cc.v2(10,10),cc.v2(10,10),cc.v2(10,10),cc.v2(10,10),cc.v2(20,10),cc.v2(20,10)],
		life:[1,1,1,1,3,4,5],
	},
	beetle:{
		phySize:cc.v2(90,35),
		beginSpeed:[cc.v2(80,80)],
		life:[6],
	},
	bear:{
		phySize:cc.v2(70,70),
		beginSpeed:[cc.v2(30,30)],
		life:[6],
	},
	penguin:{
		phySize:cc.v2(70,70),
		beginSpeed:[cc.v2(60,60)],
		life:[4],
	},
	crab:{
		phySize:cc.v2(60,40),
		beginSpeed:[cc.v2(200,200),cc.v2(200,200)],
		life:[1,1],
	},
	stopAttackMonster:{//发闪电云和水母
		phySize:[cc.v2(70,40),cc.v2(60,40)],
		armKind:[8,1],
		attackGap:[2.7,2.5],
		life:[1,2],
	},
	skull:{
		phySize:cc.v2(80,80),
		life:[1,2,3],
	},
	spider:{
		phySize:cc.v2(60,60),
		life:[3,2,1],
	},
	
	pig:{
		phySize:cc.v2(65,85),
		beginSpeed:[cc.v2(200,80),cc.v2(200,80)],
		life:[1,1],
	},
	ostrich:{
		phySize:cc.v2(70,100),
		beginSpeed:[cc.v2(500,80)],
		life:[2],
	},
	fox:{
		phySize:cc.v2(70,75),
		beginSpeed:[cc.v2(600,80),cc.v2(600,80)],
		life:[2,1],
	},
	
	scorpion:{
		jumpSpeed:[cc.v2(0,600),cc.v2(350,600),cc.v2(400,400)],
		beginSpeed:[cc.v2(0,0),cc.v2(80,0),cc.v2(60,0)],
		phySize:[cc.v2(110,60),cc.v2(100,100),cc.v2(75,100)],
		life:[4,5,6],
		armKind:[2,4,5],
	},
	
	tunas:{
		jumpSpeed:[cc.v2(300,900),cc.v2(400,800)],
		phySize:[cc.v2(160,40),cc.v2(300,26)],
		life:[1,1],
	},
	octopus:{
		jumpSpeed:[cc.v2(0,800)],
		phySize:[cc.v2(80,60)],
		life:[1],
	},
	
	kangaroo:{
		g:2,
		jumpSpeed:[cc.v2(500,900)],
		stopGap:[0.7],
		phySize:[cc.v2(80,100)],
		life:[1],
	},
	cricket:{
		g:3,
		jumpSpeed:[cc.v2(350,800)],
		stopGap:[1],
		phySize:[cc.v2(110,50)],
		life:[1],
	},
	rabbit:{
		g:1.5,
		jumpSpeed:[cc.v2(300,640),cc.v2(200,640)],
		stopGap:[2,1.5],
		phySize:cc.v2(70,96),
		life:[1,2],
	},
	frog:{
		g:4,
		jumpSpeed:[cc.v2(280,1200),cc.v2(280,1200),cc.v2(280,1200),cc.v2(280,1200)],
		stopGap:[1,2,2,0.5],
		phySize:cc.v2(75,45),
		life:[1,2,1,1],
	},
	
	
	crow:{
		unitTime:[180,220,270],
		phySize:[cc.v2(80,50),cc.v2(80,60),cc.v2(70,50)],
		life:[1,1,1],
	},
	bat:{
		unitTime:[280,280,320,360],
		phySize:[cc.v2(80,50),cc.v2(100,50),cc.v2(100,50),cc.v2(80,50)],
		life:[1,1,4,2],
	},
	glowworm:{
		unitTime:[200],
		phySize:cc.v2(30,30),
		life:[1],
	},
	seahorse:{
		unitTime:[220,220,300,300],
		phySize:cc.v2(60,92),
		life:[2,1,2,1],
	},
	whelk:{
		unitTime:[200,240],
		phySize:cc.v2(80,80),
		life:[2,1],
	},
	
	eagle:{
		unitTime:[150,150],
		jumpLen:[cc.v2(150,150),cc.v2(150,150)],
		followSpeed:[200,200],
		stopGap:[2,2],
		phySize:cc.v2(150,60),
		life:[1,1],
	},
	followCloud:{
		unitTime:[200],
		jumpLen:[cc.v2(50,60)],
		followSpeed:[200],
		stopGap:[2],
		phySize:cc.v2(110,36),
		life:[1],
	},
	dragonfly:{
		unitTime:[250],
		jumpLen:[cc.v2(50,60)],
		followSpeed:[400],
		stopGap:[2],
		phySize:cc.v2(80,50),
		life:[1],
	},
	
	cuttlefish:{
		g:0.2,
		stopGap:[0.7],
		phySize:[cc.v2(40,100)],
		life:[1],
	},
	
	fish:{
		beginSpeed:[cc.v2(222,100),cc.v2(200,100),cc.v2(177,100),cc.v2(50,50)],
		phySize:cc.v2(110,40),
		life:[1,2,3,6],
	},
	
	jellyfish:{
		unitTime:[700,500,500],
		//stopGap:[1,1,1],
		phySize:cc.v2(70,50),
		life:[1,1,2],
	},
	
	//以下是otherMonster
	voleDropOb:{
		beginSpeed:[cc.v2(200,0)],
		stopGap:[3],
		attackTime:[1],
		phySize:cc.v2(50,50),
		life:[4],
	},
	mouse:{
		walkPhySize:[cc.v2(80,44),cc.v2(70,46)],
		phySize:[cc.v2(70,40),cc.v2(60,40)],
		life:[1,2],
		beginSpeed:[cc.v2(177,777),cc.v2(89,888)],
	},
	sealion:{
		walkPhySize:[cc.v2(110,50)],
		phySize:[cc.v2(110,50)],
		life:[2],
		beginSpeed:[cc.v2(177,777)],
	},
	obPenguin:{
		beginSpeed:[cc.v2(109,666)],
		stopGap:[4],
		phySize:cc.v2(100,80),
		life:[4],
	},
	hedgehog:{
		beginSpeed:[cc.v2(188,0)],
		stopGap:[3],
		phySize:[cc.v2(0,30),cc.v2(-44,10),cc.v2(-44,-30),cc.v2(44,-30),cc.v2(44,10)],
		life:[4],
	},
	landConch:{
		beginSpeed:[cc.v2(177,0)],
		stopGap:[4],
		phySize:[cc.v2(0,30),cc.v2(33,-15),cc.v2(33,-30),cc.v2(-33,-30),cc.v2(-33,-15)],
		life:[4],
	},
	mouseWithOb:{
		stopGap:[1],
		safeDis:[cc.v2(144,200)],
		beginSpeed:[cc.v2(300,0)],
		phySize:[cc.v2(-40,10),cc.v2(40,10),cc.v2(40,-10),cc.v2(-40,-10)],
		walkPhySize:[cc.v2(-40,30),cc.v2(45,70),cc.v2(45,0),cc.v2(-40,0)],
		life:[4],
	},
	lizard:{
		unitLen:[400],
		attackGap:[2.8],
		life:[2],
	},
	
	//以下是invMonster
	stabBall:{
		specialEffect:["invincible","invincible","invincible","null"],
		stopGap:[1.2,0.5,2,0],
		phySize:[cc.v2(70,50),cc.v2(60,38),cc.v2(120,80),cc.v2(50,35)],
		life:[1,1,1,2],
	},
	ghost:{
		safeDis:[cc.v2(300,300),cc.v2(600,600),cc.v2(800,300)],
		specialEffect:["invincible","invincible","null"],
		beginSpeed:[cc.v2(50,50),cc.v2(50,50),cc.v2(50,50)],
		phySize:[cc.v2(92,52),cc.v2(102,58),cc.v2(40,50)],
		life:[1,1,1],
	},
	fire:{
		beginSpeed:[cc.v2(0,0),cc.v2(0,0)],
		phySize:[cc.v2(76,80),cc.v2(70,80)],
		life:[1,1],
		damArm:["waterGun"],
	},
	cyclone:{
		beginSpeed:[cc.v2(160,0)],
		phySize:[cc.v2(60,46)],
		life:[1],
		damArm:[],
	},
	rock:{
		beginSpeed:[cc.v2(160,0),cc.v2(200,100),cc.v2(200,100)],
		phySize:[cc.v2(120,78),cc.v2(110,70),cc.v2(110,70)],
		life:[1,1,1],
		damArm:["DragonFire","DragonBattery","Stegosaurus","ham","boomerang","bomb"],
	},
	specialStone:{
		beginSpeed:[cc.v2(0,0),cc.v2(0,0)],
		life:[1,1],
		damArm:["DragonFire","DragonBattery","Stegosaurus","ham","boomerang","bomb"],
	},
};
//以上是敌人的基本数据