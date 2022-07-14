class FarmField extends Field{
    public function new(scene, spriteName, h:Int, w:Int, fieldDimensions, fieldShift){
        this.fieldType = 'farm';
        super(scene, spriteName, h, w, fieldDimensions, fieldShift);
    }
    override public function cellAction(x, y, item:Item){
        var fieldItem = this.items[x][y];
        if(fieldItem.sprite == null){
            switch(item.type){
                case "plant":
                    initItem(item.sprite.texture.key, y, x, 60,40, {"name":this.fieldType,"x":x,"y":y,"type":"plant","quantity":1});
                    this.indicators[x][y].initPlantTimer(10);
                    this.scene.input.setDraggable(this.items[x][y].sprite, false);
                    this.items[x][y].sprite.input.cursor = Settings.CURSOR_DEFAULT;

                    this.placeBack(item);
                    item.quantity--;
                    if(item.quantity <= 0){
                        this.scene.input.setDraggable(item.sprite, false);
                        item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
                        item.sprite.setAlpha(0.3);
                    }
                case "animal":
                    initItem(item.sprite.texture.key, y, x, 60,60, {"name":this.fieldType,"x":x,"y":y,"type":"animal","quantity":1});
                    switch(item.sprite.texture.key){
                        case "chicken":
                            this.indicators[x][y].initAnimalTimer(10,30);
                        case "cow":
                            this.indicators[x][y].initAnimalTimer(20,20);
                    }
                    this.scene.input.setDraggable(this.items[x][y].sprite, false);
                    this.placeBack(item);
                    item.quantity--;
                    if(item.quantity <= 0){
                        this.scene.input.setDraggable(item.sprite, false);
                        item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
                        item.sprite.setAlpha(0.3);
                    }
                case "product":
                    this.placeBack(item);
                case "clear":
                    this.placeBack(item);
            }
        }
        else{
            switch(item.type){
                case "plant":
                    if((fieldItem.sprite.texture.key =="cow" || fieldItem.sprite.texture.key =="chicken") && item.sprite.texture.key =="wheat"){
                        this.indicators[x][y].feedAnimal();
                        this.placeBack(item);
                        item.quantity--;
                        if(item.quantity <= 0){
                            this.scene.input.setDraggable(item.sprite, false);
                            item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
                            item.sprite.setAlpha(0.3);
                        }
                    }
                    this.placeBack(item);
                case "animal":
                    this.placeBack(item);
                case "product":
                    this.placeBack(item);
                case "clear":
                    this.items[x][y].sprite.setVisible(false);
                    this.items[x][y].sprite = null;
                    this.indicators[x][y].sprite.setVisible(false);
                    this.indicators[x][y].hideBar();
                    this.indicators[x][y].hideText();
                    this.indicators[x][y].nullifyTimer();
                    this.placeBack(item);

            }
        }
    }
}