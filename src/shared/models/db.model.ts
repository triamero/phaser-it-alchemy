import {BlueprintModel} from "./blueprint.model";
import {ElementModel} from "./element.model";

export interface DbModel {
    elements: ElementModel[];
    blueprints: BlueprintModel[];
}




