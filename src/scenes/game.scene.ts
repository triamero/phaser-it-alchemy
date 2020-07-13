import {ElementObject} from "@it/objects";
import {BlueprintModel, Constants, DbModel, Egg} from "@it/shared";
import {DescriptionScene} from "./description.scene";

export class GameScene extends Phaser.Scene {

    private _scroll: any;
    private _sizer: any;
    private _gridSizer: any;

    private _counter: number = 0;

    private _firstId: number;
    private _first: ElementObject;
    private _secondId: number;
    private _second: ElementObject;

    private _moving: boolean = false;
    private _merging: boolean = false;
    private _clearing: boolean = false;

    private _db: DbModel = null;

    protected init() {
        this._db = this.cache.json.get("db");

        Egg.update(this);
    }

    protected preload() {
        this._recalculatePoints();
        this.scene.launch("hud");
    }

    protected create() {

        this.add.sprite(535, 55, "controls", "info")
            .setScale(0.5)
            .setSize(80, 80)

            .setInteractive()
            .on("pointerup", () => {
                this.scene.stop("hud");
                this.scene.start("info");
            });

        this.add.sprite(75, 175, "controls", "ingr").setAlpha(0.85);
        this.add.sprite(300, 175, "controls", "anvil");
        this.add.sprite(525, 175, "controls", "ingr").setAlpha(0.85);

        this.add.sprite(30, 280, "controls", "corner").setScale(0.5).setRotation(-Math.PI / 2);
        this.add.sprite(570, 280, "controls", "corner").setScale(0.5);
        this.add.sprite(570, 720, "controls", "corner").setScale(0.5).setRotation(Math.PI / 2);
        this.add.sprite(30, 720, "controls", "corner").setScale(0.5).setRotation(Math.PI);

        this._scroll = this.rexUI.add
            .scrollablePanel({
                x: 300,
                y: 500,
                width: 600,
                height: 470,
                scrollMode: 0,

                panel: {
                    child: this._createTable(),
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

        this.input.on("wheel", this._onMouseWheel, this);
    }

    public update() {

        Egg.update(this);

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

                        const result = this._db.elements.find(x => x.id === blueprint.resultId);

                        const tw = (<any>this.add).ingredient(300, 175, result.texture, result.id);

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

                            this._showDescription(result);

                            if (result.id < 0) {
                                return;
                            }

                            opnd.push(result.id);

                            const s = JSON.stringify(opnd);

                            localStorage.setItem("openedIds", s);

                            this.cache.obj.add("opened", [opnd.length, this._db.elements.length]);

                            this._addIngredient(result);

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
                    ease: "Power2",
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

    private _getBlueprint(): BlueprintModel {

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
            .map(x => this._db.elements.find(z => z.id === x))
            .map(x => x.points)
            .reduce((prev, curr) => prev + curr);

        this.cache.obj.add("points", points);
    }

    private _createTable() {

        const opened: number[] = this.cache.obj.get("openedIds");

        this._gridSizer = this.rexUI.add.gridSizer({
            column: 4,
            row: Math.floor(opened.length / 4) + 1,
        });

        const items = opened.map(x => this._db.elements.find(i => i.id === x));

        for (let i = 0, cnt = items.length; i < cnt; i++) {

            const item = items[i];

            const icon = this._createIcon(item);

            const column = i % 4;
            const row = Math.floor(i / 4);

            this._gridSizer.add(icon, column, row, "top", 2, true);
        }

        this._sizer = this.rexUI.add
            .sizer({orientation: "y"})
            .add(this._gridSizer, 1, "center", 5, true);

        return this._sizer;
    }

    private _createIcon(item: any) {

        const label = this.rexUI.add.label({
            orientation: "y",
            icon: this.add.ingredient(0, 0, item.texture, item.id),
            text: this.add.text(0, 0, item.name, {
                fontFamily: "fixedsys",
                fontSize: "20px",
                color: Constants.TextColor,
                align: "center",
                wordWrap: {width: 90, useAdvancedWrap: true}
            }),
            space: {
                left: 30,
                right: 30
            }
        });

        const icon = label.getElement("icon");

        icon.setSize(85, 85).setInteractive()
            .on("pointerdown", function () {

                icon.time = new Date();

            })

            .on("pointerup", () => {

                if (this._moving || this._merging || this._clearing) {
                    return;
                }

                const time = new Date().getTime() - icon.time.getTime();

                if (time > 200) {
                    this._showDescription(item);
                    return;
                }

                this._moving = true;

                const me = <ElementObject><any>icon;

                const myClone = new ElementObject(this, me.x, me.y, me.id, me.name, "assets", me.texture);
                this.add.existing(myClone);

                let x: number = null;
                let y: number = null;

                if (!this._firstId) {
                    x = 75;
                    y = 175;
                } else if (!this._secondId) {
                    x = 525;
                    y = 175;
                }

                this.tweens.add({
                    targets: [myClone],
                    duration: 600,
                    x: x,
                    y: y,
                    ease: "Power2",
                    onComplete: () => {

                        this._moving = false;

                        if (!this._firstId) {
                            this._firstId = me.id;
                            this._first = myClone;
                        } else if (!this._secondId) {
                            this._secondId = me.id;
                            this._second = myClone;
                        }

                        myClone.setSize(me.height, me.width).setInteractive();
                        myClone.on("pointerup", () => {
                            this._firstId = null;
                            this._first = null;
                            this._secondId = null;
                            this._second = null;
                            myClone?.destroy();
                        });
                    }
                });
            });

        return label;
    }

    private _addIngredient(item: any): void {

        const opened: number[] = this.cache.obj.get("openedIds");

        const icon = this._createIcon(item);

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

    // noinspection JSUnusedLocalSymbols
    private _onMouseWheel(pointer: any, event: any[], x: number, y: number): void {

        let oy = this._scroll.childOY - y / 2;

        if (oy > 0) {
            oy = 0;
        } else if (oy < this._scroll.bottomChildOY) {
            oy = this._scroll.bottomChildOY;
        }

        this._scroll.childOY = oy;
    }

    private _showDescription(item: any): void {
        const handle = "description" + this._counter++;

        const win = this.add.zone(0, 0, 600, 800);

        const scene = new DescriptionScene(handle, win);

        this.scene.add(handle, scene, true, item);
    }
}
