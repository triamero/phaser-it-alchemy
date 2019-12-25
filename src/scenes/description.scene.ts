import * as Phaser from "phaser";
import {Item} from "@it/shared";

export class DescriptionScene extends Phaser.Scene {

    private item: Item;

    constructor(handle: string) {
        super(handle);
    }

    init(item: Item) {
        this.item = item;
    }

    create() {
        const backdrop = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 0.3);
    }
}
