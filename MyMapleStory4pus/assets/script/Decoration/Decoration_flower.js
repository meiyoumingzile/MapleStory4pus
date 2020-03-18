cc.Class({
    extends: cc.Component,

    properties: {
        Prefab1:{
            default:null,
            type:cc.Prefab,
        }, 
        state:"",
        state_character:"",
        pigState:"",
        newEmpty:null,
        isAddPig:true,
        mainPos:cc.v2(0,0),
    },



    onLoad: function () {
    	this.state_character=this.node.name.slice(0,19);
    	this.state=this.node.name.slice(19,this.node.name.length);

    	if(this.state_character=="Decoration_flower1_"){
    		this.pigState="Enemy_pig1";
    	}else if(this.state_character=="Decoration_flower2_"){
            this.pigState="Enemy_pig3";
    	}else if(this.state_character=="Decoration_flower3_"){

    	}
        for(var i=this.node;i.name!="MainCanvas";i=i.parent){
            this.mainPos.x+=i.x;
            this.mainPos.y+=i.y;
        }

    },

    
    update: function (dt) {
    	this.reloadPig();
    },



    onCollisionEnter: function (other, self){
        
    },

    onCollisionExit: function (other, self){//碰撞出口，因为碰完了要改变速度和状态
       if(other.node.name=="Lead"){
       		if(this.mainPos.x+self._size.width/2+other._size.width/2-ALL.Lead.x<1&&this.isAddPig){//注意精度问题，不是和0比
       			this.addPig(1,this.pigState);
       		}else if(this.mainPos.x-self._size.width/2-other._size.width/2-ALL.Lead.x>-1&&this.isAddPig){
       			this.addPig(-1,this.pigState);
       		}
       }
        
    },




    addPig:function(dir,name){
		this.isAddPig=false;
    	var X=this.mainPos.x+dir*(this.state=="behind"?-400:1000);
    	var Y=this.mainPos.y+20;
    	var newpre=cc.instantiate(this.Prefab1);
        newpre.setPosition(cc.v2(X,Y));
        newpre.name=name;
        newpre.getComponent("EnemyPublic").lastNodeScript=this;
        var count = 0;
        this.callback = function () {
            if(count === 5) {// 
            	ALL.MainCanvas.addChild(newpre);
                this.unschedule(this.callback);
            }
            count++;
        }
        this.schedule(this.callback,0.1,5,0);
    },

    reloadPig:function(){
    	if(Math.abs(this.mainPos.x-ALL.Lead.getComponent("Lead_control").Data.cameraMove.x)>=480||
            Math.abs(this.mainPos.y-ALL.Lead.getComponent("Lead_control").Data.cameraMove.y)>=320
            ){
			this.isAddPig=true;   
        }
    },

});
