cc.Class({
    extends: cc.Component,

    properties: {
        beginOffset:cc.v2(0,0),
        damage:1,
        category:"",
    },

    init:function(category,offset,phySize){//偏离人物的距离，和碰撞体大小
       // cc.log(category,offset,phySize);
        this.category=category;
        this.node.category=category;
        MainLead.data.nowArmsCnt[this.category]++;
        this.node.die=this.die;
		
        this.node.name="Arm_"+category;
        this.beginOffset=offset;
        this.beginOffset.x=Math.abs(this.beginOffset.x);
        this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);
        this.phyColl.size.width=phySize.x;
        this.phyColl.size.height=phySize.y;
        this.node.width=phySize.x;
        this.node.height=phySize.y;
        this.phyColl.apply();
        this.node.scaleX=ALL.scaleLead.x;
		this.node.scaleY=ALL.scaleLead.y;
    },

    update :function(dt) {
        this.node.x=ALL.Lead.x+this.beginOffset.x*(ALL.Lead.scaleX>0?1:-1);
        this.node.y=ALL.Lead.y+this.beginOffset.y;
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        if(other.node.name.indexOf("Enemy")==0&&this.category!="umbrella"){
			var js=other.node.getComponent("EnemyPublic");
            if(js&&js.specialEffect=="null"){
                var d=js.changeLife(-this.damage,this.category);
                if(this.category=="scooter"){
					MainLead.body.linearVelocity=cc.v2(MainLead.body.linearVelocity.x,300);
                }
            }
        }
    },
	
    die(){
        MainLead.data.nowArmsCnt[this.category]--;//this.category和this.node.category都有
		if(this.node){
			this.node.destroy();
		}else if(this.destroy){
			this.destroy();
		}
	},
});
