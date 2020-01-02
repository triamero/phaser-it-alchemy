import * as Phaser from "phaser";
import {Db} from "@it/shared";

export class BootScene extends Phaser.Scene {
    init() {
        console.log("Booting...");

        let value = localStorage.getItem("openedIds");

        if (!value) {
            value = "[]";
        }

        const opened: number[] = JSON.parse(value);

        if (opened.length === 0) {
            opened.push(1);
            opened.push(2);
            opened.push(3);
            opened.push(4);
        }

        this.cache.obj.add("openedIds", opened);

        localStorage.setItem("openedIds", JSON.stringify(opened));

        console.log("Booting completed");
    }

    preload() {
        this.load.json("db", "db.json");
        this.load.image("human", "assets/human.png");
        this.load.image("coffee", "assets/coffee.png");
        this.load.image("zero", "assets/zero.png");
        this.load.image("one", "assets/one.png");
        this.load.image("energy", "assets/energy.png");
        this.load.image("mathematics", "assets/mathematics.png");
        this.load.image("infinity", "assets/infinity.png");
        this.load.image("2d", "assets/2d.png");
        this.load.image("3d", "assets/3d.png");
        this.load.image("cpu", "assets/cpu.png");
        this.load.image("dimension", "assets/dimension.png");
        this.load.image("bit", "assets/bit.png");
        this.load.image("time", "assets/time.png");
    }

    create() {

        const db: Db = this.cache.json.get("db");

        const openedIds: number[] = this.cache.obj.get("openedIds");

        const points = openedIds
            .map(x => db.items.find(z => z.id === x))
            .map(x => x.points)
            .reduce((prev, curr) => prev + curr);

        this.cache.obj.add("points", points);
        this.cache.obj.add("opened", [openedIds.length, db.items.length]);

        this.scene.start("game");
    }
}
