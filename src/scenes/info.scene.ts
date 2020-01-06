import * as Phaser from "phaser";
import {Constants} from "@it/shared";

export class InfoScene extends Phaser.Scene {

    protected create() {
        const map = this.make.tilemap({key: "game", height: +this.game.config.height, width: +this.game.config.width});

        const tileset = map.addTilesetImage("tilebag", "game-tilemap", 90, 90);

        map.createStaticLayer("background", tileset, 0, 0);

        const text = "Это старая добрая Алхимия, только про IT."
            + " Собирай из начальных элементов всё новые и новые сущности."
            + " Чем дальше элемент от первых четырёх, тем больше за него даётся очков.";

        this.add.text(30, 30, text, {
            fontFamily: "fixedsys",
            fontSize: "28px",
            color: Constants.TextColor,
            wordWrap: {width: 500, useAdvancedWrap: true}
        });

        this.add.sprite(300, 750, "ok")
            .setSize(40, 40)
            .setInteractive()
            .on("pointerup", () => {
                this.scene.start("game");
            });
    }
}
