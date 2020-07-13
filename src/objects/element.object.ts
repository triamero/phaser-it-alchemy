import {Constants} from "@it/shared";

export class ElementObject extends Phaser.GameObjects.Container {

    public readonly id: number;

    public readonly texture: string;

    public readonly name: string;


    private readonly _icon: Phaser.GameObjects.Sprite;
    private readonly _text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, id: number, name: string, assets: string, frame: string) {
        super(scene, x, y);

        this.id = id;
        this.name = name;

        const style = {
            fontFamily: "fixedsys",
            fontSize: "20px",
            color: Constants.TextColor,
            align: "center",
            wordWrap: {width: 90, useAdvancedWrap: true}
        };


        if (id > 0) {
            this._icon = scene.add.sprite(0, 0, assets, frame).setAlpha(0.85);
            this._text = scene.add.text(0, 0, name, style);
        } else {
            this._icon = scene.add.sprite(0, 0, assets, frame).setAlpha(0.85);
            this._text = scene.add.text(0, 0, name, style);
        }

        this.add([this._icon, this._text]);
    }
}
