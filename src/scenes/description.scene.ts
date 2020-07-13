import * as Phaser from "phaser";
import {Constants, ElementModel} from "@it/shared";

export class DescriptionScene extends Phaser.Scene {

    private readonly _handle: string;

    private _element: ElementModel;

    constructor(handle: string, parent: any) {
        super(handle);

        this._handle = handle;

        (<any>this).parent = parent;
    }

    init(element: ElementModel) {
        this._element = element;
    }

    create() {

        this.input.setTopOnly(true);

        const parent = (<any>this).parent;

        this.add
            .rectangle(parent.x, parent.y, 1200, 2200, 0x000000, 0.3)
            .setInteractive();

        const container = this.add.container(300, 400);

        container.add(this.add.rectangle(0, 0, 340, 600, 0x123123, 1));

        container.add(this.add.sprite(0, -225, "controls", "anvil").setAlpha(0.85));
        container.add((<any>this).add.ingredient(0, -225, this._element.texture, this._element.id));


        container.add(this.add.text(
            -150,
            -160,
            [this._element.name, "\t", `[${this._element.points} очк.]`],
            {
                fixedWidth: 300,
                fontSize: "28px",
                color: Constants.TitleColor,
                fontFamily: "fixedsys",
                align: "center",
                wordWrap: {width: 280, useAdvancedWrap: true}
            }));

        let descr = this._element.description;

        if (!(descr.endsWith(".") || descr.endsWith("?") || descr.endsWith("!"))) {
            descr += ".";
        }

        container.add(this.add.text(
            -150,
            -60,
            descr,
            {
                fixedWidth: 300,
                fontSize: "18px",
                color: Constants.TextColor,
                fontFamily: "fixedsys",
                align: "center",
                wordWrap: {width: 300, useAdvancedWrap: true}
            }));

        const btn = this.add.sprite(0, 200,"controls","ok");
        btn.setInteractive();

        btn.on("pointerup", this.onClose, this);

        container.add(btn);
    }

    onClose() {
        this.scene.stop(this._handle);
    }
}
