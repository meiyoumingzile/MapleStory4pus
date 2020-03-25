cc.Class({
    extends: cc.Component,
    properties: {
        minspeed:cc.v2(100,0),
        damage:0.5,
		category:"waterBullet",
		reboundCnt:0,
    },

	init: function(beginSpeed){
		this.node.scale=ALL.scaleLead;
        this.body = this.getComponent(cc.RigidBody);
		this.body.linearVelocity=beginSpeed;
		this.leadPos=cc.v2(MainLead.node.x,MainLead.node.y);
		this.node.scaleX=ALL.scaleLead.x*(beginSpeed.x>0?1:-1);
		this.node.scaleY=ALL.scaleLead.y;
	},

    
    update :function(dt){
		if(Math.abs(this.node.x-this.leadPos.x)>1000||Math.abs(this.node.y-this.leadPos.y)>1000){
			 MainLead.data.nowArmsCnt= (MainLead.data.nowArmsCnt==0?0:MainLead.data.nowArmsCnt-1);
			 this.node.destroy();
		}
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name.indexOf("Object0")!=-1){//碰撞的了第一类物体，就消失
            MainLead.data.nowArmsCnt= (MainLead.data.nowArmsCnt==0?0:MainLead.data.nowArmsCnt-1);
            this.node.destroy();
        }else if(other.node.name.indexOf("Enemy")==0){
			var js=other.node.getComponent("EnemyPublic");
            if(js&&js.specialEffect=="null"){
				var d=js.changeLife(-this.damage,this.category);
				if(d==1){
					this.die();
				}else if(d==0){
					this.die();
				}
            }
        }
    },
	
	die(){
		MainLead.data.nowArmsCnt= (MainLead.data.nowArmsCnt==0?0:MainLead.data.nowArmsCnt-1);
		this.node.destroy();
	},
});
