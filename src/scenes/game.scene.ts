import * as Phaser from "phaser";
import {Blueprint, Db, Helper, Item} from "@it/shared";
import {IngredientGameObject, TweenIngredientGameObject} from "@it/game-objects";
import {DescriptionScene} from "@it/scenes/description.scene";

export class GameScene extends Phaser.Scene {

    private _counter: number = 0;

    private _opened: number[] = [];

    private _firstId: number;
    private _first: TweenIngredientGameObject;
    private _secondId: number;
    private _second: TweenIngredientGameObject;

    private _merge: boolean = false;
    private _clearStarted: boolean = false;

    private _db: Db = null;

    private _firstContainer: Phaser.GameObjects.Container = null;
    private _secondContainer: Phaser.GameObjects.Container = null;

    private _ingredients: IngredientGameObject[] = [];

    init() {
        this._db = this.cache.json.get("db");
    }

    preload() {
        const hud = this.scene.launch("hud");

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

        const firstRect = new Phaser.Geom.Rectangle(30, 130, 90, 90);
        const anvilRect = new Phaser.Geom.Rectangle(255, 130, 90, 90);
        const secondRect = new Phaser.Geom.Rectangle(480, 130, 90, 90);

        Helper.createRectangle(this, firstRect);
        Helper.createRectangle(this, anvilRect);
        Helper.createRectangle(this, secondRect);

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

        if (!this._merge && this._firstId && this._secondId) {

            const blueprint = this._getBlueprint();

            if (blueprint) {

                this._merge = true;

                //this._ingredients.forEach(x => x.input.enabled = false);

                this.tweens.add({
                    targets: [this._first, this._second],
                    x: 300,
                    y: 175,
                    ease: "Power2",
                    duration: 500,
                    onComplete: () => {
                        this._firstId = null;
                        this._first.destroy();
                        this._first = null;
                        this._secondId = null;
                        this._second.destroy();
                        this._second = null;

                        const result = this._db.items.find(x => x.id === blueprint.resultId);

                        (<any>this.add).tweenIngredient(300, 175, result.texture);

                        this._merge = false;


                        const handle = "description" + this._counter++;

                        var win = this.add.zone(0, 0, 600, 800);

                        const scene = new DescriptionScene(handle, win);

                        this.scene.add(handle, scene, true, result);
                    }
                });
            }
        }

        if (!this._clearStarted && this._firstId && this._secondId) {
            const blueprint = this._getBlueprint();

            if (!blueprint) {

                this._clearStarted = true;

                this.tweens.add({
                    targets: [this._second],
                    alpha: {from: 1, to: 0},
                    ease: "Linear",
                    duration: 500,
                    onComplete: () => {
                        this._secondId = null;
                        this._second.destroy();
                        this._second = null;

                        this._clearStarted = false;
                    }
                });
            }
        }
    }

    private onClickIngredient() {

        const scene = <any>this.scene;

        const me = <IngredientGameObject><any>this;

        const myClone = scene.add.tweenIngredient(me.x, me.y, me.texture);

        let x: number = null;
        let y: number = null;

        if (!scene._firstId) {
            x = 75;
            y = 175;
        } else if (!scene._secondId) {
            x = 525;
            y = 175;
        }

        const tween1 = scene.tweens.add({
            targets: [myClone],
            duration: 600,
            x: x,
            y: y,
            ease: "Power2",
            onComplete: (tween: Phaser.Tweens.Tween) => {
                console.log("tween completed");

                if (!scene._firstId) {
                    scene._firstId = me.id;
                    scene._first = myClone;
                } else if (!scene._secondId) {
                    scene._secondId = me.id;
                    scene._second = myClone;
                }

                myClone.setSize(me.height, me.width).setInteractive();
                myClone.on("pointerdown", () => {
                    scene._firstId = null;
                    scene._first = null;
                    scene._secondId = null;
                    scene._second = null;
                    myClone.destroy();
                });
            }
        });
    }

    private getNextPlace(index: number): number[] {

        const horizontalPosition = index % 6;
        const verticalPosition = Math.floor(index / 6);

        return [90 + 40 + horizontalPosition * (25 + 80), 290 + verticalPosition * 30]
    }

    private _getBlueprint(): Blueprint {

        const front = this._db.blueprints
            .find(x => x.firstId == this._firstId && x.secondId === this._secondId);

        if (front != null) {
            return front;
        }

        return this._db.blueprints
            .find(x => x.firstId == this._secondId && x.secondId === this._firstId);
    }
}
