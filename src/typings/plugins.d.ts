import {IngredientGameObject} from "@it/game-objects";

declare module "phaser" {

    namespace GameObjects {

        interface GameObjectFactory {
            ingredient(x: number, y: number, texture: string, frame?: string | number): IngredientGameObject;
        }
    }
}
