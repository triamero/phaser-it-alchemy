import * as Phaser from "phaser";
import {Constants} from "@it/shared";

export class InfoScene extends Phaser.Scene {

    protected create() {

        const text = "Это старая добрая Алхимия, только про IT."
            + " Собирай из начальных элементов всё новые и новые сущности."
            + " Чем дальше элемент от первых четырёх, тем больше за него даётся очков.";

        this.add.text(30, 30, text, {
            fontFamily: "fixedsys",
            fontSize: "28px",
            color: Constants.TextColor,
            wordWrap: {width: 500, useAdvancedWrap: true}
        });

        this.add.sprite(300, 750, "controls", "ok")
            .setSize(40, 40)
            .setInteractive()
            .on("pointerup", () => {
                this.scene.start("game");
            });
    }
}
