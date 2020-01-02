import * as Phaser from "phaser";
import {Item} from "@it/shared";

export class DescriptionScene extends Phaser.Scene {

    private item: Item;
    private _handle: string;

    constructor(handle: string, parent: any) {
        super(handle);

        this._handle = handle;

        (<any>this).parent = parent;
    }

    init(item: Item) {
        this.item = item;
    }

    create() {

        const parent = (<any>this).parent;

        const backdrop = this.add.rectangle(parent.x, parent.y, 1200, 2200, 0x000000, 0.3);

        const container = this.add.container(300, 400);

        container.add(this.add.rectangle(0, 0, 340, 600, 0x123123, 1));

        container.add(this.add.image(0, -225, this.item.texture));

        const text = this.add.text(
            -120,
            -160,
            this.item.name,
            {
                align: "center",
                wordWrap: {width: 280, useAdvancedWrap: true}
            });

        container.add(text);

        container.add(this.add.text(
            -150,
            -140,
            this.item.description,
            {
                align: "center",
                wordWrap: {width: 300, useAdvancedWrap: true}
            }));

        const btn = this.add.rectangle(100, 100, 20, 20, 0x000000);
        btn.setInteractive();

        btn.on("pointerdown", this.onClose, this);

        container.add(btn);
    }

    onClose() {
        this.scene.stop(this._handle);
    }
}
