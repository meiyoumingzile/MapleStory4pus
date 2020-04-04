cc.Class({
    extends: cc.Component,
    properties: {
		maxSpeed:cc.v2(600,600),
		beginPos:cc.v2(0,0),
		damage:1,
		category:"DragonSto",
		reboundCnt:0,
    },

    start:function(){
    },
	init: function(beginSpeed,beginPos){
		MainLead.data.nowArmsCnt[this.category]++;
		this.node.scale=ALL.scaleLead;
        this.body = this.getComponent(cc.RigidBody);
		this.body.linearVelocity=beginSpeed;
		this.beginPos=beginPos;
	},
    onLoad: function () {},

    onDestory: function(){
    },

    onDisabled: function () {},
    
    update :function(dt){
		let dis=this.beginPos.sub(cc.v2(this.node.x,this.node.y)).mag();
		if(dis>1500){
			this.die();
		}
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name.indexOf("Object0")!=-1){//碰撞的了第一类物体，就消失
           this.die();
        }else if(other.node.name.indexOf("Enemy")==0){
            var js=other.node.getComponent("EnemyPublic");
            if(js&&js.specialEffect=="null"){
                var d=js.changeLife(-this.damage,this.category);
				if(d==1){
					this.die();
				}else if(d==0){
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
           //this.body.linearVelocity.x=-this.body.linearVelocity.x;
            
        }
    },
	die(){
		MainLead.data.nowArmsCnt[this.category]--;
		this.node.destroy();
	},
});
