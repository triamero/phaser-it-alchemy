import * as Phaser from "phaser";
import {Db} from "@it/shared";

export class BootScene extends Phaser.Scene {
    init() {
        let value = localStorage.getItem("openedIds");

        if (!value) {
            value = "[]";
        }

        let opened: number[] = JSON.parse(value);

        if (opened.length < 4) {
            opened = [1, 2, 3, 4];
        }

        this.cache.obj.add("openedIds", opened);

        localStorage.setItem("openedIds", JSON.stringify(opened));
    }

    preload() {
        this.load.json("db", "db.json");
        this.load.atlas("assets", "assets/textures.png", "assets/textures.json");
        this.load.image("anvil", "assets/anvil.png");
        this.load.image("ingr", "assets/ingr.png");
        this.load.image("ok", "assets/ok.png");
    }

    create() {

        const db: Db = this.cache.json.get("db");

        const openedIds: number[] = this.cache.obj.get("openedIds");
        this.cache.obj.add("opened", [openedIds.length, db.items.length]);
        this.cache.obj.add("points", 0);

        this.scene.start("game");
    }
}
