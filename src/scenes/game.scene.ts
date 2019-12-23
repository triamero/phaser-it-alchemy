import * as Phaser from "phaser";
import {Db} from "@it/shared";
import {IngredientGameObject} from "@it/game-objects";

export class GameScene extends Phaser.Scene {

    private _opened: number[] = [];

    private _firstId: number = 0;
    private _secondId: number = 0;

    private _db: Db = null;

    private _firstContainer: Phaser.GameObjects.Container = null;
    private _secondContainer: Phaser.GameObjects.Container = null;

    init() {
        this._db = this.cache.json.get("db");
    }

    preload() {
        this.scene.launch("hud");

        this._opened = this.cache.obj.get("opened");


        this.load.tilemapTiledJSON("game", "assets/alchemy.json");
        this.load.image("game-tilemap", "assets/tilebag.png");
    }

    create() {
        const map = this.make.tilemap({key: "game", height: 800, width: 600});

        const tileset = map.addTilesetImage("tilebag", "game-tilemap", 90, 90);

        const background = map.createStaticLayer("background", tileset, 0, 0);
        const foreground = map.createStaticLayer("foreground", tileset, 0, 0);

        const rect1 = this.add.rectangle(0, 0, 100, 100, 0x0d084c);

        const rect2 = this.add.rectangle(0, 0, 100, 100, 0x0d084c);

        this._firstContainer = this.add.container(60, 200, [rect1]);
        this._secondContainer = this.add.container(500, 200, [rect2]);

        const opened: number[] = this.cache.obj.get("openedIds");

        opened.forEach((x: number, index: number) => {
            const item = this._db.items.find(i => i.id === x);

            const place = this.getNextPlace(index);

            const ingredient: IngredientGameObject = (<any>this.add).ingredient(place[0], place[1], item.name, item.name);

            ingredient.setSize(25, 25);
            ingredient.setInteractive();

            ingredient.on("pointerup", () => {
                console.log("clicked");

                if (this._firstId === 0) {

                    this._firstId = item.id;
                } else {
                    this._secondId = item.id;
                }
            });
        });
    }


    update() {

        let db: Db = this.cache.json.get("db");

        if (this._firstId > 0) {
            const first = db.items.find(x => x.id == this._firstId);
            this._firstContainer.add(this.add.image(0, 0, first.name));
        } else {
            //this._firstContainer.removeAll(true);
        }


        if (this._secondId > 0) {
            this._secondContainer.add(this.add.image(0, 0, ""));
        } else {
            //this._secondContainer.removeAll(true);
        }
    }

    private getNextPlace(index: number): number[] {

        const horizontalPosition = index % 6;
        const verticalPosition = Math.floor(index / 6);

        return [90 + 40 + horizontalPosition * (25 + 80), 290 + verticalPosition * 30]

    }
}

