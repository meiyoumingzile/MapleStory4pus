cc.Class({
    extends: cc.Component,

    properties: {
        pics:[cc.SpriteFrame],
        invisible:false,
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.thing=this.node.getChildren()[0];
        this.life=2;
        this.collLead=false;
        this.judge();
        this.thing.active=false;
        this.node.getComponent(cc.Sprite).spriteFrame=this.invisible?this.pics[0]:null;
    },

    
    update: function (dt) {
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
        if(!this.invisible){
            if(other.node.ap&&LEADDATA.ARMS.disappearEGG.indexOf(other.node.ap.category)!=-1){
                other.node.die();
            }
            if(other.node.name=="Lead"&&other.tag==0){
                contact.disabled=true;
            }
            return;
        }
        //----------------------------------------
        if(other.node.group=="Arm"){
            if(other.node.ap&&other.node.ap.damage){
                if(LEADDATA.ARMS.disappearEGG.indexOf(other.node.ap.category)!=-1){
                    other.node.die();
                }
                this.life-=other.node.ap.damage;
                if(this.life<1){
                    this.thing.active=true;
                    this.thing.setParent(this.node.parent);
                    this.thing.position=this.node.position;
                    this.node.destroy();
                }else{
                    this.node.getComponent(cc.Sprite).spriteFrame= this.pics[1];
                }
            }
        }
        if(other.node.name.indexOf("Object")!=-1&&this.life<2){
            this.thing.active=true;
            this.thing.setParent(this.node.parent);
            this.thing.position=this.node.position;
            this.node.destroy();
        }
        if(other.node.name=="Lead"&&other.tag==0){
            contact.disabled=true;
            if(!this.collLead){
                this.collLead=true;
                this.life=1;
                var a=Math.abs(sp.x)<50?0:Math.abs(sp.x)/100;
                var speedx=(1-1/Math.exp(a))*400;
                this.body.linearVelocity=cc.v2(speedx*Math.sign(this.node.x-MainLead.node.x),700);
                this.node.getComponent(cc.Sprite).spriteFrame= this.pics[1];
            }
        }
    },
    onEndContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        var sp=MainLead.body.linearVelocity;
        if(!this.invisible&&ALL.Lead.position.y>this.node.position.y+this.node.width/2){
            this.node.getComponent(cc.Sprite).spriteFrame=this.pics[0];
            this.invisible=true;
            return;
        }
    },
    judge: function (){
		
    },
});
