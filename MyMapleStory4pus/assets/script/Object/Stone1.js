cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {

    },

    update: function (dt) {

    },

    onCollisionEnter: function (other, self){
        if(this.visDie(other)==true){
            this.node.destroy();
            ALL.Public.getComponent("Public").addEffect(this.node.x,this.node.y,this,"blast");
        }
    },

    visDie:function(other){
        if(other.node.name.indexOf("Arms_FireDarts")!=-1||
           other.node.name.indexOf("Brontosaurus_Arms")!=-1||
           other.node.name.indexOf("Fierydragon_Arms")!=-1||
           (other.node.name=="Lead"&&other.node.getComponent("Lead_control").Data.state.indexOf("Stegosaurus_attack")!=-1)
            ){
            return true;
        }else{
            return false;
        }
    }
});
