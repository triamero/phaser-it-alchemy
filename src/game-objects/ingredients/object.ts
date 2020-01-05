import * as Phaser from "phaser";

export class IngredientGameObject extends Phaser.GameObjects.Container {

    public readonly id: number;

    public readonly texture: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, id: number) {
        super(scene, x, y);

        this.id = id;
        this.texture = texture;

        this.add(new Phaser.GameObjects.Sprite(scene, 0, 0, "assets", texture));
    }
}
