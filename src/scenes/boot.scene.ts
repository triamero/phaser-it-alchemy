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
        this.load.image("data", "assets/data.png");
        this.load.image("electron", "assets/electron.png");
        this.load.image("electricity", "assets/electricity.png");
        this.load.image("data-structures", "assets/data-structures.png");
        this.load.image("algorithm", "assets/algorithm.png");
        this.load.image("big-data", "assets/big-data.png");
        this.load.image("table", "assets/table.png");
        this.load.image("gpu", "assets/gpu.png");
        this.load.image("robot", "assets/robot.png");
        this.load.image("spark", "assets/spark.png");
        this.load.image("computer", "assets/computer.png");
        this.load.image("pixel", "assets/pixel.png");
        this.load.image("olap", "assets/olap.png");
        this.load.image("picture", "assets/picture.png");
        this.load.image("datacenter", "assets/datacenter.png");
    }

    create() {

        const db: Db = this.cache.json.get("db");

        const openedIds: number[] = this.cache.obj.get("openedIds");
        this.cache.obj.add("opened", [openedIds.length, db.items.length]);

        this.scene.start("game");
    }
}
