import * as Phaser from "phaser";
import {TweenIngredientGameObject} from "./object";

export class TweenIngredientPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject("tweenIngredient", this.createIngredient);
    }

    createIngredient(x: number, y: number, texture: string) {

        const me: any = this;

        return me.displayList.add(new TweenIngredientGameObject(me.scene, x, y, texture));
    }
}
