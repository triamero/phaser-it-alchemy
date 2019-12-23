import * as Phaser from "phaser";

export class IngredientGameObject extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string) {
        super(scene, x, y);

        this.add(new Phaser.GameObjects.Image(scene, 0, 0, texture));
        this.add(new Phaser.GameObjects.Text(scene, 0, 25, name, {align: "left"}));
    }
}
