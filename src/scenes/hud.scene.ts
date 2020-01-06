import * as Phaser from "phaser";

export class HudScene extends Phaser.Scene {
    private _textColor: string = "#aff482";

    private _label1: Phaser.GameObjects.Text = null;
    private _label2: Phaser.GameObjects.Text = null;

    preload() {
        const backgroundColor = 0x0d084c;
        const foregroundColor = 0x1f1aad;

        const info = new Phaser.Geom.Rectangle(30, 30, 55, 55);

        this.add
            .graphics({lineStyle: {width: 2, color: foregroundColor}, fillStyle: {color: backgroundColor}})
            .fillRectShape(info)
            .strokeRectShape(info);

        const rect1 = this.add.rectangle(400, 30, 200, 30);
        const rect2 = this.add.rectangle(400, 59, 200, 30);

        this._label1 = this.add.text(0, 2, "[Очки:0]", {fontFamily: '"monospaced"', fontSize: "26px", color: this._textColor});
        this._label2 = this.add.text(0, 2, "[Открыто:0/0]", {fontFamily: '"monospaced"', fontSize: "26px", color: this._textColor});
        this.add.container(300, 30, [rect1, this._label1]);
        this.add.container(300, 59, [rect2, this._label2]);
    }


    update() {

        const points = this.cache.obj.get("points");
        const opened = this.cache.obj.get("opened");

        this._label1.setText(`[Очки: ${points}]`);
        this._label2.setText(`[Открыто: ${opened[0]}/${opened[1]}]`);
    }
}
