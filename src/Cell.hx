class Cell extends GameElement{
    public function new(scene, spriteName, x, y, h, w, cellInfo){
        this.interactiveOption = 'drop';
        super(scene, spriteName, x, y, h, w, cellInfo);
        this.sprite.setDepth(Settings.DEPTH_CELL);
    }
}