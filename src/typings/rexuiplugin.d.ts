declare module "phaser" {

    interface Scene {
        rexUI: RexUIPlugins;
    }

    interface RexUIPlugins {
        add: RexUIGameObjectFactory;
    }

    namespace Plugins {
        namespace GameObjects {
            class ContainerBase extends Phaser.GameObjects.Zone {
                constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number);

                destroy(fromScene?: boolean): void;

                contains(gameObject: Phaser.GameObjects.GameObject): boolean;

                add(gameObjects: Phaser.GameObjects.GameObject[]): this;

                remove(gameObjects: Phaser.GameObjects.GameObject[], destroyChild: boolean): this;

                clear(destroyChild: boolean): this;
            }

            class ContainerLite extends ContainerBase {
                constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, children: Phaser.GameObjects.GameObject[])
            }
        }
    }
}

declare class RexUIGameObjectFactory {
    label(config: RexUILabelConfig): any;

    scrollablePanel(config: RexUIScrollablePanelConfig): RexUIScrollablePanel;

    sizer(config: any): any;

    gridSizer(config: any): any;
}

interface RexUIScrollablePanel {
    layout(): this;
}

interface RexUIScrollablePanelConfig {
    x: number;
    y: number;

    width: number;
    height: number;

    scrollMode: number;

    panel: any;

    scroller: {
        threshold: number;
        slidingDeceleration: number;
        backDeceleration: number;
    };

    space: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;

        panel?: number;
    }
}

interface RexUILabelConfig {
    orientation: string;
    icon: Phaser.GameObjects.GameObject;
    text: Phaser.GameObjects.Text;

    space: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    }
}

