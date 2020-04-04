cc.Class({
    extends: cc.Component,

    properties: {
        itemList:[],
        item_i:0,
        item_sz:cc.v2(0,0),
        without:cc.SpriteFrame,
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
            case KEY.pause:
				MainLead.pause(false);
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
            
           /* if(MainLead.data.gotProp[this.itemList[i].name]&&MainLead.data.gotProp[this.itemList[i].name]==true){
                this.itemList[i].getComponent(cc.Sprite).spriteFrame=ALL.GamePropFrame[this.itemList[i].name];
            }else{
                this.itemList[i].getComponent(cc.Sprite).spriteFrame=ALL.GamePropFrame["withoutIco"];
            }*///武器加载，没有的武器显示问好
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
        if(this.itemList[this.item_i].getComponent(cc.Sprite).spriteFrame==ALL.GamePropFrame["withoutIco"]){
            return false;
        }
        var name=this.itemList[this.item_i].name;
        if(name.indexOf("goods_")==0){
            MainLead.getGoods(name.replace("goods_",""));
            MainLead. pause(false);
        }
        return true;
    },
});
