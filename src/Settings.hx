typedef ImageParameters = {
    var name : String;
    var x : Int;
    var y : Int;
    var h : Int;
    var w : Int;
}

typedef TextParameters = {
    var name : String;
    var x : Int;
    var y : Int;
    var value : String;
}

class Settings{
    public static var WINDOW_HEIGHT = 768;
    public static var WINDOW_WIDTH = 1024;

    public static var FARM_FIELD_DIMENSIONS = [8,8,8,8,8,8,8,8];
    public static var INVENTORY_FIELD_DIMENSIONS = [4,2];
    public static var STORE_FIELD_DIMENSIONS = [1,3];
    public static var FARM_FIELD_SHIFT = [15,35];
    public static var INVENTORY_FIELD_SHIFT = [656,88];
    public static var STORE_FIELD_SHIFT = [656,388];
    public static var IDICATOR_SPRITE_NAME = "ready";

    public static var PRICE_COW = 140;
    public static var PRICE_CHICKEN = 40;
    public static var PRICE_WHEAT = 20;
    public static var PRICE_MILK = 30;
    public static var PRICE_EGG = 10;

    public static var DEPTH_CELL = 0;
    public static var DEPTH_TEXT = 0;
    public static var DEPTH_ITEM = 5;
    public static var DEPTH_PLACED_ITEM = 1;
    public static var DEPTH_I_SPRITE = 4;
    public static var DEPTH_I_BAR = 2;
    public static var DEPTH_I_BARLINE = 3;
    public static var DEPTH_I_TEXT = 3;

    public static var CURSOR_DEFAULT = 'default';
    public static var CURSOR_POINTER = 'pointer';

    public static var HEADER_PARAMS = { fontFamily: 'Arial', fontSize: 42, color: '#000000' };

    public var json_scene:Dynamic;
    public var scene:PlayScene;

    public var initImageArray = new Array<ImageParameters>();
    public var initTextArray = new Array<TextParameters>();
    public var folder:String;
    public var format:String;

    public function new(scene, sceneFilename:String){
        this.json_scene = haxe.Json.parse(haxe.Resource.getString(sceneFilename));
        this.scene = scene;
    }

    public function load(){
        trace("Scene load");
        this.folder = this.json_scene.imageFolder;
        this.format = this.json_scene.imageFormat;
        loadImages();
        loadTexts();
    }

    public function init(){
        trace("Scene init");
        initImages();
        initTexts();
        this.scene.input.setDefaultCursor(Settings.CURSOR_DEFAULT);
    }

    private function loadImages(){
        var images:Array<Dynamic> = this.json_scene.images;
        for (image in images) {
            this.scene.load.image(image.name, this.folder + image.name + this.format);
            initImageArray.push({"name": image.name, "x": image.x, "y": image.y, "h": image.height, "w": image.width});
        }
    }

    private function loadTexts(){
        var texts:Array<Dynamic> = this.json_scene.texts;
        for (text in texts) {
            initTextArray.push({"name": text.name,"x": text.x,"y": text.y,"value": text.value});
        }
    }

    private function initImages(){
        for (image in initImageArray) {
            this.scene.objectInit(image.name, image.x, image.y, image.h, image.w);
        }
    }
    private function initTexts(){
        for (text in initTextArray) {
            this.scene.objectInit(text.name, text.x, text.y, 0, 0, text.value);
        }
    }
}