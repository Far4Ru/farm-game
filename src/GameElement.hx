class GameElement{
    public var x : Int;
    public var y : Int;
    public var sprite : phaser.gameobjects.Sprite;
    public var scene : PlayScene;
    public var spriteInfo : String;
    private var interactiveOption: String;
    public function new(scene, spriteName, x, y, h, w, cellInfo){
        this.x = x;
        this.y = y;
        this.scene = scene;

        var cellX = cellInfo.x + 0;
        var cellY = cellInfo.y + 0;
        this.spriteInfo = cellInfo.name + " " + cellX + " " + cellY;

        if(spriteName != ''){
            this.sprite = this.scene.add.sprite(0, 0, spriteName);
            this.sprite.setPosition(x+w/2, y+h/2);
            this.sprite.setDisplaySize(h,w);

            this.sprite.name = this.spriteInfo;
            this.sprite.setInteractive();

            if(interactiveOption == 'drag'){
                this.scene.input.setDraggable(this.sprite);
                this.sprite.input.cursor = Settings.CURSOR_POINTER;
            }
            else if(interactiveOption == 'drop'){
                this.sprite.input.dropZone = true;
                this.sprite.input.cursor = Settings.CURSOR_DEFAULT;
            }
        }
    }

}