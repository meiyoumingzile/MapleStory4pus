cc.Class({
    extends: cc.Component,

    properties: {
		dir:cc.v2(0,0),
		collFloorCnt:0,
    },

    // use this for initialization
	init: function(kind,dir=cc.v2(-1,0)){//传递数字[1,6],dir代表方向
		this.ep=this.node.getComponent("EnemyPublic");
		this.ep.kind=kind;
		this.dir=dir;
	},
    onLoad: function () {
      this.player = this.node.getComponent(cc.Animation);//初始化动画
        this.body = this.node.getComponent(cc.RigidBody);
		this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
        this.ep=this.node.getComponent("EnemyPublic");
		this.ep.category="EbulletA";
		
        var nx=this.node.x;
        var ny=this.node.y;
		this.beginSpeed=ENDATA[this.ep.category]["beginSpeed"][this.ep.kind-1];
		this.phyColl.size.width=ENDATA[this.ep.category]["phySize"][this.ep.kind-1].x;
		this.phyColl.size.height=ENDATA[this.ep.category]["phySize"][this.ep.kind-1].y;
		this.phyColl.apply();
		this.ep.specialEffect="invincible";
		
        if(this.ep.kind==1||this.ep.kind==8){
			var sumSpeed=this.beginSpeed.mag();
			var cx=this.node.x-ALL.Lead.x;
			var cy=this.node.y-ALL.Lead.y;
			this.dir.x=cx>0?-1:1;
			this.dir.y=cy>0?-1:1;
			var d=cc.v2(cx,cy).mag();
			var cosX=Math.abs(cx)/d;
			var sinX=Math.abs(cy)/d;
			this.beginSpeed=cc.v2(sumSpeed*cosX,sumSpeed*sinX);
        }else if(this.ep.kind==4){
			this.damage=2;
		}else if(this.ep.kind==6){
			this.body.gravityScale=0.2;
        }
		
		this.node.scaleX=this.dir.x;
		this.body.linearVelocity=cc.v2(this.beginSpeed.x*this.dir.x,this.beginSpeed.y*this.dir.y);
		
		this.playState="Enemy_Ebullet"+this.ep.kind;
        this.lastPlayState=this.playState;
        this.player.play(this.playState);
    },

    update: function (dt) {
        this.ep.visDie();
		this.changeAction();
    },
	
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(other.node.name=="Lead"){
			
        }else if(other.node.name.indexOf("Object")!=-1){
			if(this.ep.kind==6&&this.ep.isOnFloor(contact)&&this.collFloorCnt++==0){
				this.body.linearVelocity=cc.v2(this.body.linearVelocity.x/3,this.beginSpeed.y);
			}else{
				this.ep.die();
			}
        }else if(other.node.name.indexOf("Arms")!=-1){
            
        }
	},
    
    changeAction:function(){
        if(this.playState!=this.lastPlayState){
            this.player.play(this.playState);
            this.lastPlayState=this.playState;
        }
    },

});
