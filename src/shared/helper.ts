export class Helper {
    public static createRectangle(scene: Phaser.Scene, rectangle: Phaser.Geom.Rectangle) {
        const backgroundColor = 0x071a07;
        const foregroundColor = 0x177317;

        const g = scene.add
            .graphics({lineStyle: {width: 2, color: foregroundColor}, fillStyle: {color: backgroundColor}})
            .fillRectShape(rectangle)
            .strokeRectShape(rectangle);
    }
}
