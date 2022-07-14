class ProccessIndicator extends GameElement{
    public var h:Int;
    public var w:Int;
    public var bar : phaser.gameobjects.Graphics;
    public var barLine : phaser.gameobjects.Graphics;
    public var text : phaser.gameobjects.Text;
    public var timer : phaser.time.TimerEvent;
    private var timeLeft : Int;
    private var growthTime : Int;
    private var satietyTime : Int;
    private var satietyTimeLast : Int;
    override public function new(scene, spriteName, x, y, h, w, cellInfo){
        this.w = w;
        this.h = h;

        super(scene, spriteName, x, y-Std.int(h/2), h, w, cellInfo);

        this.sprite.setDepth(Settings.DEPTH_I_SPRITE);
        hideSprite();

        this.bar = this.scene.add.graphics();
        this.bar.setDefaultStyles({ lineStyle: { width: 4, color: 0xffffff, alpha: 1}});
        this.bar.lineBetween(x, y, x + w, y);

        this.barLine = this.scene.add.graphics();
        this.barLine.setDefaultStyles({ lineStyle: { width: 4, color: 0x5500ff, alpha: 1}});

        this.bar.setDepth(Settings.DEPTH_I_BAR);
        this.barLine.setDepth(Settings.DEPTH_I_BARLINE);
        hideBar();
        this.text = this.scene.add.text(x+w - Std.int(w/2), y+h - Std.int(h/3), "", { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });

        this.text.setDepth(Settings.DEPTH_I_TEXT);
        hideText();
    }

    public function updateBarLine(percent:Float){
        this.barLine.clear();
        this.barLine.lineBetween(this.x, this.y + Std.int(this.h/2), this.x + this.w * percent, this.y + Std.int(this.h/2));
        showBar();
    }
    public function updateText(value:String){
        this.text.setText(value);
        showText();
    }
    public function showSprite(){
        this.sprite.setVisible(true);
    }
    public function showBar(){
        this.bar.setVisible(true);
        this.barLine.setVisible(true);
    }
    public function showText(){
        this.text.setVisible(true);
    }
    public function hideSprite(){
        this.sprite.setVisible(false);
    }
    public function hideBar(){
        this.bar.setVisible(false);
        this.barLine.setVisible(false);
    }
    public function hideText(){
        this.text.setVisible(false);
    }
    public function initPlantTimer(growthTime : Int){
        this.growthTime = growthTime;
        this.timeLeft = growthTime;
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: growPlant,
            callbackScope: this,
            loop: true
        });
    }
    private function growPlant(){
        this.timeLeft--;
        updateText(this.timeLeft + '');
        updateBarLine((this.growthTime - this.timeLeft) / this.growthTime);
        if(this.timeLeft <= 0){
            growPlantEnd();
        }
    }
    private function growPlantEnd(){
        this.timer.paused = true;
        showSprite();
        hideBar();
        hideText();
    }
    public function growPlantResume(){
        this.timeLeft = growthTime;
        this.timer.paused = false;
    }

    public function initAnimalTimer(growthTime : Int, satietyTime : Int){
        this.growthTime = growthTime;
        this.satietyTime = satietyTime;
        this.satietyTimeLast = 0;
        this.timeLeft = growthTime;
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: growAnimal,
            callbackScope: this,
            loop: true
        });
    }

    private function growAnimal(){
        if(satietyTimeLast > 0){
            this.satietyTimeLast--;
            this.timeLeft--;
            updateText(this.timeLeft + '');
            updateBarLine((this.growthTime - this.timeLeft) / this.growthTime);
            if(this.timeLeft <= 0){
                growAnimalEnd();
            }
        }
        else{
            this.timer.paused = true;
        }
    }
    private function growAnimalEnd(){
        this.timer.paused = true;
        showSprite();
        hideBar();
        hideText();
    }
    public function growAnimalResume(){
        if(satietyTimeLast > 0){
            this.timeLeft = growthTime;
            this.timer.paused = false;
        }
    }
    public function feedAnimal(){
        this.satietyTimeLast += this.satietyTime;
        if(this.timer.paused){
            this.timeLeft = growthTime;
            this.timer.paused = false;
        }
    }
    public function nullifyTimer(){
        this.timer.paused = true;
        this.timeLeft = 0;
        this.growthTime = 0;
        this.satietyTime = 0;
        this.satietyTimeLast = 0;

    }

}