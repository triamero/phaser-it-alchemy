import * as Phaser from "phaser";

export class TweenIngredientGameObject extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y);

        this.add(new Phaser.GameObjects.Image(scene, 0, 0, texture));
    }
}
