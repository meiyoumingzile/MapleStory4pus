cc.Class({
    extends: cc.Component,

    properties: {
        offset:cc.v2(0,0),
    },

    init(offset,phySize){//偏离人物的距离，和碰撞体大小
        this.offset=offset;
        this.phyColl=this.node.getComponent(cc.PhysicsBoxCollider);
        this.phyColl.size.width=phySize.x;
        this.phyColl.size.height=phySize.y;
         
    },

    update (dt) {
        this.node.x=ALL.Lead.x+this.offset.x;
        this.node.y=ALL.Lead.y+this.offset.y;
    },
});
