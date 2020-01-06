import * as Phaser from "phaser";
import {Constants, Item} from "@it/shared";

export class DescriptionScene extends Phaser.Scene {

    private item: Item;
    private readonly _handle: string;

    constructor(handle: string, parent: any) {
        super(handle);

        this._handle = handle;

        (<any>this).parent = parent;
    }

    init(item: Item) {
        this.item = item;
    }

    create() {

        this.input.setTopOnly(true);

        const parent = (<any>this).parent;

        this.add
            .rectangle(parent.x, parent.y, 1200, 2200, 0x000000, 0.3)
            .setInteractive();

        const container = this.add.container(300, 400);

        container.add(this.add.rectangle(0, 0, 340, 600, 0x123123, 1));

        container.add((<any>this).add.ingredient(0, -225, this.item.texture, this.item.id));

        container.add(this.add.text(
            -150,
            -160,
            [this.item.name, "\t", `[${this.item.points} очк.]`],
            {
                fixedWidth: 300,
                fontSize: "28px",
                color: Constants.TitleColor,
                fontFamily: "fixedsys",
                align: "center",
                wordWrap: {width: 280, useAdvancedWrap: true}
            }));

        let descr = this.item.description;

        if (!(descr.endsWith(".") || descr.endsWith("?") || descr.endsWith("!"))) {
            descr += ".";
        }

        container.add(this.add.text(
            -150,
            -60,
            this.item.description,
            descr,
            {
                fixedWidth: 300,
                fontSize: "18px",
                color: Constants.TextColor,
                fontFamily: "fixedsys",
                align: "center",
                wordWrap: {width: 300, useAdvancedWrap: true}
            }));

        const btn = this.add.rectangle(0, 200, 40, 40, 0x000000);
        btn.setInteractive();

        btn.on("pointerup", this.onClose, this);

        container.add(btn);
    }

    onClose() {
        this.scene.stop(this._handle);
    }
}
