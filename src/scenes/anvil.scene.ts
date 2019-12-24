import * as Phaser from "phaser";
import {Db} from "@it/shared";
import {TweenIngredientGameObject} from "@it/game-objects";

export class AnvilScene extends Phaser.Scene {

    private _db: Db;

    private _firstId: number;
    private _first: TweenIngredientGameObject;
    private _secondId: number;
    private _second: TweenIngredientGameObject;

    private _clearStarted: boolean = false;
    private _mergeStarted: boolean = false;

    init() {
        this._db = this.cache.json.get("db");
    }

    preload() {
        console.log("preload anvil");

        const backgroundColor = 0x0d084c;
        const foregroundColor = 0x1f1aad;

        const firstRect = new Phaser.Geom.Rectangle(30, 130, 90, 90);
        const anvilRect = new Phaser.Geom.Rectangle(255, 130, 90, 90);
        const secondRect = new Phaser.Geom.Rectangle(480, 130, 90, 90);

        this._createRect(firstRect);
        this._createRect(anvilRect);
        this._createRect(secondRect);

        const rect1 = this.add.rectangle(400, 30, 200, 30);
        const rect2 = this.add.rectangle(400, 59, 200, 30);

        console.log("preload anvil completed");
    }

    update() {

        const anvil: number[] = this.cache.obj.get("anvil");

        if (anvil) {
            if (anvil.length > 0) {
                if (!this._firstId) {

                    const firstId = anvil[0];

                    const first = this._db.items.find(x => x.id === firstId);

                    this._first = (<any>this.add).tweenIngredient(75, 175, first.texture);

                    this._firstId = firstId;
                }
            }

            if (anvil.length > 1) {
                if (!this._secondId) {

                    const secondId = anvil[1];

                    const second = this._db.items.find(x => x.id == secondId);

                    this._second = (<any>this.add).tweenIngredient(525, 175, second.texture);

                    this._secondId = secondId;
                }
            }

            if (!this._mergeStarted) {

                if (anvil.length > 1) {
                    const blueprint = this._db.blueprints
                        .find(x => x.firstId == this._firstId && x.secondId === this._secondId);

                    if (blueprint) {

                        this.tweens.add({
                            targets: [this._first, this._second],
                            x: 300,
                            y: 175,
                            ease: "Power2",
                            duration: 500,
                            onComplete: () => {
                                this._firstId = null;
                                this._first = null;
                                this._secondId = null;
                                this._second = null;

                                const result = this._db.items.find(x => x.id === blueprint.resultId);

                                (<any>this.add).tweenIngredient(300, 175, result.texture);

                                this._mergeStarted = false;
                                this.cache.obj.add("anvil", []);
                            }
                        });

                        this._mergeStarted = true;
                    }
                }
            }
        }
    }

    private _createRect(rect: Phaser.Geom.Rectangle) {
        const backgroundColor = 0x0d084c;
        const foregroundColor = 0x1f1aad;

        const g = this.add
            .graphics({lineStyle: {width: 2, color: foregroundColor}, fillStyle: {color: backgroundColor}})
            .fillRectShape(rect)
            .strokeRectShape(rect);
    }
}
