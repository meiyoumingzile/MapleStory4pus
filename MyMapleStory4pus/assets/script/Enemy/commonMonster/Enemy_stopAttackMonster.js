cc.Class({
    extends: cc.Component,

    properties: {
		attackGap:50,//攻击间隔
		armKind:1,
    },

    // use this for initialization
    onLoad: function () {//3种样式，5种类型
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.selfCollider=this.node.getComponent(cc.BoxCollider);//获得碰撞体
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
        this.player = this.node.getComponent(cc.Animation);
		var mk=this.ep.mkScript;
		if(this.ep.mkScript){//必定存在
			this.body.linearVelocity=mk.noteSpeed;
		}
		
		this.armKind=ENDATA["stopAttackMonster"]["armKind"][this.ep.kind-1];
		this.attackGap=ENDATA["stopAttackMonster"]["attackGap"][this.ep.kind-1];//攻击间隔
		
		
        //this.node.scaleX*=(this.node.x>ALL.Lead.x?-1:1)
        this.playState="Enemy_stopAttackMonster"+this.ep.kind;
        this.lastPlayState=this.playState;
        this.player.play(this.playState);
		this.callbackAttack = function(){
			ALL.MainCanSc.addEbulletA(this.armKind,this.node.x,this.node.y,cc.v2((this.node.scaleX>0?1:-1),0));
		}
		this.schedule(this.callbackAttack,this.attackGap,ALL.INF,0);
    },

    update: function (dt) {
		this.ep.visDie();
    },

	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){//在人物里处理了碰撞效果
			contact.disabled=true;
        }
    },
});
