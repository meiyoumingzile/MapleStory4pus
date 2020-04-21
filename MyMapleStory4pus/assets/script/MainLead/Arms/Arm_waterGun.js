cc.Class({
    extends: cc.Component,
    properties: {
        damage:0.5,
		category:"waterGun",
    },
	start:function(){
		this.ap=this.node.getComponent("ArmPublic");
    },
	init: function(beginSpeed){
		this.ap=this.node.getComponent("ArmPublic");
		this.ap.category="waterGun";
		MainLead.data.nowArmsCnt[this.ap.category]++;
		this.node.scale=ALL.scaleLead;
        this.body = this.getComponent(cc.RigidBody);
		this.body.linearVelocity=beginSpeed;
		this.leadPos=cc.v2(MainLead.node.x,MainLead.node.y);
		this.node.scaleX=ALL.scaleLead.x*(beginSpeed.x>0?1:-1);
		this.node.scaleY=ALL.scaleLead.y;
	},

    
    update :function(dt){
		if(Math.abs(this.node.x-this.leadPos.x)>1000||Math.abs(this.node.y-this.leadPos.y)>1000){
			this.ap.die();
		}
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name.indexOf("Object0")!=-1){//碰撞的了第一类物体，就消失
            this.ap.die();
        }else if(other.node.name.indexOf("Enemy")==0){
			var js=other.node.getComponent("EnemyPublic");
            if(js&&js.specialEffect=="null"){
				var d=js.changeLife(-this.ap.damage,this.ap.category);
				if(d==1){
					this.ap.die();
				}else if(d==0){
					this.ap.die();
				}
            }
        }
    },
});
