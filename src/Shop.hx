class Shop extends Field{
    public function new(scene, spriteName, h:Int, w:Int, fieldDimensions, fieldShift){
        this.fieldType = 'shop';
        super(scene, spriteName, h, w, fieldDimensions, fieldShift);
    }
    public function update(playerCash){
        var itemArray = this.items;
        for(i in 0...itemArray.length){
            for(j in 0...itemArray[i].length){
                if(itemArray[i][j].sprite != null){
                    if(itemArray[i][j].price > playerCash){
                        disableItem(itemArray[i][j]);
                    }
                    else{
                        enableItem(itemArray[i][j]);
                    }
                }
            }
        }
    }
    private function disableItem(item : Item){
        this.scene.input.setDraggable(item.sprite, false);
        item.sprite.input.cursor = Settings.CURSOR_POINTER;
        item.sprite.setAlpha(0.3);
    }

    private function enableItem(item : Item){
        this.scene.input.setDraggable(item.sprite, true);
        item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
        item.sprite.setAlpha(1);
    }
}