cc.Class({
    extends: cc.Component,
    properties: {
        damage:2,
		category:"axe",
		isDam:false,
    },

	init: function(beginSpeed,time1=3,time2=1){//time1是多久爆炸，time2是爆炸持续时间
		this.node.scale=ALL.scaleLead;
		this.body = this.node.getComponent(cc.RigidBody);
		this.phyCir=this.node.getComponent(cc.PhysicsCircleCollider);//获得碰撞体
		this.phyBox=this.node.getComponent(cc.PhysicsBoxCollider);//获得碰撞体
		this.player =this.node.getComponent(cc.Animation);
		this.body.linearVelocity=beginSpeed;
		
		var t1=time1*10;
		var sumCnt=(time1+time2)*10;
		var cnt=0;
		this.callbackBlast = function(){//无前摇
			if(cnt==t1){
				this.isDam=true;
				this.node.name="Arm_bomb";
				this.player.play("blast2");
				this.phyBox.enabled=true;
				this.node.removeComponent(cc.PhysicsCircleCollider);
				this.body.linearVelocity=cc.v2(0,0);
				this.body.type="Static";
				if(MainLead.data.collFloorDir[this.phyCir._id]){
					delete MainLead.data.collFloorDir[this.phyCir._id];
					MainLead.data.collFloorCnt--;
				}
				this.phyBox.apply();
			}else if(cnt==sumCnt){
				this.die();
				this.unschedule(this.callbackBlast);
			}
			cnt++;
		}
		this.schedule(this.callbackBlast,0.1,sumCnt,0);
	},
    onDestory: function(){
        //cc.log("武器是"+this.Lead.getComponent("Lead_control").nowArmsNum.x);
    },

    
    update :function(dt){
		if(Math.abs(this.node.x-ALL.Lead.x)>1000||Math.abs(this.node.y-ALL.Lead.y)>1000){
			this.die();
		}
    },
	onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
		if(!this.isDam){
			if(other.node.name.indexOf("Enemy")!=-1){
				contact.disabled=true;
			}
			return;
		}
		
		if(other.node.name.indexOf("Enemy")==0){
			var js=other.node.getComponent("EnemyPublic");
            if(js&&js.specialEffect=="null"){
				var d=js.changeLife(-this.damage,this.category);
            }
		}
    },
	
	die(){
		MainLead.data.nowArmsCnt= (MainLead.data.nowArmsCnt==0?0:MainLead.data.nowArmsCnt-1);
		this.node.destroy();
	},
});
