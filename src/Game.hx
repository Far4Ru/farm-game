// Game Settings

class Game {
    public static var phaser:phaser.Game;

    static public function start_game() {
        var physics = {
            arcade: {
                gravity: { y: 0 },
                debug: false,
            }
        };
        Reflect.setField(physics, 'default', 'arcade');
        var config = untyped {
            parent: 'game_canvas',
            physics: physics,
            width: Settings.WINDOW_WIDTH,
            height: Settings.WINDOW_HEIGHT,
            backgroundColor: '#E8EFCD',
            type: untyped Phaser.CANVAS,
            scene: [PlayScene]
        };
        Game.phaser = new phaser.Game(config);
    }
}

