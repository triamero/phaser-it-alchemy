import * as Phaser from "phaser";

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

        const rect1 = this.add.rectangle(0, 0, 100, 100, 0xff0000);

        const rect2 = this.add.rectangle(0, 0, 100, 100, 0xff0000);

        this._firstContainer = this.add.container(60, 200, [rect1]);
        this._secondContainer = this.add.container(500, 200, [rect2]);
    }

    update() {

        let db = this.cache.json.get("db");

        if (this._firstId > 0) {
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

