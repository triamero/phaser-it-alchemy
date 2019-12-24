import * as Phaser from "phaser";
import {IngredientGameObject} from "./object";

export class IngredientPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject("ingredient", this.createIngredient);
    }

    createIngredient(x: number, y: number, texture: string, name: string, id: number) {

        const me: any = this;

        return me.displayList.add(new IngredientGameObject(me.scene, x, y, texture, name, id));
    }
}
