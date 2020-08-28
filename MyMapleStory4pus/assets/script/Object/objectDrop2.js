cc.Class({
    extends: cc.Component,

    properties: {
        list:[cc.SpriteFrame],
        time:0,//毫秒
    },

    
    onLoad: function () {
        this.body = this.node.getComponent(cc.RigidBody);
        this.winSz=ALL.MainCanSc.getWindows();
        this.isCollLead=false;//有没有碰过人物
        this.listCnt=0;
    },

    
    update: function (dt) {
        if(this.isCollLead&&(Math.abs(MainLead.node.position.x-this.node.position.x)>this.winSz.x*2||Math.abs(MainLead.node.position.y-this.node.position.y)>this.winSz.y*2)){
            this.node.destroy();
        }
    },

    onBeginContact: function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
        cc.log(MainLead.coll,MainLead.coll.collFloorDir[self._id]);
		if(other.node.name=="Lead"&&other.tag==0&&MainLead.coll.collFloorDir[self._id]){
            this.visDrop();
            var fun = function(){
                if(MainLead.coll.collFloorDir[self._id]){//还被踩着
                    this.visDrop();
                }else{
                    this.unschedule(fun);
                }
			}
            this.schedule(fun,this.time,this.list.length,0);
        }
		
    },
    onPreSolve:function (contact, self, other) {// 只在两个碰撞体开始接触时被调用一次
    },
    visDrop:function(){
        var sp=this.node.getComponent(cc.Sprite);
        sp.spriteFrame= this.list[this.listCnt];
        if(this.listCnt++==this.list.length-1){
            this.isCollLead=true;
            this.body.linearVelocity=cc.v2(0,-1000);
            this.onDisable=false;
        }
    },
});
