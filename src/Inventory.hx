class Inventory extends Field{
    public function new(scene, spriteName, h:Int, w:Int, fieldDimensions, fieldShift){
        this.fieldType = 'inventory';
        super(scene, spriteName, h, w, fieldDimensions, fieldShift);
    }
    override public function cellAction(x, y, item:Item){
        var inventoryItem = this.items[x][y];

        if(inventoryItem.sprite.texture.key == item.sprite.texture.key){
            inventoryItem.quantity++;
            this.indicators[x][y].updateText(inventoryItem.quantity+'');
            activateItemSprite(inventoryItem);
            this.placeBack(item);
        }
        else{
            this.placeBack(item);
        }
    }
    public function addItem(name){
        var itemArray = this.items;
        for(i in 0...itemArray.length){
            for(j in 0...itemArray[i].length){
                if(itemArray[i][j].sprite.texture.key == name){
                    var item = itemArray[i][j];
                    item.quantity++;
                    this.indicators[i][j].updateText(item.quantity+'');
                    activateItemSprite(item);
                }
            }
        }
    }
    public function activateItemSprite(item : Item){
        item.sprite.input.cursor = Settings.CURSOR_POINTER;
        this.scene.input.setDraggable(item.sprite, true);
        item.sprite.setAlpha(1);

    }
}