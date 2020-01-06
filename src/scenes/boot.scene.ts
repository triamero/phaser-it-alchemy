import * as Phaser from "phaser";
import {Db} from "@it/shared";

export class BootScene extends Phaser.Scene {

    private _showInfo: boolean = false;

    init() {
        let value = localStorage.getItem("openedIds");

        if (!value) {
            value = "[]";
        }

        let opened: number[] = JSON.parse(value);

        if (opened.length < 4) {
            opened = [1, 2, 3, 4];
            this._showInfo = true;
        }

        this.cache.obj.add("openedIds", opened);

        localStorage.setItem("openedIds", JSON.stringify(opened));
    }

    preload() {
        this.load.json("db", "db.json");
        this.load.atlas("assets", "dist/textures.png", "dist/textures.json");
        this.load.image("anvil", "dist/anvil.png");
        this.load.image("ingr", "dist/ingr.png");
        this.load.image("ok", "dist/ok.png");
        this.load.image("info", "dist/info.png");

        this.load.tilemapTiledJSON("game", "assets/alchemy.json");
        this.load.image("game-tilemap", "assets/tilebag.png");
    }

    create() {

        const db: Db = this.cache.json.get("db");

        const openedIds: number[] = this.cache.obj.get("openedIds");
        this.cache.obj.add("opened", [openedIds.length, db.items.length]);
        this.cache.obj.add("points", 0);

        if (this._showInfo) {
            this.scene.start("info");
        } else {
            this.scene.start("game");
        }
    }
}
