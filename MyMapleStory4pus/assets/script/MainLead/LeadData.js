window.LEADDATA={
	Pets:["Fierydragon","Brontosaurus","Pterosaur","Stegosaurus","Seadragon"],
	LIFE:{
		up:8,
	},
	ARMS:{
		changePhyArm:{"umbrellaLead":"umbrella","scooterLead":"scooter"},
		attackUp:["spear","boomerang"],
		attackWater:["spear","ham","axe","boomerang","bomb"],
		disappearEGG:["axe","boomerang","waterGun","DragonBattery","DragonFire","DragonSto","fireDarts"],//碰到蛋消失
		maxCnt:{
			axe:2,
			fireDarts:2,
			waterGun:1,
			ham:1,
			fire:1,
			spear:1,
			bomb:1,
			boomerang:1,

			DragonFire:1,
			DragonBattery:3,
			DragonSto:2,
			Stegosaurus:2,
		},
		/*AexArmsNum:cc.v2(0,2),//
		FierydragonArmNum: cc.v2(0,2),
		BrontosaurusArmNum: cc.v2(0,3),
		PterosaurArmNum: cc.v2(0,2),
		nowArmsNum:cc.v2(0,0),
		nowArms:"axe",
		
		Prop:{
			axe:true,
			FireDarts:false,
		},
		*/

		indList:{//
			Lead:["axe","waterGun","boomerang","fire","ham","spear","bomb","umbrella","fireDarts"],
			liftLead:["axe","waterGun","boomerang","fire","ham","spear","bomb","umbrella","fireDarts"],
			lieLead:["axe","waterGun","boomerang","fire","ham","spear","bomb","umbrella","fireDarts"],
			umbrellaLead:["umbrella"],
			scooterLead:["scooter"],
			Fierydragon:["DragonFire"],
			Brontosaurus:["DragonBattery"],
			Pterosaur:["DragonSto"],
			Stegosaurus:["Stegosaurus"],
			Seadragon:["axe","bomb","boomerang"],
		},
	},
	DAM:{//攻击的伤害
		Stegosaurus:2,
	},
	AttackTime:{
		yes:{//攻击动画长度
			
			axe:0.1,
			fireDarts:0.1,
			waterGun:0.4,
			ham:1,
			fire:0.8,
			spear:0.1,
			bomb:0.1,
			boomerang:0.1,

			DragonFire:0.5,
			DragonBattery:0.1,
			DragonSto:0.1,
			Stegosaurus:1,

			hurl:0.2,//扔东西
		},
		no:{//间隔攻击动画长度
			axe:0.2,
			fireDarts:0.2,
			waterGun:0.5,
			ham:0.1,
			fire:0.1,
			spear:0.1,
			bomb:0.1,
			boomerang:0.5,

			DragonFire:0.4,
			DragonBattery:0.1,
			DragonSto:0.4,
			Stegosaurus:0.4,

			hurl:0.2,//扔东西
		},
	},

	Act:{
		water:{
			Lead:["walk","run","jump","attack"],
			liftLead:["walk","run","jump","attack"],
			LeadLie:["walk","run","jump","attack"],
			Fierydragon:["walk","run","jump","attack"],
			Brontosaurus:["walk","run","jump","attack"],
			Seadragon:["walk","run","jump","attack"],
			Pterosaur:["walk","run","jump","attack"],
			Stegosaurus:["walk","run","jump","attack"],
		},
		air:{
			Lead:["walk","run","jump","attack","slip"],
			liftLead:["walk","run","jump","attack"],
			lieLead:["walk","run","attack","slip"],
			scooterLead:["walk","run","attack","slip"],
			umbrellaLead:["walk","run","jump","attack"],
			Fierydragon:["walk","run","jump","attack"],
			Brontosaurus:["walk","run","jump","attack"],
			Seadragon:["walk","run","jump","attack"],
			Pterosaur:["walk","run","jump","attack"],
			Stegosaurus:["walk","run","jump","attack"],
		},
	},
	BeginSpeedKind:{//各种动作获得的初速度
		water:{
			jump:100,
		},
		air:{
			jump:520,
		},
	},
	BeginAccKind:{//各种动作获得的加速度
		water:{
			down:{
				Lead:0,
				liftLead:0,
				Seadragon:0,
				umbrellaLead:0,
			},
			up:{
				Lead:0,
				liftLead:0,
				Seadragon:0,
				umbrellaLead:0,
			},
			walk:{
				Lead:100,
				liftLead:100,
				umbrellaLead:200,
				lieLead:400,
				Seadragon:500,
			},
			run:{
				Lead:200,
				liftLead:200,
				umbrellaLead:200,
				lieLead:400,
				Seadragon:700,
			},
		},
		air:{
			up:0,
			dwon:0,
			walk:{
				Lead:500,
				liftLead:500,
				umbrellaLead:500,
				lieLead:400,
				scooterLead:600,
				
				Fierydragon:600,
				Brontosaurus:600,
				Seadragon:450,
				Pterosaur:600,
				Stegosaurus:600,
			},
			run:{
				Lead:700,
				liftLead:700,
				umbrellaLead:700,
				lieLead:580,
				scooterLead:700,

				Fierydragon:700,
				Brontosaurus:700,
				Seadragon:580,
				Pterosaur:700,
				Stegosaurus:700,
			},
		},
	},
	MaxSpeedKind:{//各种状态最大速度
		water:{
			down:200,//竖直下落最大速度
			up:200,//竖直上升最大速度
			walk:{
				Lead:120,
				liftLead:120,
				lieLead:120,
				Seadragon:150,
				umbrellaLead:200,
			},
			run:{
				Lead:200,
				liftLead:200,
				lieLead:120,
				Seadragon:300,
				umbrellaLead:200,
			},
		},
		air:{
			down:600,//竖直下落最大速度
			up:400,//竖直上升最大速度
			walk:{
				Lead:250,
				liftLead:250,
				umbrellaLead:250,
				lieLead:150,
				scooterLead:450,

				Fierydragon:300,
				Brontosaurus:300,
				Seadragon:300,
				Pterosaur:300,
				Stegosaurus:300,
			},
			run:{
				Lead:400,
				liftLead:400,
				umbrellaLead:400,
				lieLead:150,
				scooterLead:620,

				Fierydragon:520,
				Brontosaurus:520,
				Seadragon:420,
				Pterosaur:550,
				Stegosaurus:520,
			},
		},
	},
	PhysicalPara:{//物理参数
		water:{
			gravityScale:0.2,
			linearDamping: 0,
		},
		air:{
			gravityScale:1.6,
			linearDamping: 0.2,
		},
		size:{
			Lead:cc.v2(70,86),
			liftLead:cc.v2(70,86),
			scooterLead:cc.v2(100,120),
			lieLead:cc.v2(120,44),
			umbrellaLead:cc.v2(70,86),

			Fierydragon:cc.v2(90,100),
			Brontosaurus:cc.v2(90,100),
			Seadragon:cc.v2(100,100),
			Pterosaur:cc.v2(90,100),
			Stegosaurus:cc.v2(100,100),
		},
		offset:{
			Lead:cc.v2(0,0),
			liftLead:cc.v2(0,0),
			lieLead:cc.v2(0,-22),//
			scooterLead:cc.v2(0,0),
			umbrellaLead:cc.v2(0,0),

			Fierydragon:cc.v2(0,-25),//
			Brontosaurus:cc.v2(0,-25),//
			Seadragon:cc.v2(0,0),
			Pterosaur:cc.v2(0,0),
			Stegosaurus:cc.v2(0,-25),//
		},
		friction:{
			scooterLead:0,
			other:0.2,
		},
	},
	
	
};