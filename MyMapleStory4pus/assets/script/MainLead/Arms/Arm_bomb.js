cc.Class({
    extends: cc.Component,
    properties: {
		isDam:false,
    },
	start:function(){
		this.ap=this.node.getComponent("ArmPublic");
		this.ap.damage=4;
    },
	init: function(beginSpeed,time1=3,time2=1){//time1是多久爆炸，time2是爆炸持续时间
		this.ap=this.node.getComponent("ArmPublic");
		this.ap.category="bomb";
		MainLead.data.nowArmsCnt[this.ap.category]++;
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
				cc.audioEngine.play(ALL.RES.LeadMusic[this.node.name], false, ALL.musicVolume);
				this.player.play("blast2");
				this.node.group="Arm";
				this.phyBox.enabled=true;
				MainLead.removeColl(this.phyCir);
				
				this.node.removeComponent(cc.PhysicsCircleCollider);
				this.body.linearVelocity=cc.v2(0,0);
				this.body.type="Static";
				this.phyBox.apply();
			}else if(cnt==sumCnt){
				this.ap.die();
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
			this.ap.die();
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
				var d=js.changeLife(-this.ap.damage,this.ap.category);
            }
		}
    },
	
});
