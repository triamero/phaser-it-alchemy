import * as Phaser from "phaser";
import {Db} from "@it/shared/models";

export class Egg {

    update(scene: Phaser.Scene) {

        const opened: number[] = scene.cache.obj.get("openedIds");

        if (opened.length < 128) {
            return;
        }

        const db: Db = scene.cache.json.get("db");

        if (opened.length === 129 && db.items.length === 129) {
            return;
        }

        if (db.items.length === 128) {
            db.items.push({
                id: -1,
                description: "Фоторобот человека, скопировавшего эту игру у Dodo Pizza Engineering. Спасибо за игру!",
                generation: -1,
                points: 0,
                name: "triamero",
                texture: "triamero"
            });

            db.blueprints.push({
                resultId: -1,
                firstId: db.items.find(x => x.name === "Программист").id,
                secondId: db.items.find(x => x.name === "IT-алхимия").id
            });

            const data = "data:image/png;base64,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";
            scene.textures.addBase64("triamero", data);
        }
    }
}
