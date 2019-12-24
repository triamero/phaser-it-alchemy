import * as Phaser from "phaser";
import {Db, Item} from "@it/shared";
import {IngredientGameObject} from "@it/game-objects";
import {AnvilScene} from "./anvil.scene";

export class GameScene extends Phaser.Scene {

    private _anvilScene: AnvilScene = null;

    private _opened: number[] = [];

    private _firstId: number = 0;
    private _secondId: number = 0;

    private _db: Db = null;

    private _firstContainer: Phaser.GameObjects.Container = null;
    private _secondContainer: Phaser.GameObjects.Container = null;

    private _ingredients: IngredientGameObject[] = [];

    init() {
        this._db = this.cache.json.get("db");
    }

    preload() {
        const hud = this.scene.launch("hud");
        this._anvilScene = <AnvilScene>this.scene.launch("anvil").scene;

        this._opened = this.cache.obj.get("opened");

        this.load.tilemapTiledJSON("game", "assets/alchemy.json");
        this.load.image("game-tilemap", "assets/tilebag.png");
    }

    protected create() {

        const me: any = this;

        const map = this.make.tilemap({key: "game", height: +this.game.config.height, width: +this.game.config.width});

        const tileset = map.addTilesetImage("tilebag", "game-tilemap", 90, 90);

        const background = map.createStaticLayer("background", tileset, 0, 0);
        const foreground = map.createStaticLayer("foreground", tileset, 0, 0);

        const rect1 = this.add.rectangle(0, 0, 100, 100, 0x0d084c);

        const rect2 = this.add.rectangle(0, 0, 100, 100, 0x0d084c);

        this._firstContainer = this.add.container(500, 500, [rect1]);
        this._secondContainer = this.add.container(500, 500, [rect2]);

        const opened: number[] = this.cache.obj.get("openedIds");

        this._ingredients = opened
            .map(x => this._db.items.find(i => i.id === x))
            .map((x: Item, index: number) => {
                const place = this.getNextPlace(index);

                const ingredient: IngredientGameObject = me.add.ingredient(place[0], place[1], x.texture, x.name, x.id);
                ingredient.setSize(90, 90);
                ingredient.setInteractive();

                ingredient.on("pointerup", this.onClickIngredient);

                return ingredient;
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

    private onClickIngredient() {

        const scene = <any>this.scene;

        const me = <IngredientGameObject><any>this;

        const myClone = scene.add.tweenIngredient(me.x, me.y, me.texture);
        myClone.bringToTop();

        let anvil: number[] = scene.cache.obj.get("anvil");

        if (!anvil) {
            anvil = [];
        }

        let x = 75;
        let y = 175;

        if (anvil.length > 0) {
            x = 525;
            y = 175;
        }

        const tween = scene.tweens.add({
            targets: [myClone],
            duration: 600,
            x: x,
            y: y,
            ease: "Power2",
            onComplete: (tween: Phaser.Tweens.Tween) => {
                console.log("tween completed");

                //debugger;

                let anvil: number[] = scene.cache.obj.get("anvil");

                if (!anvil) {
                    anvil = [];
                }

                anvil.push(me.id);

                scene.cache.obj.add("anvil", anvil);
            }
        });
        console.log(scene.getNextPlace(1));
    }

    private getNextPlace(index: number): number[] {

        const horizontalPosition = index % 6;
        const verticalPosition = Math.floor(index / 6);

        return [90 + 40 + horizontalPosition * (25 + 80), 290 + verticalPosition * 30]

    }
}
