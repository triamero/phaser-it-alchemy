import * as Phaser from "phaser";

export class IngredientGameObject extends Phaser.GameObjects.Container {

    public readonly id: number;

    public readonly texture: string;

    private readonly _image: Phaser.GameObjects.Image = null;

    public get image(): Phaser.GameObjects.Image {
        return this._image;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string, id: number) {
        super(scene, x, y);

        this.id = id;
        this.texture = texture;

        this._image = scene.add.image(15, 15, texture);

        this.add(this._image);

        const text = scene.add.text(-20, 45, name, {align: "center"});
        //text.setOrigin(0.5);

        this.add(text);

        this.setSize(90, 120)
    }

    public setDisabled(): void {
        this._image.setAlpha(0.3);
    }

    public setEnabled(): void {
        this._image.setAlpha(1);
    }
}
