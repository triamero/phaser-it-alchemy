import * as Phaser from "phaser";
import {BootScene, DescriptionScene, GameScene, HudScene, InfoScene} from "./scenes";
import {IngredientPlugin} from "./game-objects";

class Main extends Phaser.Game {
    constructor() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.Center.CENTER_BOTH,
                min: {
                    width: 600,
                    height: 800
                },
            },
            width: 600,
            height: 800,
            plugins: {
                global: [
                    {
                        key: "IngredientPlugin",
                        plugin: IngredientPlugin,
                        start: true
                    }
                ]
            }
        };
        super(config);

        this.scene.add("boot", BootScene, false);
        this.scene.add("game", GameScene, false);
        this.scene.add("hud", HudScene, false);
        this.scene.add("description", DescriptionScene, false);
        this.scene.add("info", InfoScene, false);
        this.scene.start("boot");

    }
}

window.onload = () => {
    const GameApp: Phaser.Game = new Main();
};
