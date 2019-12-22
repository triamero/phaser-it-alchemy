import * as Phaser from "phaser";
import {BootScene, GameScene, HudScene} from "./scenes";

class Main extends Phaser.Game {
    constructor() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 600,
            height: 800
        };
        super(config);

        this.scene.add("boot", BootScene, false);
        this.scene.add("game", GameScene, false);
        this.scene.add("hud", HudScene, false);
        this.scene.start("boot");

    }
}

window.onload = () => {
    const GameApp: Phaser.Game = new Main();
};
