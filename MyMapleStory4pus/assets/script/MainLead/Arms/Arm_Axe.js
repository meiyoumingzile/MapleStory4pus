cc.Class({
    extends: cc.Component,
    properties: {
        minspeed:cc.v2(600,0),
        damage:1,
		category:"Axe",
		reboundCnt:0,
    },

    start:function(){
    },
	init: function(beginSpeed){
		this.node.scale=ALL.scaleLead;
        this.body = this.getComponent(cc.RigidBody);
		this.body.linearVelocity=beginSpeed;
		this.leadPos=MainLead.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
	},
    onLoad: function () {},

    onDestory: function(){
        //cc.log("武器是"+this.Lead.getComponent("Lead_control").nowArmsNum.x);
    },

    onDisabled: function () {},
    
    update :function(dt){
		//cc.log(this.leadPos);
		if(Math.abs(this.node.x-this.leadPos.x)>1000||Math.abs(this.node.y-this.leadPos.y)>1000){
			 MainLead.data.nowArmsCnt= (MainLead.data.nowArmsCnt==0?0:MainLead.data.nowArmsCnt-1);
			 this.node.destroy();
		}
		//this.body.linearVelocity = this.speed;
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
					//cc.log(other.node);
					if(other.node.name.indexOf("specialStone")!=-1){
						if(this.reboundCnt==0){
							this.reboundCnt++;
							this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,-this.body.linearVelocity.y/2);
						}else{
							this.die();
						}
					}
				}
            }
        }else if(other.node.name.indexOf("Stone1")!=-1){
           this.body.linearVelocity.x=-this.body.linearVelocity.x;
            
        }
    },
	
	die(){
		MainLead.data.nowArmsCnt= (MainLead.data.nowArmsCnt==0?0:MainLead.data.nowArmsCnt-1);
		this.node.destroy();
	},
});
