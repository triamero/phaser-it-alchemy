import * as Phaser from "phaser";
import {Blueprint, Db, Helper, Item} from "@it/shared";
import {IngredientGameObject, TweenIngredientGameObject} from "@it/game-objects";
import {DescriptionScene} from "@it/scenes/description.scene";

export class GameScene extends Phaser.Scene {

    private _scroll: any;

    private _moving: boolean = false;

    private _counter: number = 0;

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

    protected init() {
        this._db = this.cache.json.get("db");
    }

    protected preload() {

        const hud = this.scene.launch("hud");

        this.load.tilemapTiledJSON("game", "assets/alchemy.json");
        this.load.image("game-tilemap", "assets/tilebag.png");

        this.load.scenePlugin({
            key: "rexuiplugin",
            url: "src/scripts/rexuiplugin.min.js",
            sceneKey: 'rexUI'
        });
    }

    protected create() {

        const me: any = this;

        const map = this.make.tilemap({key: "game", height: +this.game.config.height, width: +this.game.config.width});

        const tileset = map.addTilesetImage("tilebag", "game-tilemap", 90, 90);

        map.createStaticLayer("background", tileset, 0, 0);
        map.createStaticLayer("foreground", tileset, 0, 0);

        const firstRect = new Phaser.Geom.Rectangle(30, 130, 90, 90);
        const anvilRect = new Phaser.Geom.Rectangle(255, 130, 90, 90);
        const secondRect = new Phaser.Geom.Rectangle(480, 130, 90, 90);

        Helper.createRectangle(this, firstRect);
        Helper.createRectangle(this, anvilRect);
        Helper.createRectangle(this, secondRect);

        this._recalculatePoints();

        this._scroll = me.rexUI.add
            .scrollablePanel({
                x: 300,
                y: 500,
                width: 600,
                height: 450,
                scrollMode: 0,
                background: me.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x4e342e),

                panel: {
                    child: me.rexUI.add
                        .sizer({
                            orientation: 'x',
                        })
                        .add(this.createTable(me), 0, 'top', {right: 8,}, true),
                },

                scroller: {
                    threshold: 10,
                    slidingDeceleration: 5000,
                    backDeceleration: 2000,
                },

                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,

                    panel: 10,
                }
            })
            .layout();

        this.input.on("wheel", this.onMouseWheel, this);
    }


    update() {

        if (!this._merge && this._firstId && this._secondId) {

            const blueprint = this._getBlueprint();

            if (blueprint) {

                this._merge = true;

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

                        const tw = (<any>this.add).tweenIngredient(300, 175, result.texture);

                        this.tweens.add({
                            targets: [tw],
                            alpha: {from: 1, to: 0},
                            ease: "linear",
                            duration: 500,
                            onComplete: () => {
                                tw.destroy();
                            }
                        });

                        this._merge = false;

                        const opnd: number[] = this.cache.obj.get("openedIds");

                        if (!opnd.some(x => x === result.id)) {

                            const handle = "description" + this._counter++;

                            const win = this.add.zone(0, 0, 600, 800);

                            const scene = new DescriptionScene(handle, win);

                            this.scene.add(handle, scene, true, result);
                            opnd.push(result.id);

                            const s = JSON.stringify(opnd);

                            localStorage.setItem("openedIds", s);

                            this.addIngredient(result);

                            this._recalculatePoints();
                        }
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
        // debugger;

        const scene = <any>this.scene;

        if (scene._moving) {
            return;
        }

        scene._moving = true;

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

        scene.tweens.add({
            targets: [myClone],
            duration: 600,
            x: x,
            y: y,
            ease: "Power2",
            onComplete: (tween: Phaser.Tweens.Tween) => {

                scene._moving = false;

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

    private _getBlueprint(): Blueprint {

        const front = this._db.blueprints
            .find(x => x.firstId == this._firstId && x.secondId === this._secondId);

        if (front != null) {
            return front;
        }

        return this._db.blueprints
            .find(x => x.firstId == this._secondId && x.secondId === this._firstId);
    }

    private _recalculatePoints() {
        const openedIds: number[] = this.cache.obj.get("openedIds");

        const points = openedIds
            .map(x => this._db.items.find(z => z.id === x))
            .map(x => x.points)
            .reduce((prev, curr) => prev + curr);

        this.cache.obj.add("points", points);
    }

    createTable(scene: any) {

        const opened: number[] = this.cache.obj.get("openedIds");

        const table = scene.rexUI.add.gridSizer({
            column: 4,
            row: Math.floor(opened.length / 4) + 1,
        });

        const items = opened.map(x => this._db.items.find(i => i.id === x));

        for (let i = 0, cnt = items.length; i < cnt; i++) {

            const item = items[i];

            const icon = this.createIcon(scene, item);

            const column = i % 4;
            const row = Math.floor(i / 4);

            table.add(icon, column, row, "top", 2, true);
        }

        return scene.rexUI.add
            .sizer({orientation: "y",})
            .addBackground(
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, 0x7b5e57, 1)
            )
            .add(table, 1, "center", 5, true);
    }

    createIcon(scene: any, item: any) {

        const label = scene.rexUI.add.label({
            orientation: "y",
            icon: scene.add.tweenIngredient(0, 0, item.texture, item.name, item.id),
            text: scene.add.text(0, 0, item.name)
        });

        label
            .getElement("icon")
            .setSize(80, 85)
            .setInteractive()
            .on("pointerdown", this.onClickIngredient);

        return label;
    }

    addIngredient(item: any): void {

    }

    onMouseWheel(pointer: any, event: any[], x: number, y: number): void {

        let oy = this._scroll.childOY - y / 2;

        if (oy > 0) {
            oy = 0;
        }

        if (oy < -1 * this._scroll.height + 150) {
            oy = this._scroll.childOY;
        }
        this._scroll.childOY = oy;
    }
}
