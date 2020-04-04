cc.Class({
    extends: cc.Component,
    properties: {
        damage:2,
		beginPos:cc.v2(0,0),
		category:"DragonBattery",
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
		if(dis>300){
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
