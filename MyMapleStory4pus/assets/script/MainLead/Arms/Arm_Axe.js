cc.Class({
    extends: cc.Component,
    properties: {
        minspeed:cc.v2(600,0),
		reboundCnt:0,
    },

    start:function(){
		this.ap=this.node.getComponent("ArmPublic");
    },
	init: function(beginSpeed){
		cc.audioEngine.play(ALL.RES.LeadMusic[this.node.name], false, ALL.musicVolume);
		this.ap=this.node.getComponent("ArmPublic");
		this.ap.category="axe";
		MainLead.data.nowArmsCnt[this.ap.category]++;
		this.node.scale=ALL.scaleLead;
        this.body = this.getComponent(cc.RigidBody);
		this.body.linearVelocity=beginSpeed;
		this.leadPos=cc.v2(MainLead.node.x,MainLead.node.y);
	},


    onDestory: function(){
        //cc.log("武器是"+this.Lead.getComponent("Lead_control").nowArmsNum.x);
    },

    onDisabled: function () {},
    
    update :function(dt){
		if(Math.abs(this.node.x-this.leadPos.x)>1000||Math.abs(this.node.y-this.leadPos.y)>1000){
			this.ap.die();
		}
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name.indexOf("Object0")!=-1){//碰撞的了第一类物体，就消失
			if(this.body.linearVelocity.y<0){
				this.ap.die();
			}else{
				contact.disabled=true;
			}
        }else if(other.node.name.indexOf("Enemy")==0){
			var js=other.node.getComponent("EnemyPublic");
			//cc.log(js,js.specialEffect);
            if(js&&js.specialEffect=="null"){
				var d=js.changeLife(-this.ap.damage,this.ap.category);
				if(d==1){
					this.ap.die();
				}else if(d==0){
					//cc.log(other.node);
					if(other.node.name.indexOf("specialStone")!=-1){
						this.rebound();
					}
				}
            }
        }else if(other.node.name.indexOf("Stone1")!=-1){
           this.body.linearVelocity.x=-this.body.linearVelocity.x;
        }else if(other.node.name=="EGG"){
			this.rebound();
		}
	},
	rebound:function(){
		if(this.reboundCnt==0){
			this.reboundCnt++;
			this.body.linearVelocity=cc.v2(-this.body.linearVelocity.x,-this.body.linearVelocity.y/2);
		}else{
			this.ap.die();
		}
	},
});
