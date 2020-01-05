import * as Phaser from "phaser";
import {Blueprint, Db, Helper} from "@it/shared";
import {TweenIngredientGameObject} from "@it/game-objects";
import {DescriptionScene} from "@it/scenes/description.scene";

export class GameScene extends Phaser.Scene {

    private _scroll: any;
    private _sizer: any;
    private _gridSizer: any;

    private _counter: number = 0;

    private _firstId: number;
    private _first: TweenIngredientGameObject;
    private _secondId: number;
    private _second: TweenIngredientGameObject;

    private _moving: boolean = false;
    private _merging: boolean = false;
    private _clearing: boolean = false;

    private _db: Db = null;

    protected init() {
        this._db = this.cache.json.get("db");
    }

    protected preload() {

        this._recalculatePoints();

        this.scene.launch("hud");

        this.load.tilemapTiledJSON("game", "assets/alchemy.json");
        this.load.image("game-tilemap", "assets/tilebag.png");

        this.load.scenePlugin({
            key: "rexuiplugin",
            url: "dist/rexuiplugin.min.js",
            sceneKey: 'rexUI'
        });
    }

    protected create() {

        const me: any = this;

        const map = this.make.tilemap({key: "game", height: +this.game.config.height, width: +this.game.config.width});

        const tileset = map.addTilesetImage("tilebag", "game-tilemap", 90, 90);

        map.createStaticLayer("background", tileset, 0, 0);

        const firstRect = new Phaser.Geom.Rectangle(30, 130, 90, 90);
        const anvilRect = new Phaser.Geom.Rectangle(255, 130, 90, 90);
        const secondRect = new Phaser.Geom.Rectangle(480, 130, 90, 90);

        Helper.createRectangle(this, firstRect);
        Helper.createRectangle(this, anvilRect);
        Helper.createRectangle(this, secondRect);

        this._scroll = me.rexUI.add
            .scrollablePanel({
                x: 300,
                y: 500,
                width: 600,
                height: 450,
                scrollMode: 0,

                panel: {
                    child: this.createTable(me),
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

        if (!this._merging && this._firstId && this._secondId) {

            const blueprint = this._getBlueprint();

            if (blueprint) {

                this._merging = true;

                this.tweens.add({
                    targets: [this._first, this._second],
                    x: 300,
                    y: 175,
                    ease: "Power2",
                    duration: 500,
                    onComplete: () => {
                        this._firstId = null;
                        this._first?.destroy();
                        this._first = null;
                        this._secondId = null;
                        this._second?.destroy();
                        this._second = null;

                        const result = this._db.items.find(x => x.id === blueprint.resultId);

                        const tw = (<any>this.add).tweenIngredient(300, 175, result.texture);

                        this.tweens.add({
                            targets: [tw],
                            alpha: {from: 1, to: 0},
                            ease: "Power2",
                            duration: 500,
                            onComplete: () => {
                                tw?.destroy();
                            }
                        });

                        this._merging = false;

                        const opnd: number[] = this.cache.obj.get("openedIds");

                        if (!opnd.some(x => x === result.id)) {

                            const handle = "description" + this._counter++;

                            const win = this.add.zone(0, 0, 600, 800);

                            const scene = new DescriptionScene(handle, win);

                            this.scene.add(handle, scene, true, result);
                            opnd.push(result.id);

                            const s = JSON.stringify(opnd);

                            localStorage.setItem("openedIds", s);

                            this.cache.obj.add("opened", [opnd.length, this._db.items.length]);

                            this.addIngredient(result);

                            this._recalculatePoints();
                        }
                    }
                });
            }
        }

        if (!this._clearing && this._firstId && this._secondId) {
            const blueprint = this._getBlueprint();

            if (!blueprint) {

                this._clearing = true;

                this.tweens.add({
                    targets: [this._second],
                    alpha: {from: 1, to: 0},
                    ease: "Linear",
                    duration: 500,
                    onComplete: () => {
                        this._secondId = null;
                        this._second?.destroy();
                        this._second = null;

                        this._clearing = false;
                    }
                });
            }
        }
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

    private createTable(scene: any) {

        const opened: number[] = this.cache.obj.get("openedIds");

        this._gridSizer = scene.rexUI.add.gridSizer({
            column: 4,
            row: Math.floor(opened.length / 4) + 1,
        });

        const items = opened.map(x => this._db.items.find(i => i.id === x));

        for (let i = 0, cnt = items.length; i < cnt; i++) {

            const item = items[i];

            const icon = this.createIcon(scene, item);

            const column = i % 4;
            const row = Math.floor(i / 4);

            this._gridSizer.add(icon, column, row, "top", 2, true);
        }

        this._sizer = scene.rexUI.add
            .sizer({orientation: "y",})
            .add(this._gridSizer, 1, "center", 5, true);

        return this._sizer;
    }

    createIcon(scene: any, item: any) {

        const label = scene.rexUI.add.label({
            orientation: "y",
            icon: scene.add.tweenIngredient(0, 0, item.texture, item.id),
            text: scene.add.text(0, 0, item.name, {align: "center", wordWrap: {width: 150, useAdvancedWrap: true}})
        });

        const icon = label.getElement("icon");

        icon.setSize(150, 85).setInteractive()

            .on("pointerdown", () => {

                if (scene._moving || scene._merging || scene._clearing) {
                    return;
                }

                scene._moving = true;

                const me = <TweenIngredientGameObject><any>icon;

                const myClone = scene.add.tweenIngredient(me.x, me.y, me.texture, me.id);

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
                    onComplete: () => {

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
                            myClone?.destroy();
                        });
                    }
                });
            });

        return label;
    }

    addIngredient(item: any): void {

        //debugger;

        const opened: number[] = this.cache.obj.get("openedIds");

        const icon = this.createIcon(this, item);

        const index = opened.length - 1;

        const column = index % 4;
        const row = Math.floor(index / 4);

        if (row >= this._gridSizer.rowCount) {
            this._gridSizer.rowCount += 1;
        }

        this._gridSizer.add(icon, column, row);
        this._gridSizer.layout();
        this._sizer.layout();
        this._scroll.layout();
    }

    onMouseWheel(pointer: any, event: any[], x: number, y: number): void {

        let oy = this._scroll.childOY - y / 2;

        if (oy > 0) {
            oy = 0;
        } else if (oy < this._scroll.bottomChildOY) {
            oy = this._scroll.bottomChildOY;
        }

        this._scroll.childOY = oy;
    }
}
