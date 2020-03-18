cc.Class({
    extends: cc.Component,

    properties: {
        damage:1,
    },

    
    onLoad: function () {
    
    },

    
    update: function (dt) {
       
    },





    onCollisionEnter: function (other, self){
    	if(other.node.name=="Lead"){
            if(ALL.Lead.getComponent("Lead_control").Data.state_character=="Lead"&&ALL.Lead.getComponent("Lead_control").data.specialEffect=="null"){
                ALL.Lifes.getComponent("Lifes").changeLife(-this.damage,0);
            }else{

            }
        }
       
    },

    onCollisionStay: function (other, self){
        
    },

    onCollisionExit: function (other, self){

    },




    
    
});
