typedef CellInfo = {
    var name : String;
    var x : Int;
    var y : Int;
    var ?quantity : Int;
    var ?type : String;
}

class Field {
    public var scene:PlayScene;
    public var cells = new Array<Array<Cell>>();
    public var items = new Array<Array<Item>>();
    public var indicators = new Array<Array<ProccessIndicator>>();
    public var spriteName : String;
    public var fieldDimensions : Array<Int>;
    public var fieldShift : Array<Int>;
    public var cellHeight : Int;
    public var cellWidth : Int;
    public var fieldType : String;
    public function new(scene, spriteName, h:Int, w:Int, fieldDimensions, fieldShift){
        this.scene = scene;
        this.spriteName = spriteName;
        this.fieldDimensions = fieldDimensions;
        this.fieldShift = fieldShift;
        this.cellHeight = h;
        this.cellWidth = w;
        makeField(h, w);
    }
    private function makeField(h:Int, w:Int){
        for (i in 0...this.fieldDimensions.length) {
            var cellRow = new Array<Cell>();
            var itemRow = new Array<Item>();
            var indicatorRow = new Array<ProccessIndicator>();
            for (j in 0...this.fieldDimensions[i]){
                var cellX = (w + this.fieldShift[0]) + ((w + 1) * j + 5 * j);
                var cellY = (h + this.fieldShift[1]) + ((h + 1) * i + 5 * i);
                var cellInfo =  {"name":this.fieldType, "x": i, "y": j};
                var cell = createCell(cellX, cellY, h, w, cellInfo);
                cellRow.push(cell);
                var item = createEmptyItem(cellX, cellY, h, w, cellInfo);
                itemRow.push(item);
                var indicator = initIndicator(cellX, cellY, h, w, cellInfo);
                indicatorRow.push(indicator);
            }
            this.cells.push(cellRow);
            this.items.push(itemRow);
            this.indicators.push(indicatorRow);
        }
    }
    private function createCell(x, y, h, w, info : CellInfo){
        return new Cell(this.scene, this.spriteName, x, y, h, w, info);
    }
    private function createEmptyItem(x, y, h, w, info : CellInfo){
        return new Item(this.scene, '', x, y, h, w, info);
    }
    public function initIndicator(x, y, h, w, info : CellInfo){
        return new ProccessIndicator(this.scene, Settings.IDICATOR_SPRITE_NAME, x, y, h, w, info);
    }
    public function initItem(name, x, y, h, w, info : CellInfo){
        if(info.name == 'None'){
            info.name = this.fieldType;
            info.x = y;
            info.y = x;
        }
        var itemX = this.fieldShift[0] + this.cellWidth + (this.cellWidth+1) * x + 5 * x + Std.int((this.cellWidth - h) / 2);
        var itemY = this.fieldShift[1] + this.cellHeight + (this.cellHeight+1) * y + 5 * y + Std.int((this.cellHeight - w) / 2);
        this.items[y][x] = new Item(this.scene, name, itemX, itemY, w, h, info);
    }
    public function cellAction(x, y, item){
    }
    public function placeBack(item){
        item.sprite.x = item.sprite.originX;
        item.sprite.y = item.sprite.originY;
    }
}