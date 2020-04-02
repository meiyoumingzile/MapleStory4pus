cc.Class({
    extends: cc.Component,
    properties: {
        damage:1,
		category:"boomerang",
    },

    start:function(){
    },
	init: function(beginSpeed,rotFp,beginAngle){//rotFp==1代表逆时针
		this.node.scale=ALL.scaleLead;
        this.body = this.getComponent(cc.RigidBody);
		this.body.linearVelocity=beginSpeed;
		this.leadPos=cc.v2(MainLead.node.x,MainLead.node.y);
		this.rotFp=rotFp;
		this.linearMoveDis=340;
		this.circle_r=80;//半径
		this.sumV=beginSpeed.mag();//合线速度v=sqrt(x*x+y*y)
		this.circle_w=this.sumV/this.circle_r;//角速度，圆周运动公式，v=w*r
		this.beginAngle=beginAngle;//计算时的初始角度
		this.nowAngle=this.beginAngle;//初始角度，逆时针,弧度制，0代表从圆最低侧开始逆时针运动
	},

    update :function(dt){
		if(Math.abs(this.node.x-this.leadPos.x)>1000||Math.abs(this.node.y-this.leadPos.y)>1000){
			this.die();
		}
		var speed=this.body.linearVelocity;
		
		if(this.linearMoveDis>0){
			this.linearMoveDis-=this.sumV*dt;
		}else if(Math.abs(this.nowAngle-this.beginAngle)<Math.PI){
			speed.x=this.rotFp*this.sumV*Math.cos(this.nowAngle);
			speed.y=this.rotFp*this.sumV*Math.sin(this.nowAngle);
			this.nowAngle+=this.circle_w*dt*this.rotFp;
		}else{
			var cx=this.node.x-ALL.Lead.x;
			var cy=this.node.y-ALL.Lead.y;
			var ffp=cc.v2(cx>0?-1:1,cy>0?-1:1);
			var d=cc.v2(cx,cy).mag();
			var cosX=Math.abs(cx)/d;
			var sinX=Math.abs(cy)/d;
			speed.x=this.sumV*cosX*ffp.x;
			speed.y=this.sumV*sinX*ffp.y;
		}
		

		this.body.linearVelocity = speed;
    },
    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
       if(other.node.name.indexOf("Enemy")==0){
			var js=other.node.getComponent("EnemyPublic");
            if(js&&js.specialEffect=="null"){
				js.changeLife(-this.damage,this.category);
            }
        }else if(other.node.name=="Lead"){
			this.die();
		}
    },
	
	die(){
		MainLead.data.nowArmsCnt[this.category]--;
		this.node.destroy();
	},
});
