export class IngredientGameObject extends Phaser.GameObjects.Container {

    public readonly id: number;

    public readonly texture: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, id: number) {
        super(scene, x, y);

        this.id = id;


        if (id > 0) {
            this.add(new Phaser.GameObjects.Sprite(scene, 0, 0, "assets", texture).setAlpha(0.85));
            this.texture = texture;
        } else {
            this.add(new Phaser.GameObjects.Sprite(scene, 0, 0, "triamero").setAlpha(0.85));
            this.texture = "triamero";
        }
    }
}
