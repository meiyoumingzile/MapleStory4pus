cc.Class({
    extends: cc.Component,

    properties: {
        goods:cc.Node,
        treasure_ultimate:cc.Node,
        otherGoods:cc.Node,
        gemstone:cc.Node,
        itemList:[],
        item_i:0,
        item_sz:cc.v2(0,0),
        withoutIco:cc.SpriteFrame,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },
    init(){//在Lead里实现
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.hand=ALL.MainCanSc.findChildren(this.node,"HAND");
        var sz=ALL.MainCanSc.getWindows();
        this.node.width=sz.x;
        this.node.height=sz.y;
        this.goodsNodeDir={};
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
                if(this.sel()){
                    cc.audioEngine.play(ALL.RES.LeadMusic["menu_selTrue"], false, ALL.musicVolume);
                }else{
                    cc.audioEngine.play(ALL.RES.LeadMusic["menu_selFalse"], false, ALL.musicVolume);
                }
                break;
            case KEY.pause:
				MainLead.pause(false);
				break;
        }
    },
    // update (dt) {},
    initItem(){
        var ch= this.goods.getChildren();
        var item_i=-1;
        for(var i=0;i<ch.length;i++){
            this.itemList[++item_i]=ch[i];
            this.goodsNodeDir[ch[i].name]=ch[i];
            if(MainLead.data.goods[ch[i].name]==null)
                MainLead.data.goods[ch[i].name]=false;
            this.displayProp(ch[i].name);
            if(Math.abs(this.itemList[0].x-this.itemList[item_i].x)<1){//x移动宽增长
                this.item_sz.y++;
            }
            if(Math.abs(this.itemList[0].y-this.itemList[item_i].y)<1){//y移动长增长
                this.item_sz.x++;
            }
        }
        var ch= this.otherGoods.getChildren();
        for(var i=0;i<ch.length;i++){
            this.goodsNodeDir[ch[i].name]=ch[i];
            if(MainLead.data.goods[ch[i].name]==null)
                MainLead.data.goods[ch[i].name]=false;
            this.displayProp(ch[i].name);
        }
        var ch= this.gemstone.getChildren();
        for(var i=0;i<ch.length;i++){
            this.goodsNodeDir[ch[i].name]=ch[i];
            if(MainLead.data.goods[ch[i].name]==null)
                MainLead.data.goods[ch[i].name]=false;
            this.displayProp(ch[i].name);
        }
        var ch= this.treasure_ultimate.getChildren();
        for(var i=0;i<ch.length;i++){
            this.goodsNodeDir[ch[i].name]=ch[i];
            if(MainLead.data.goods[ch[i].name]==null)
                MainLead.data.goods[ch[i].name]=false;
            this.displayProp(ch[i].name);
        }
        this.hand.x=this.itemList[this.item_i].x+ this.goods.x;
        this.hand.y=this.itemList[this.item_i].y+ this.goods.y;

    },

    updateHand(fp){//fp是方向cc.v2类型
        cc.audioEngine.play(ALL.RES.LeadMusic["menu_move"], false, ALL.musicVolume);
        this.item_i+=fp.y*this.item_sz.x;
        this.item_i+=fp.x;
        this.item_i= (this.item_i+ this.itemList.length)%this.itemList.length;
        this.hand.x=this.itemList[this.item_i].x+ this.goods.x;
        this.hand.y=this.itemList[this.item_i].y+ this.goods.y;
    },
    sel(){
        if(this.itemList[this.item_i].getComponent(cc.Sprite).spriteFrame==this.withoutIco){
            
            return false;
        }
        var name=this.itemList[this.item_i].name;
        if(name.indexOf("goods_")==0){//是武器
            if(MainLead.data.state[2]==MainLead.data.chooseDragon)
                MainLead.saveDragon();
            MainLead.useGoods(name.replace("goods_",""));
            /*
            还要判断在水下不能选择
            return false;
            */
            MainLead. pause(false);
        }else if(name=="medicine"){//如果是药
            if(MainLead.data.life.x==MainLead.data.life.y){//满血不能加血
                return false;
            }
            MainLead.changeLife(8,0);
            MainLead.data.goods[name]=false;
            this.displayProp(name);
            MainLead.pause(false);
        }else if(name=="gohome"){//如果是回家
            if(cc.director.getScene().name=="home"){//满血不能加血
                return false;
            }
            MainLead.data.goods[name]=false;
            this.displayProp(name);
            MainLead.pause(false);
            MainLead.jumpSence("home",cc.v2(-4400,162));
        }else if(name=="compass"){//如果是指南针
            cc.log("地图");
        }else if(name=="markEgg"){//如果是标记点
            cc.log("标记点");
        }else if(name=="dragon"){//如果是龙
            var sand=MainLead.coll.collSand;
            if(sand)
                cc.log(ALL.MainCanSc.getBorderY(sand,1),MainLead.borderY(1));
            if(MainLead.data.isLie||MainLead.data.isClimb||
                MainLead.data.state[2]!=MainLead.data.chooseDragon&&MainLead.data.isSaveDragon==false||
                MainLead.data.chooseDragon=='Stegosaurus'&&sand&&ALL.MainCanSc.getBorderY(sand,1)+10>MainLead.borderY(1)){
                return false;
            }
            MainLead.saveDragon();
            MainLead.pause(false);
        }else if(name=="shank"){//如果是回家手柄
            cc.log("显示作者信息");
        }
        return true;
    },


    displayProp(name){//道具名称，empty=true失败显示成"?"
        var have=MainLead.data.goods[name];
        if(name=="pot"){
            this.displayPot(MainLead.data.potCnt);
        }else if(name=="dragon"){
            this.displayDragon();
        }else if(have&&have==true){
            this.goodsNodeDir[name].getComponent(cc.Sprite).spriteFrame=ALL.RES.GamePropFrame[name];
        }else{
            this.goodsNodeDir[name].getComponent(cc.Sprite).spriteFrame=ALL.MainCanSc.findChildren(this.goods,name)?this.withoutIco:null;//没有就不显示
        }
    },
    displayPot(cnt){
        var node=this.goodsNodeDir["pot"];
        var cntLabel=ALL.MainCanSc.findChildren(node,"cnt");
        if(cntLabel&&node){
            if(cnt<1){
                node.getComponent(cc.Sprite).spriteFrame=null;
                cntLabel.active=false;
            }else if(cnt==1){
                node.getComponent(cc.Sprite).spriteFrame=ALL.RES.GamePropFrame["pot"];
                cntLabel.active=false;
            }else{
                node.getComponent(cc.Sprite).spriteFrame=ALL.RES.GamePropFrame["pot"];
                cntLabel.getComponent(cc.Label).string="×"+cnt;
                cntLabel.active=true;
            }
        }else{
            cc.log("节点错误");
        }
    },
    displayDragon(){
        var node=this.goodsNodeDir["dragon"];
        if(LEADDATA.Pets.indexOf(MainLead.data.chooseDragon)!=-1){//存在龙
            node.getComponent(cc.Sprite).spriteFrame=ALL.RES.GamePropFrame[MainLead.data.chooseDragon+"_symbol"];
            node.opacity=MainLead.data.isSaveDragon?255:100;
        }else{
            node.getComponent(cc.Sprite).spriteFrame=this.withoutIco;
        }
    },

});
