
class PlayScene extends Scene {

    public var settings : Settings;

    public var coin : phaser.gameobjects.Sprite;

    public var player : Player;
    public var farmField : FarmField;
    public var inventory : Inventory;
    public var shop : Shop;
    public var timeValue = 0;

    public var textCoin : phaser.gameobjects.Text;

    public function preload(){
        this.settings = new Settings(this, "scene1");
        settings.load();
    }
    public function create() {
        settings.init();

        this.input.on("gameobjectdown", function(pointer,currentlyOver) {
            if(~/farm.+/i.match(currentlyOver.name)){
                var params = currentlyOver.name.split(' ');
                harvestHandle(Std.parseInt(params[1]),Std.parseInt(params[2]));
            }
        });
        this.input.on('dragstart', function (pointer, sprite, dragX, dragY) {
            sprite.originX = sprite.x;
            sprite.originY = sprite.y;
            sprite.setDepth(Settings.DEPTH_ITEM);
        });
        this.input.on('drag', function (pointer, sprite, dragX, dragY) {
            sprite.x = dragX;
            sprite.y = dragY;
        });

        this.input.on('dragend', function (pointer, sprite, dropped) {
            sprite.setDepth(Settings.DEPTH_PLACED_ITEM);
            if(!dropped){
                sprite.x = sprite.originX;
                sprite.y = sprite.originY;
            }
        });
        this.input.on('drop', function (pointer, gameObject, target) {
            gameObject.x = target.x;
            gameObject.y = target.y;
            actionHandle(target,gameObject);
        });
        this.shop.update(this.player.cash);

    }

    public function objectInit(name:String, x:Int, y:Int, h:Int, w:Int, v:String = ""){
        switch (name){
            case "coin":
                this.coin = this.add.sprite(0, 0, name);
                this.coin.setPosition(x+w/2, y+h/2);
                this.coin.setDisplaySize(h,w);
                this.player = new Player();
                this.textCoin = this.add.text(x+w+10, y+7, 0, Settings.HEADER_PARAMS);
                coin.setDepth(Settings.DEPTH_TEXT);
                textCoin.setDepth(Settings.DEPTH_TEXT);
            case "shop":
                var shopText = this.add.text(x, y, v, Settings.HEADER_PARAMS);
                shopText.setDepth(Settings.DEPTH_TEXT);

                var coinImage = this.add.sprite(0, 0, "coin");
                coinImage.setPosition(x+ 32, y+82);
                coinImage.setDisplaySize(60,40);
                coinImage.setAlpha(0.2);

                coinImage.setDepth(Settings.DEPTH_PLACED_ITEM);
            case "inventory":
                var inventoryText = this.add.text(x, y, v, Settings.HEADER_PARAMS);
                inventoryText.setDepth(Settings.DEPTH_TEXT);
            case "soil":
                this.farmField = new FarmField(this, name, h, w, Settings.FARM_FIELD_DIMENSIONS, Settings.FARM_FIELD_SHIFT);
            case "cell":
                this.inventory = new Inventory(this, name, h, w, Settings.INVENTORY_FIELD_DIMENSIONS, Settings.INVENTORY_FIELD_SHIFT);
                this.shop = new Shop(this, name, h, w, Settings.STORE_FIELD_DIMENSIONS, Settings.STORE_FIELD_SHIFT);
            case "chicken":
                this.inventory.initItem(name, x, y, h, w, {"name":"None","x":0,"y":0,"type":"animal","quantity":4});
                this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity+'');
                this.shop.initItem(name, x, y + 1, h, w, {"name":"None","x":0,"y":0});
                this.shop.indicators[y + 1][x].updateText("$"+Settings.PRICE_CHICKEN);
                var indicator = this.shop.indicators[y + 1][x];
                indicator.text.setPosition(indicator.text.x - 20, indicator.text.y);
                this.shop.items[y+1][x].price = Settings.PRICE_CHICKEN;
            case "wheat":
                this.inventory.initItem(name, x, y, h, w, {"name":"None","x":0,"y":0,"type":"plant","quantity":4});
                this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity+'');
                this.shop.initItem(name, x, y + 1, h, w, {"name":"None","x":0,"y":0});
                this.shop.indicators[y + 1][x].updateText("$"+Settings.PRICE_WHEAT);
                var indicator = this.shop.indicators[y + 1][x];
                indicator.text.setPosition(indicator.text.x - 20, indicator.text.y);
                this.shop.items[y+1][x].price = Settings.PRICE_WHEAT;
            case "cow":
                this.inventory.initItem(name, x, y, h, w, {"name":"None","x":0,"y":0,"type":"animal","quantity":4});
                this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity+'');
                this.shop.initItem(name, x, y + 1, h, w, {"name":"None","x":0,"y":0});
                this.shop.indicators[y + 1][x].updateText("$"+Settings.PRICE_COW);
                var indicator = this.shop.indicators[y + 1][x];
                indicator.text.setPosition(indicator.text.x - 20, indicator.text.y);
                this.shop.items[y+1][x].price = Settings.PRICE_COW;
            case "clear":
                this.inventory.initItem(name, x, y, h, w, {"name":"None","x":0,"y":0,"type":"clear","quantity":-1});
                this.inventory.indicators[y][x].updateText("∞");
            case "egg":
                this.inventory.initItem(name, x, y, h, w, {"name":"None","x":0,"y":0,"type":"product","quantity":4});
                this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity+'');
                this.inventory.items[y][x].price = Settings.PRICE_EGG;
            case "milk":
                this.inventory.initItem(name, x, y, h, w, {"name":"None","x":0,"y":0,"type":"product","quantity":4});
                this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity+'');
                this.inventory.items[y][x].price = Settings.PRICE_MILK;
        }
    }
    public function actionHandle(targetObject, gameObject){
        var targetValues = targetObject.name.split(' ');
        var gameObjectValues = gameObject.name.split(' ');
        var targetX = Std.parseInt(targetValues[1]);
        var targetY = Std.parseInt(targetValues[2]);
        var objectX = Std.parseInt(gameObjectValues[1]);
        var objectY = Std.parseInt(gameObjectValues[2]);
        switch(gameObjectValues[0]){
            case 'inventory':
                switch(targetValues[0]){
                    case 'farm':
                        this.farmField.cellAction(targetX,targetY,this.inventory.items[objectX][objectY]);
                        if(this.inventory.items[objectX][objectY].quantity==-1){
                            this.inventory.indicators[objectX][objectY].updateText('∞');
                        }
                        else{
                            this.inventory.indicators[objectX][objectY].updateText(this.inventory.items[objectX][objectY].quantity+'');
                        }
                    case 'inventory':
                        if(objectX != targetX || objectY != targetY){
                            this.inventory.cellAction(targetX,targetY,this.inventory.items[objectX][objectY]);
                            this.inventory.indicators[objectX][objectY].updateText(this.inventory.items[objectX][objectY].quantity+'');
                        }
                    case 'shop':
                        var inventoryItem = this.inventory.items[objectX][objectY];
                        if(targetX == 0 && targetY == 0 && inventoryItem.type == "product"){
                            this.player.cash += inventoryItem.quantity * inventoryItem.price;
                            //update store indicatots, update item alfa & drop
                            inventoryItem.quantity = 0;
                            this.inventory.indicators[objectX][objectY].updateText(inventoryItem.quantity+'');

                            placeBack(inventoryItem.sprite);
                            this.input.setDraggable(inventoryItem.sprite, false);
                            inventoryItem.sprite.input.cursor = Settings.CURSOR_DEFAULT;
                            inventoryItem.sprite.setAlpha(0.3);

                            this.textCoin.setText(this.player.cash);
                            this.shop.update(this.player.cash);
                        }
                        else{
                            placeBack(gameObject);
                        }
                }
            case 'shop':
                switch(targetValues[0]){
                    case 'farm':
                        placeBack(gameObject);
                    case 'inventory':
                        var cash = this.player.cash;
                        var price = this.shop.items[objectX][objectY].price;
                        if(price <= cash){
                            this.inventory.cellAction(targetX,targetY,this.shop.items[objectX][objectY]);
                            this.player.cash -= price;
                            this.textCoin.setText(this.player.cash);
                            this.shop.update(this.player.cash);
                        }
                    case 'shop':
                        placeBack(gameObject);
                }

        }

    }
    private function harvestHandle(objectX,objectY){
        if(this.farmField.items[objectX][objectY].sprite != null){
            switch(this.farmField.items[objectX][objectY].sprite.texture.key){
                case "wheat":
                    this.inventory.addItem("wheat");
                    var indicator = this.farmField.indicators[objectX][objectY];
                    indicator.hideSprite();
                    indicator.growPlantResume();
                case "cow":
                    this.inventory.addItem("milk");
                    var indicator = this.farmField.indicators[objectX][objectY];
                    indicator.hideSprite();
                    indicator.growAnimalResume();
                case "chicken":
                    this.inventory.addItem("egg");
                    var indicator = this.farmField.indicators[objectX][objectY];
                    indicator.hideSprite();
                    indicator.growAnimalResume();
            }
        }
        this.shop.update(this.player.cash);
    }
    private static function placeBack(gameObject){
        gameObject.x = gameObject.originX;
        gameObject.y = gameObject.originY;
    }

}

