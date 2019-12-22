import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
    init() {
        console.log("Booting...");

        let value = localStorage.getItem("opened");

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

        this.cache.obj.add("opened", opened);

        localStorage.setItem("opened", JSON.stringify(opened));

        console.log("Booting completed");
    }

    preload() {
        console.log("Load things necessary during preload scene");

        this.load.json("db", "db.json");

    }

    create() {
        this.scene.start("game");
    }
}
