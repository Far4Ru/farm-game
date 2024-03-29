// Generated by Haxe 4.1.4
(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var GameElement = function(scene,spriteName,x,y,h,w,cellInfo) {
	this.x = x;
	this.y = y;
	this.scene = scene;
	var cellX = cellInfo.x;
	var cellY = cellInfo.y;
	this.spriteInfo = cellInfo.name + " " + cellX + " " + cellY;
	if(spriteName != "") {
		this.sprite = this.scene.add.sprite(0,0,spriteName);
		this.sprite.setPosition(x + w / 2,y + h / 2);
		this.sprite.setDisplaySize(h,w);
		this.sprite.name = this.spriteInfo;
		this.sprite.setInteractive();
		if(this.interactiveOption == "drag") {
			this.scene.input.setDraggable(this.sprite);
			this.sprite.input.cursor = Settings.CURSOR_POINTER;
		} else if(this.interactiveOption == "drop") {
			this.sprite.input.dropZone = true;
			this.sprite.input.cursor = Settings.CURSOR_DEFAULT;
		}
	}
};
GameElement.__name__ = true;
var Cell = function(scene,spriteName,x,y,h,w,cellInfo) {
	this.interactiveOption = "drop";
	GameElement.call(this,scene,spriteName,x,y,h,w,cellInfo);
	this.sprite.setDepth(Settings.DEPTH_CELL);
};
Cell.__name__ = true;
Cell.__super__ = GameElement;
Cell.prototype = $extend(GameElement.prototype,{
});
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
};
var Field = function(scene,spriteName,h,w,fieldDimensions,fieldShift) {
	this.indicators = [];
	this.items = [];
	this.cells = [];
	this.scene = scene;
	this.spriteName = spriteName;
	this.fieldDimensions = fieldDimensions;
	this.fieldShift = fieldShift;
	this.cellHeight = h;
	this.cellWidth = w;
	this.makeField(h,w);
};
Field.__name__ = true;
Field.prototype = {
	makeField: function(h,w) {
		var _g = 0;
		var _g1 = this.fieldDimensions.length;
		while(_g < _g1) {
			var i = _g++;
			var cellRow = [];
			var itemRow = [];
			var indicatorRow = [];
			var _g2 = 0;
			var _g3 = this.fieldDimensions[i];
			while(_g2 < _g3) {
				var j = _g2++;
				var cellX = w + this.fieldShift[0] + ((w + 1) * j + 5 * j);
				var cellY = h + this.fieldShift[1] + ((h + 1) * i + 5 * i);
				var cellInfo = { "name" : this.fieldType, "x" : i, "y" : j};
				var cell = this.createCell(cellX,cellY,h,w,cellInfo);
				cellRow.push(cell);
				var item = this.createEmptyItem(cellX,cellY,h,w,cellInfo);
				itemRow.push(item);
				var indicator = this.initIndicator(cellX,cellY,h,w,cellInfo);
				indicatorRow.push(indicator);
			}
			this.cells.push(cellRow);
			this.items.push(itemRow);
			this.indicators.push(indicatorRow);
		}
	}
	,createCell: function(x,y,h,w,info) {
		return new Cell(this.scene,this.spriteName,x,y,h,w,info);
	}
	,createEmptyItem: function(x,y,h,w,info) {
		return new Item(this.scene,"",x,y,h,w,info);
	}
	,initIndicator: function(x,y,h,w,info) {
		return new ProccessIndicator(this.scene,Settings.IDICATOR_SPRITE_NAME,x,y,h,w,info);
	}
	,initItem: function(name,x,y,h,w,info) {
		if(info.name == "None") {
			info.name = this.fieldType;
			info.x = y;
			info.y = x;
		}
		var itemX = this.fieldShift[0] + this.cellWidth + (this.cellWidth + 1) * x + 5 * x + ((this.cellWidth - h) / 2 | 0);
		var itemY = this.fieldShift[1] + this.cellHeight + (this.cellHeight + 1) * y + 5 * y + ((this.cellHeight - w) / 2 | 0);
		this.items[y][x] = new Item(this.scene,name,itemX,itemY,w,h,info);
	}
	,cellAction: function(x,y,item) {
	}
	,placeBack: function(item) {
		item.sprite.x = item.sprite.originX;
		item.sprite.y = item.sprite.originY;
	}
};
var FarmField = function(scene,spriteName,h,w,fieldDimensions,fieldShift) {
	this.fieldType = "farm";
	Field.call(this,scene,spriteName,h,w,fieldDimensions,fieldShift);
};
FarmField.__name__ = true;
FarmField.__super__ = Field;
FarmField.prototype = $extend(Field.prototype,{
	cellAction: function(x,y,item) {
		var fieldItem = this.items[x][y];
		if(fieldItem.sprite == null) {
			switch(item.type) {
			case "animal":
				this.initItem(item.sprite.texture.key,y,x,60,60,{ "name" : this.fieldType, "x" : x, "y" : y, "type" : "animal", "quantity" : 1});
				switch(item.sprite.texture.key) {
				case "chicken":
					this.indicators[x][y].initAnimalTimer(10,30);
					break;
				case "cow":
					this.indicators[x][y].initAnimalTimer(20,20);
					break;
				}
				this.scene.input.setDraggable(this.items[x][y].sprite,false);
				this.placeBack(item);
				item.quantity--;
				if(item.quantity <= 0) {
					this.scene.input.setDraggable(item.sprite,false);
					item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
					item.sprite.setAlpha(0.3);
				}
				break;
			case "clear":
				this.placeBack(item);
				break;
			case "plant":
				this.initItem(item.sprite.texture.key,y,x,60,40,{ "name" : this.fieldType, "x" : x, "y" : y, "type" : "plant", "quantity" : 1});
				this.indicators[x][y].initPlantTimer(10);
				this.scene.input.setDraggable(this.items[x][y].sprite,false);
				this.items[x][y].sprite.input.cursor = Settings.CURSOR_DEFAULT;
				this.placeBack(item);
				item.quantity--;
				if(item.quantity <= 0) {
					this.scene.input.setDraggable(item.sprite,false);
					item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
					item.sprite.setAlpha(0.3);
				}
				break;
			case "product":
				this.placeBack(item);
				break;
			}
		} else {
			switch(item.type) {
			case "animal":
				this.placeBack(item);
				break;
			case "clear":
				this.items[x][y].sprite.setVisible(false);
				this.items[x][y].sprite = null;
				this.indicators[x][y].sprite.setVisible(false);
				this.indicators[x][y].hideBar();
				this.indicators[x][y].hideText();
				this.indicators[x][y].nullifyTimer();
				this.placeBack(item);
				break;
			case "plant":
				if((fieldItem.sprite.texture.key == "cow" || fieldItem.sprite.texture.key == "chicken") && item.sprite.texture.key == "wheat") {
					this.indicators[x][y].feedAnimal();
					this.placeBack(item);
					item.quantity--;
					if(item.quantity <= 0) {
						this.scene.input.setDraggable(item.sprite,false);
						item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
						item.sprite.setAlpha(0.3);
					}
				}
				this.placeBack(item);
				break;
			case "product":
				this.placeBack(item);
				break;
			}
		}
	}
});
var Game = function() { };
Game.__name__ = true;
Game.start_game = function() {
	var physics = { arcade : { gravity : { y : 0}, debug : false}};
	physics["default"] = "arcade";
	var config = { parent : "game_canvas", physics : physics, width : Settings.WINDOW_WIDTH, height : Settings.WINDOW_HEIGHT, backgroundColor : "#E8EFCD", type : Phaser.CANVAS, scene : [PlayScene]};
	Game.phaser = new Phaser.Game(config);
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.now = function() {
	return Date.now();
};
var Inventory = function(scene,spriteName,h,w,fieldDimensions,fieldShift) {
	this.fieldType = "inventory";
	Field.call(this,scene,spriteName,h,w,fieldDimensions,fieldShift);
};
Inventory.__name__ = true;
Inventory.__super__ = Field;
Inventory.prototype = $extend(Field.prototype,{
	cellAction: function(x,y,item) {
		var inventoryItem = this.items[x][y];
		if(inventoryItem.sprite.texture.key == item.sprite.texture.key) {
			inventoryItem.quantity++;
			this.indicators[x][y].updateText(inventoryItem.quantity + "");
			this.activateItemSprite(inventoryItem);
			this.placeBack(item);
		} else {
			this.placeBack(item);
		}
	}
	,addItem: function(name) {
		var itemArray = this.items;
		var _g = 0;
		var _g1 = itemArray.length;
		while(_g < _g1) {
			var i = _g++;
			var _g2 = 0;
			var _g3 = itemArray[i].length;
			while(_g2 < _g3) {
				var j = _g2++;
				if(itemArray[i][j].sprite.texture.key == name) {
					var item = itemArray[i][j];
					item.quantity++;
					this.indicators[i][j].updateText(item.quantity + "");
					this.activateItemSprite(item);
				}
			}
		}
	}
	,activateItemSprite: function(item) {
		item.sprite.input.cursor = Settings.CURSOR_POINTER;
		this.scene.input.setDraggable(item.sprite,true);
		item.sprite.setAlpha(1);
	}
});
var Item = function(scene,spriteName,x,y,h,w,cellInfo) {
	if(cellInfo.quantity != null) {
		this.quantity = cellInfo.quantity;
	}
	if(cellInfo.type != null) {
		this.type = cellInfo.type;
	}
	this.interactiveOption = "drag";
	GameElement.call(this,scene,spriteName,x,y,h,w,cellInfo);
};
Item.__name__ = true;
Item.__super__ = GameElement;
Item.prototype = $extend(GameElement.prototype,{
});
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	window.addEventListener("load",function() {
		Game.start_game();
	});
};
Math.__name__ = true;
var PlayScene = function(config) {
	this.timeValue = 0;
	Phaser.Scene.call(this,config);
};
PlayScene.__name__ = true;
PlayScene.placeBack = function(gameObject) {
	gameObject.x = gameObject.originX;
	gameObject.y = gameObject.originY;
};
PlayScene.__super__ = Phaser.Scene;
PlayScene.prototype = $extend(Phaser.Scene.prototype,{
	preload: function() {
		this.settings = new Settings(this,"scene1");
		this.settings.load();
	}
	,create: function() {
		var _gthis = this;
		this.settings.init();
		this.input.on("gameobjectdown",function(pointer,currentlyOver) {
			if(new EReg("farm.+","i").match(currentlyOver.name)) {
				var params = currentlyOver.name.split(" ");
				_gthis.harvestHandle(Std.parseInt(params[1]),Std.parseInt(params[2]));
			}
		});
		this.input.on("dragstart",function(pointer,sprite,dragX,dragY) {
			sprite.originX = sprite.x;
			sprite.originY = sprite.y;
			sprite.setDepth(Settings.DEPTH_ITEM);
		});
		this.input.on("drag",function(pointer,sprite,dragX,dragY) {
			sprite.x = dragX;
			sprite.y = dragY;
		});
		this.input.on("dragend",function(pointer,sprite,dropped) {
			sprite.setDepth(Settings.DEPTH_PLACED_ITEM);
			if(!dropped) {
				sprite.x = sprite.originX;
				sprite.y = sprite.originY;
			}
		});
		this.input.on("drop",function(pointer,gameObject,target) {
			gameObject.x = target.x;
			gameObject.y = target.y;
			_gthis.actionHandle(target,gameObject);
		});
		this.shop.update(this.player.cash);
	}
	,objectInit: function(name,x,y,h,w,v) {
		if(v == null) {
			v = "";
		}
		switch(name) {
		case "cell":
			this.inventory = new Inventory(this,name,h,w,Settings.INVENTORY_FIELD_DIMENSIONS,Settings.INVENTORY_FIELD_SHIFT);
			this.shop = new Shop(this,name,h,w,Settings.STORE_FIELD_DIMENSIONS,Settings.STORE_FIELD_SHIFT);
			break;
		case "chicken":
			this.inventory.initItem(name,x,y,h,w,{ "name" : "None", "x" : 0, "y" : 0, "type" : "animal", "quantity" : 4});
			this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity + "");
			this.shop.initItem(name,x,y + 1,h,w,{ "name" : "None", "x" : 0, "y" : 0});
			this.shop.indicators[y + 1][x].updateText("$" + Settings.PRICE_CHICKEN);
			var indicator = this.shop.indicators[y + 1][x];
			indicator.text.setPosition(indicator.text.x - 20,indicator.text.y);
			this.shop.items[y + 1][x].price = Settings.PRICE_CHICKEN;
			break;
		case "clear":
			this.inventory.initItem(name,x,y,h,w,{ "name" : "None", "x" : 0, "y" : 0, "type" : "clear", "quantity" : -1});
			this.inventory.indicators[y][x].updateText("∞");
			break;
		case "coin":
			this.coin = this.add.sprite(0,0,name);
			this.coin.setPosition(x + w / 2,y + h / 2);
			this.coin.setDisplaySize(h,w);
			this.player = new Player();
			this.textCoin = this.add.text(x + w + 10,y + 7,0,Settings.HEADER_PARAMS);
			this.coin.setDepth(Settings.DEPTH_TEXT);
			this.textCoin.setDepth(Settings.DEPTH_TEXT);
			break;
		case "cow":
			this.inventory.initItem(name,x,y,h,w,{ "name" : "None", "x" : 0, "y" : 0, "type" : "animal", "quantity" : 4});
			this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity + "");
			this.shop.initItem(name,x,y + 1,h,w,{ "name" : "None", "x" : 0, "y" : 0});
			this.shop.indicators[y + 1][x].updateText("$" + Settings.PRICE_COW);
			var indicator = this.shop.indicators[y + 1][x];
			indicator.text.setPosition(indicator.text.x - 20,indicator.text.y);
			this.shop.items[y + 1][x].price = Settings.PRICE_COW;
			break;
		case "egg":
			this.inventory.initItem(name,x,y,h,w,{ "name" : "None", "x" : 0, "y" : 0, "type" : "product", "quantity" : 4});
			this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity + "");
			this.inventory.items[y][x].price = Settings.PRICE_EGG;
			break;
		case "inventory":
			var inventoryText = this.add.text(x,y,v,Settings.HEADER_PARAMS);
			inventoryText.setDepth(Settings.DEPTH_TEXT);
			break;
		case "milk":
			this.inventory.initItem(name,x,y,h,w,{ "name" : "None", "x" : 0, "y" : 0, "type" : "product", "quantity" : 4});
			this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity + "");
			this.inventory.items[y][x].price = Settings.PRICE_MILK;
			break;
		case "shop":
			var shopText = this.add.text(x,y,v,Settings.HEADER_PARAMS);
			shopText.setDepth(Settings.DEPTH_TEXT);
			var coinImage = this.add.sprite(0,0,"coin");
			coinImage.setPosition(x + 32,y + 82);
			coinImage.setDisplaySize(60,40);
			coinImage.setAlpha(0.2);
			coinImage.setDepth(Settings.DEPTH_PLACED_ITEM);
			break;
		case "soil":
			this.farmField = new FarmField(this,name,h,w,Settings.FARM_FIELD_DIMENSIONS,Settings.FARM_FIELD_SHIFT);
			break;
		case "wheat":
			this.inventory.initItem(name,x,y,h,w,{ "name" : "None", "x" : 0, "y" : 0, "type" : "plant", "quantity" : 4});
			this.inventory.indicators[y][x].updateText(this.inventory.items[y][x].quantity + "");
			this.shop.initItem(name,x,y + 1,h,w,{ "name" : "None", "x" : 0, "y" : 0});
			this.shop.indicators[y + 1][x].updateText("$" + Settings.PRICE_WHEAT);
			var indicator = this.shop.indicators[y + 1][x];
			indicator.text.setPosition(indicator.text.x - 20,indicator.text.y);
			this.shop.items[y + 1][x].price = Settings.PRICE_WHEAT;
			break;
		}
	}
	,actionHandle: function(targetObject,gameObject) {
		var targetValues = targetObject.name.split(" ");
		var gameObjectValues = gameObject.name.split(" ");
		var targetX = Std.parseInt(targetValues[1]);
		var targetY = Std.parseInt(targetValues[2]);
		var objectX = Std.parseInt(gameObjectValues[1]);
		var objectY = Std.parseInt(gameObjectValues[2]);
		switch(gameObjectValues[0]) {
		case "inventory":
			switch(targetValues[0]) {
			case "farm":
				this.farmField.cellAction(targetX,targetY,this.inventory.items[objectX][objectY]);
				if(this.inventory.items[objectX][objectY].quantity == -1) {
					this.inventory.indicators[objectX][objectY].updateText("∞");
				} else {
					this.inventory.indicators[objectX][objectY].updateText(this.inventory.items[objectX][objectY].quantity + "");
				}
				break;
			case "inventory":
				if(objectX != targetX || objectY != targetY) {
					this.inventory.cellAction(targetX,targetY,this.inventory.items[objectX][objectY]);
					this.inventory.indicators[objectX][objectY].updateText(this.inventory.items[objectX][objectY].quantity + "");
				}
				break;
			case "shop":
				var inventoryItem = this.inventory.items[objectX][objectY];
				if(targetX == 0 && targetY == 0 && inventoryItem.type == "product") {
					this.player.cash += inventoryItem.quantity * inventoryItem.price;
					inventoryItem.quantity = 0;
					this.inventory.indicators[objectX][objectY].updateText(inventoryItem.quantity + "");
					PlayScene.placeBack(inventoryItem.sprite);
					this.input.setDraggable(inventoryItem.sprite,false);
					inventoryItem.sprite.input.cursor = Settings.CURSOR_DEFAULT;
					inventoryItem.sprite.setAlpha(0.3);
					this.textCoin.setText(this.player.cash);
					this.shop.update(this.player.cash);
				} else {
					PlayScene.placeBack(gameObject);
				}
				break;
			}
			break;
		case "shop":
			switch(targetValues[0]) {
			case "farm":
				PlayScene.placeBack(gameObject);
				break;
			case "inventory":
				var cash = this.player.cash;
				var price = this.shop.items[objectX][objectY].price;
				if(price <= cash) {
					this.inventory.cellAction(targetX,targetY,this.shop.items[objectX][objectY]);
					this.player.cash -= price;
					this.textCoin.setText(this.player.cash);
					this.shop.update(this.player.cash);
				}
				break;
			case "shop":
				PlayScene.placeBack(gameObject);
				break;
			}
			break;
		}
	}
	,harvestHandle: function(objectX,objectY) {
		if(this.farmField.items[objectX][objectY].sprite != null) {
			switch(this.farmField.items[objectX][objectY].sprite.texture.key) {
			case "chicken":
				this.inventory.addItem("egg");
				var indicator = this.farmField.indicators[objectX][objectY];
				indicator.hideSprite();
				indicator.growAnimalResume();
				break;
			case "cow":
				this.inventory.addItem("milk");
				var indicator = this.farmField.indicators[objectX][objectY];
				indicator.hideSprite();
				indicator.growAnimalResume();
				break;
			case "wheat":
				this.inventory.addItem("wheat");
				var indicator = this.farmField.indicators[objectX][objectY];
				indicator.hideSprite();
				indicator.growPlantResume();
				break;
			}
		}
		this.shop.update(this.player.cash);
	}
});
var Player = function() {
	this.cash = 0;
};
Player.__name__ = true;
var ProccessIndicator = function(scene,spriteName,x,y,h,w,cellInfo) {
	this.w = w;
	this.h = h;
	GameElement.call(this,scene,spriteName,x,y - (h / 2 | 0),h,w,cellInfo);
	this.sprite.setDepth(Settings.DEPTH_I_SPRITE);
	this.hideSprite();
	this.bar = this.scene.add.graphics();
	this.bar.setDefaultStyles({ lineStyle : { width : 4, color : 16777215, alpha : 1}});
	this.bar.lineBetween(x,y,x + w,y);
	this.barLine = this.scene.add.graphics();
	this.barLine.setDefaultStyles({ lineStyle : { width : 4, color : 5570815, alpha : 1}});
	this.bar.setDepth(Settings.DEPTH_I_BAR);
	this.barLine.setDepth(Settings.DEPTH_I_BARLINE);
	this.hideBar();
	this.text = this.scene.add.text(x + w - (w / 2 | 0),y + h - (h / 3 | 0),"",{ fontFamily : "Arial", fontSize : 24, color : "#ffffff"});
	this.text.setDepth(Settings.DEPTH_I_TEXT);
	this.hideText();
};
ProccessIndicator.__name__ = true;
ProccessIndicator.__super__ = GameElement;
ProccessIndicator.prototype = $extend(GameElement.prototype,{
	updateBarLine: function(percent) {
		this.barLine.clear();
		this.barLine.lineBetween(this.x,this.y + (this.h / 2 | 0),this.x + this.w * percent,this.y + (this.h / 2 | 0));
		this.showBar();
	}
	,updateText: function(value) {
		this.text.setText(value);
		this.showText();
	}
	,showSprite: function() {
		this.sprite.setVisible(true);
	}
	,showBar: function() {
		this.bar.setVisible(true);
		this.barLine.setVisible(true);
	}
	,showText: function() {
		this.text.setVisible(true);
	}
	,hideSprite: function() {
		this.sprite.setVisible(false);
	}
	,hideBar: function() {
		this.bar.setVisible(false);
		this.barLine.setVisible(false);
	}
	,hideText: function() {
		this.text.setVisible(false);
	}
	,initPlantTimer: function(growthTime) {
		this.growthTime = growthTime;
		this.timeLeft = growthTime;
		this.timer = this.scene.time.addEvent({ delay : 1000, callback : $bind(this,this.growPlant), callbackScope : this, loop : true});
	}
	,growPlant: function() {
		this.timeLeft--;
		this.updateText(this.timeLeft + "");
		this.updateBarLine((this.growthTime - this.timeLeft) / this.growthTime);
		if(this.timeLeft <= 0) {
			this.growPlantEnd();
		}
	}
	,growPlantEnd: function() {
		this.timer.paused = true;
		this.showSprite();
		this.hideBar();
		this.hideText();
	}
	,growPlantResume: function() {
		this.timeLeft = this.growthTime;
		this.timer.paused = false;
	}
	,initAnimalTimer: function(growthTime,satietyTime) {
		this.growthTime = growthTime;
		this.satietyTime = satietyTime;
		this.satietyTimeLast = 0;
		this.timeLeft = growthTime;
		this.timer = this.scene.time.addEvent({ delay : 1000, callback : $bind(this,this.growAnimal), callbackScope : this, loop : true});
	}
	,growAnimal: function() {
		if(this.satietyTimeLast > 0) {
			this.satietyTimeLast--;
			this.timeLeft--;
			this.updateText(this.timeLeft + "");
			this.updateBarLine((this.growthTime - this.timeLeft) / this.growthTime);
			if(this.timeLeft <= 0) {
				this.growAnimalEnd();
			}
		} else {
			this.timer.paused = true;
		}
	}
	,growAnimalEnd: function() {
		this.timer.paused = true;
		this.showSprite();
		this.hideBar();
		this.hideText();
	}
	,growAnimalResume: function() {
		if(this.satietyTimeLast > 0) {
			this.timeLeft = this.growthTime;
			this.timer.paused = false;
		}
	}
	,feedAnimal: function() {
		this.satietyTimeLast += this.satietyTime;
		if(this.timer.paused) {
			this.timeLeft = this.growthTime;
			this.timer.paused = false;
		}
	}
	,nullifyTimer: function() {
		this.timer.paused = true;
		this.timeLeft = 0;
		this.growthTime = 0;
		this.satietyTime = 0;
		this.satietyTimeLast = 0;
	}
});
var Settings = function(scene,sceneFilename) {
	this.initTextArray = [];
	this.initImageArray = [];
	this.json_scene = JSON.parse(haxe_Resource.getString(sceneFilename));
	this.scene = scene;
};
Settings.__name__ = true;
Settings.prototype = {
	load: function() {
		console.log("src/Settings.hx:62:","Scene load");
		this.folder = this.json_scene.imageFolder;
		this.format = this.json_scene.imageFormat;
		this.loadImages();
		this.loadTexts();
	}
	,init: function() {
		console.log("src/Settings.hx:70:","Scene init");
		this.initImages();
		this.initTexts();
		this.scene.input.setDefaultCursor(Settings.CURSOR_DEFAULT);
	}
	,loadImages: function() {
		var images = this.json_scene.images;
		var _g = 0;
		while(_g < images.length) {
			var image = images[_g];
			++_g;
			this.scene.load.image(image.name,this.folder + Std.string(image.name) + this.format);
			this.initImageArray.push({ "name" : image.name, "x" : image.x, "y" : image.y, "h" : image.height, "w" : image.width});
		}
	}
	,loadTexts: function() {
		var texts = this.json_scene.texts;
		var _g = 0;
		while(_g < texts.length) {
			var text = texts[_g];
			++_g;
			this.initTextArray.push({ "name" : text.name, "x" : text.x, "y" : text.y, "value" : text.value});
		}
	}
	,initImages: function() {
		var _g = 0;
		var _g1 = this.initImageArray;
		while(_g < _g1.length) {
			var image = _g1[_g];
			++_g;
			this.scene.objectInit(image.name,image.x,image.y,image.h,image.w);
		}
	}
	,initTexts: function() {
		var _g = 0;
		var _g1 = this.initTextArray;
		while(_g < _g1.length) {
			var text = _g1[_g];
			++_g;
			this.scene.objectInit(text.name,text.x,text.y,0,0,text.value);
		}
	}
};
var Shop = function(scene,spriteName,h,w,fieldDimensions,fieldShift) {
	this.fieldType = "shop";
	Field.call(this,scene,spriteName,h,w,fieldDimensions,fieldShift);
};
Shop.__name__ = true;
Shop.__super__ = Field;
Shop.prototype = $extend(Field.prototype,{
	update: function(playerCash) {
		var itemArray = this.items;
		var _g = 0;
		var _g1 = itemArray.length;
		while(_g < _g1) {
			var i = _g++;
			var _g2 = 0;
			var _g3 = itemArray[i].length;
			while(_g2 < _g3) {
				var j = _g2++;
				if(itemArray[i][j].sprite != null) {
					if(itemArray[i][j].price > playerCash) {
						this.disableItem(itemArray[i][j]);
					} else {
						this.enableItem(itemArray[i][j]);
					}
				}
			}
		}
	}
	,disableItem: function(item) {
		this.scene.input.setDraggable(item.sprite,false);
		item.sprite.input.cursor = Settings.CURSOR_POINTER;
		item.sprite.setAlpha(0.3);
	}
	,enableItem: function(item) {
		this.scene.input.setDraggable(item.sprite,true);
		item.sprite.input.cursor = Settings.CURSOR_DEFAULT;
		item.sprite.setAlpha(1);
	}
});
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	get_native: function() {
		return this.__nativeException;
	}
});
var haxe_Resource = function() { };
haxe_Resource.__name__ = true;
haxe_Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe_Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) {
				return x.str;
			}
			var b = haxe_crypto_Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
});
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.ofString = function(s,encoding) {
	if(encoding == haxe_io_Encoding.RawNative) {
		var buf = new Uint8Array(s.length << 1);
		var _g = 0;
		var _g1 = s.length;
		while(_g < _g1) {
			var i = _g++;
			var c = s.charCodeAt(i);
			buf[i << 1] = c & 255;
			buf[i << 1 | 1] = c >> 8;
		}
		return new haxe_io_Bytes(buf.buffer);
	}
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.prototype = {
	getString: function(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		var s = "";
		var b = this.b;
		var i = pos;
		var max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			var debug = pos > 0;
			while(i < max) {
				var c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					var code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					var c2 = b[i++];
					var code1 = (c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code1);
				} else {
					var c21 = b[i++];
					var c3 = b[i++];
					var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				var c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__ : true, __constructs__ : ["UTF8","RawNative"]
	,UTF8: {_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
var haxe_crypto_Base64 = function() { };
haxe_crypto_Base64.__name__ = true;
haxe_crypto_Base64.decode = function(str,complement) {
	if(complement == null) {
		complement = true;
	}
	if(complement) {
		while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	}
	return new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).decodeBytes(haxe_io_Bytes.ofString(str));
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) ++nbits;
	if(nbits > 8 || len != 1 << nbits) {
		throw haxe_Exception.thrown("BaseCode : base length must be a power of two.");
	}
	this.base = base;
	this.nbits = nbits;
};
haxe_crypto_BaseCode.__name__ = true;
haxe_crypto_BaseCode.prototype = {
	initTable: function() {
		var tbl = [];
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g = 0;
		var _g1 = this.base.length;
		while(_g < _g1) {
			var i = _g++;
			tbl[this.base.b[i]] = i;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) {
			this.initTable();
		}
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = new haxe_io_Bytes(new ArrayBuffer(size));
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.b[pin++]];
				if(i == -1) {
					throw haxe_Exception.thrown("BaseCode : invalid encoded char");
				}
				buf |= i;
			}
			curbits -= 8;
			out.b[pout++] = buf >> curbits & 255;
		}
		return out;
	}
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"]
	,Blocked: {_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_.__params__ = ["e"],$_)
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var n = e.__constructs__[o._hx_index];
			var con = e[n];
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.__name__ = true;
Array.__name__ = true;
haxe_Resource.content = [{ name : "scene1", data : "ewogICJpbWFnZUZvbGRlciI6ICJhc3NldHMvIiwKICAiaW1hZ2VGb3JtYXQiOiAiLnBuZyIsCiAgImltYWdlcyI6IFsKICAgIHsKICAgICAgIm5hbWUiOiAiY29pbiIsCiAgICAgICJ3aWR0aCI6IDQwLAogICAgICAiaGVpZ2h0IjogNjAsCiAgICAgICJ4IjogNTAsCiAgICAgICJ5IjogMjAKICAgIH0sCiAgICB7CiAgICAgICJuYW1lIjogInJlYWR5IiwKICAgICAgIndpZHRoIjogNjAsCiAgICAgICJoZWlnaHQiOiA2MCwKICAgICAgIngiOiAwLAogICAgICAieSI6IDAKICAgIH0sCiAgICB7CiAgICAgICJuYW1lIjogInNvaWwiLAogICAgICAid2lkdGgiOiA2NCwKICAgICAgImhlaWdodCI6IDY0LAogICAgICAieCI6IDAsCiAgICAgICJ5IjogMAogICAgfSwKICAgIHsKICAgICAgIm5hbWUiOiAiY2VsbCIsCiAgICAgICJ3aWR0aCI6IDY0LAogICAgICAiaGVpZ2h0IjogNjQsCiAgICAgICJ4IjogMCwKICAgICAgInkiOiAwCiAgICB9LAogICAgewogICAgICAibmFtZSI6ICJjaGlja2VuIiwKICAgICAgIndpZHRoIjogNjAsCiAgICAgICJoZWlnaHQiOiA2MCwKICAgICAgIngiOiAxLAogICAgICAieSI6IDAKICAgIH0sCiAgICB7CiAgICAgICJuYW1lIjogIndoZWF0IiwKICAgICAgIndpZHRoIjogNDAsCiAgICAgICJoZWlnaHQiOiA2MCwKICAgICAgIngiOiAwLAogICAgICAieSI6IDAKICAgIH0sCiAgICB7CiAgICAgICJuYW1lIjogImNvdyIsCiAgICAgICJ3aWR0aCI6IDYwLAogICAgICAiaGVpZ2h0IjogNjAsCiAgICAgICJ4IjogMiwKICAgICAgInkiOiAwCiAgICB9LAogICAgewogICAgICAibmFtZSI6ICJjbGVhciIsCiAgICAgICJ3aWR0aCI6IDYwLAogICAgICAiaGVpZ2h0IjogNjAsCiAgICAgICJ4IjogMywKICAgICAgInkiOiAwCiAgICB9LAogICAgewogICAgICAibmFtZSI6ICJlZ2ciLAogICAgICAid2lkdGgiOiA2MCwKICAgICAgImhlaWdodCI6IDYwLAogICAgICAieCI6IDAsCiAgICAgICJ5IjogMQogICAgfSwKICAgIHsKICAgICAgIm5hbWUiOiAibWlsayIsCiAgICAgICJ3aWR0aCI6IDYwLAogICAgICAiaGVpZ2h0IjogNjAsCiAgICAgICJ4IjogMSwKICAgICAgInkiOiAxCiAgICB9CiAgXSwKICAidGV4dHMiOiBbCiAgICB7CiAgICAgICJuYW1lIjogImludmVudG9yeSIsCiAgICAgICJ2YWx1ZSI6ICLQmNC90LLQtdC90YLQsNGA0YwiLAogICAgICAieCI6IDcyMCwKICAgICAgInkiOiAxMDAKICAgIH0sCiAgICB7CiAgICAgICJuYW1lIjogInNob3AiLAogICAgICAidmFsdWUiOiAi0JzQsNCz0LDQt9C40L0iLAogICAgICAieCI6IDcyMCwKICAgICAgInkiOiA0MDAKICAgIH0KICBdCn0"}];
js_Boot.__toStr = ({ }).toString;
Settings.WINDOW_HEIGHT = 768;
Settings.WINDOW_WIDTH = 1024;
Settings.FARM_FIELD_DIMENSIONS = [8,8,8,8,8,8,8,8];
Settings.INVENTORY_FIELD_DIMENSIONS = [4,2];
Settings.STORE_FIELD_DIMENSIONS = [1,3];
Settings.FARM_FIELD_SHIFT = [15,35];
Settings.INVENTORY_FIELD_SHIFT = [656,88];
Settings.STORE_FIELD_SHIFT = [656,388];
Settings.IDICATOR_SPRITE_NAME = "ready";
Settings.PRICE_COW = 140;
Settings.PRICE_CHICKEN = 40;
Settings.PRICE_WHEAT = 20;
Settings.PRICE_MILK = 30;
Settings.PRICE_EGG = 10;
Settings.DEPTH_CELL = 0;
Settings.DEPTH_TEXT = 0;
Settings.DEPTH_ITEM = 5;
Settings.DEPTH_PLACED_ITEM = 1;
Settings.DEPTH_I_SPRITE = 4;
Settings.DEPTH_I_BAR = 2;
Settings.DEPTH_I_BARLINE = 3;
Settings.DEPTH_I_TEXT = 3;
Settings.CURSOR_DEFAULT = "default";
Settings.CURSOR_POINTER = "pointer";
Settings.HEADER_PARAMS = { fontFamily : "Arial", fontSize : 42, color : "#000000"};
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
