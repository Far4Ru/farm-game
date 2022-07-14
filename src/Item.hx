class Item extends GameElement{
    public var quantity:Int;
    public var type:String;
    public var price:Int;
    public function new(scene, spriteName, x, y, h, w, cellInfo){
        if(cellInfo.quantity != null){
            this.quantity = cellInfo.quantity;
        }
        if(cellInfo.type != null){
            this.type = cellInfo.type;
        }
        this.interactiveOption = 'drag';
        super(scene, spriteName, x, y, h, w, cellInfo);
    }
}