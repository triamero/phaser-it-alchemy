import {ElementObject} from "./element.object";
import {ElementModel} from "@it/shared";

export class ElementsGridObject extends Phaser.GameObjects.Container {

    private readonly _scrollablePanel: RexUIScrollablePanel;
    private readonly _gridSizer: any;
    private readonly _sizer: any;

    private readonly _elements: ElementObject[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this._gridSizer = scene.rexUI.add.gridSizer({
            column: 4,
            row: 1,
        });

        this._sizer = scene.rexUI.add
            .sizer({orientation: "y"})
            .add(this._gridSizer, 1, "center", 5, true);

        this._scrollablePanel = scene.rexUI.add.scrollablePanel({
            x: 300,
            y: 500,
            width: 600,
            height: 470,
            scrollMode: 0,

            panel: {
                child: this._sizer,
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
        });

        this._scrollablePanel.layout();
    }

    public addElement(element: ElementModel): this {

        const icon = this.scene.add;

        const index = this._elements.length - 1;

        const column = index % 4;
        const row = Math.floor(index / 4);

        if (row >= this._gridSizer.rowCount) {
            this._gridSizer.rowCount += 1;
        }

        this._gridSizer.add(icon, column, row);
        this._gridSizer.layout();
        this._sizer.layout();
        this._scrollablePanel.layout();

        return this;
    }

    private _createElement(element: ElementModel): ElementObject {
        const obj = new ElementObject(this.scene, )
    }
}
