cc.Class({
    extends: cc.Component,

    properties: {
		attackLen:0,
		armfp:-1,
    },

    // use this for initialization
    onLoad: function () {//3种样式，5种类型
		this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
        this.ep=this.node.getComponent("EnemyPublic");
        this.player = this.node.getComponent(cc.Animation);
		this.node.scaleX*=(this.node.x>ALL.Lead.x?-1:1);
		
		this.hbody=ALL.MainCanSc.findChildren(this.node,"hbody");
		this.head=ALL.MainCanSc.findChildren(this.node,"Enemy_head");
		//cc.log(this.head);
        this.head.getComponent("EnemyPublic").specialEffect="invincible";
		this.head.getComponent("EnemyPublic").canDie=false;
		this.unitLen=ENDATA[this.ep.category]["unitLen"][this.ep.kind-1];//攻击间隔
		this.head.x=this.hbody.x;
		this.head.y=this.hbody.y;
		this.beginPos=cc.v2(this.head.x,this.head.y);
		//this.head.y=this.hbody.y+this.hbody.;
		this.attackLen=Math.max(this.ep.mkScript.noteSpeed.y,100);
		this.attackGap=ENDATA[this.ep.category]["attackGap"][this.ep.kind-1];//攻击间隔
		this.tarPos=cc.v2(this.head.x,this.head.y);
		
		
        this.state="stop";
		this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
		this.lastPlayState=this.playState;
		this.player.play(this.playState);
		
    },

    update: function (dt) {
		this.ep.visDie();
		this.hbody.height=this.head.y-this.beginPos.y;
		//cc.log(this.head.y);
		if(Math.abs(this.head.y-this.beginPos.y)<ALL.inf){
			this.head.height=0;
			this.head.y=this.beginPos.y+1;
			this.state="stop";
			this.callbackAttack = function(){
				this.head.height=20;
				this.armfp=1;
				this.state="attack";
				this.time=this.attackLen/this.unitLen;
				this.tarPos=cc.v2(this.head.x,this.head.y+this.attackLen);
				
				this.head.runAction(cc.moveTo(this.time,this.tarPos));
			}
			this.schedule(this.callbackAttack,this.attackGap,0,0);
		}
		if(this.armfp==1&&Math.abs(this.head.x-this.tarPos.x)<ALL.inf&&Math.abs(this.head.y-this.tarPos.y)<ALL.inf){
			this.armfp=-1;
			this.time=this.attackLen/this.unitLen;
			this.tarPos=cc.v2(this.head.x,this.beginPos.y);
			this.head.runAction(cc.moveTo(this.time,this.tarPos));
			
		}
		this.changeAction();
    },
	changeAction:function(){
        this.playState="Enemy_"+this.ep.category+this.ep.kind+"_"+this.state;
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },
});
