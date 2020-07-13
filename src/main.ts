import * as Phaser from "phaser";
import {BootScene, DescriptionScene, GameScene, HudScene, InfoScene} from "./scenes";

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
            render: {
                transparent: true
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
    (<any>window).game = new Main();
};
