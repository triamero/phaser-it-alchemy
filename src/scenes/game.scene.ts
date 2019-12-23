import * as Phaser from "phaser";
import {Db} from "@it/shared";

export class GameScene extends Phaser.Scene {

    private _opened: number[] = [];

    private _firstId: number = 0;
    private _secondId: number = 0;

    // @ts-ignore
    private _firstContainer: Phaser.GameObjects.Container = null;
    // @ts-ignore
    private _secondContainer: Phaser.GameObjects.Container = null;

    preload() {
        this.scene.launch("hud");

        this._opened = this.cache.obj.get("opened");

        const rect1 = this.add.rectangle(0, 0, 100, 100, 0x0d084c);

        const rect2 = this.add.rectangle(0, 0, 100, 100, 0x0d084c);

        this._firstContainer = this.add.container(60, 200, [rect1]);
        this._secondContainer = this.add.container(500, 200, [rect2]);

        this.load.tilemapTiledJSON("game", "assets/alchemy.json");
        this.load.image("game-tilemap", "assets/tilebag.png");
    }

    create() {
        const map = this.make.tilemap({key: "game", height: 800, width: 600});

        const tileset = map.addTilesetImage("tilebag", "game-tilemap", 90, 90);

        const background = map.createStaticLayer("background", tileset, 0, 0);
    }


    update() {

        let db: Db = this.cache.json.get("db");

        if (this._firstId > 0) {
            const first = db.items.find(x => x.id == this._firstId);
            this._firstContainer.add(this.add.image(0, 0, ""));
        } else {
            //this._firstContainer.removeAll(true);
        }


        if (this._secondId > 0) {
            this._secondContainer.add(this.add.image(0, 0, ""));
        } else {
            //this._secondContainer.removeAll(true);
        }
    }
}

