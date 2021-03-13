cc.Class({
    extends: cc.Component,

    properties: {//此脚本用作一些效果处理
        player:null,
        kind:"blast",
        time:0,
    },

    onLoad: function () {
        this.player = this.node.getComponent(cc.Animation);//
        if(this.kind=="blast"){
            cc.audioEngine.play(ALL.RES.LeadMusic["monsterDie"], false, ALL.musicVolume);
            this.player.play("blast");
            var count = 0;
            this.callback = function(){
                if(count === 1){
                    this.node.destroy();
                    this.unschedule(this.callback);
                }else{
                    count++;
                }
            }
            this.schedule(this.callback,0.1700,50,0);
        }else if(this.kind=="note"){
            cc.audioEngine.play(ALL.RES.LeadMusic["getFruit"], false, ALL.musicVolume);
            this.player.play("note");
            var count = 0;
            this.callback = function(){
                if(count === 10){
                    this.node.destroy();
                    this.unschedule(this.callback);
                }else{
                    count++;
                }
            }
            this.schedule(this.callback,0.0500,50,0);
        }
    },

    update: function (dt) {
        if(this.kind=="blast"){
            
        }else if(this.kind=="note"){
            this.node.y+=5;
        }
    },
});
