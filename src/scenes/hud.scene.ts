import * as Phaser from "phaser";
import {Constants} from "@it/shared";

export class HudScene extends Phaser.Scene {

    private _label1: Phaser.GameObjects.Text = null;
    private _label2: Phaser.GameObjects.Text = null;

    preload() {
        const rect1 = this.add.rectangle(100, 30, 200, 30);
        const rect2 = this.add.rectangle(100, 59, 200, 30);

        this._label1 = this.add.text(0, 2, "[Очки:0]", {
            fontFamily: "fixedsys",
            fontSize: "26px",
            color: Constants.TextColor
        });
        this._label2 = this.add.text(0, 2, "[Открыто:0/0]", {
            fontFamily: "fixedsys",
            fontSize: "26px",
            color: Constants.TextColor
        });
        this.add.container(30, 30, [rect1, this._label1]);
        this.add.container(30, 59, [rect2, this._label2]);
    }


    update() {

        const points = this.cache.obj.get("points");
        const opened = this.cache.obj.get("opened");

        this._label1.setText(`[Очки: ${points}]`);
        this._label2.setText(`[Открыто: ${opened[0]}/${opened[1]}]`);
    }
}
