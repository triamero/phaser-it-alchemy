import * as Phaser from "phaser";
import {Db} from "@it/shared";

export class BootScene extends Phaser.Scene {
    init() {
        console.log("Booting...");

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

        console.log("Booting completed");
    }

    preload() {
        this.load.json("db", "db.json");
        this.load.atlas("assets", "assets/textures.png", "assets/textures.json")
    }

    create() {

        const db: Db = this.cache.json.get("db");

        const openedIds: number[] = this.cache.obj.get("openedIds");
        this.cache.obj.add("opened", [openedIds.length, db.items.length]);
        this.cache.obj.add("points", db);

        this.scene.start("game");
    }
}
