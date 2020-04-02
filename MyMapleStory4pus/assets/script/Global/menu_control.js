// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        itemList:[],
        item_i:0,
        item_sz:cc.v2(0,0),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.hand=ALL.MainCanSc.findChildren(this.node,"hand");
        var sz=ALL.MainCanSc.getWindows();
        this.node.width=sz.x;
        this.node.height=sz.y;
        this.initItem();
    },

    start () {

    },
    onKeyDown (event) {
        if(!this.node.active){
            return;
        }
        switch(event.keyCode) {
            case KEY.left:
				this.updateHand(cc.v2(-1,0));
                break;
            case KEY.right:
				this.updateHand(cc.v2(1,0));
                break;
            case KEY.up:
                this.updateHand(cc.v2(0,-1));
                break;
			case KEY.down:
                this.updateHand(cc.v2(0,1));
                break;
            case KEY.jump:
                this.sel();
                break;
        }
    },
    // update (dt) {},
    initItem(){
        this.goods=ALL.MainCanSc.findChildren(this.node,"goods");
        var ch= this.goods.getChildren();
        for(var i=0;i<ch.length;i++){
            this.itemList[i]=ch[i];
            if(Math.abs(this.itemList[0].x-this.itemList[i].x)<5){
                this.item_sz.y++;
            }
            if(Math.abs(this.itemList[0].y-this.itemList[i].y)<5){
                this.item_sz.x++;
            }
        }

        this.hand.x=this.itemList[this.item_i].x+ this.goods.x;
        this.hand.y=this.itemList[this.item_i].y+ this.goods.y;
    },

    updateHand(fp){//fp是方向cc.v2类型
        this.item_i+=fp.y*this.item_sz.x;
        this.item_i+=fp.x;
        this.item_i= (this.item_i+ this.itemList.length)%this.itemList.length;
        this.hand.x=this.itemList[this.item_i].x+ this.goods.x;
        this.hand.y=this.itemList[this.item_i].y+ this.goods.y;
    },

    sel(){
        var name=this.itemList[this.item_i].name;
        if(name.indexOf("goods_")==0){
            MainLead.getGoods(name.replace("goods_",""));
            MainLead. pause(false);
        }
    },
});
