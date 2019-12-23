import * as Phaser from "phaser";

export class IngredientGameObject extends Phaser.GameObjects.Image {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }
}
