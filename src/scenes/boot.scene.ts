import * as Phaser from "phaser";
import {Db} from "@it/shared";

export class BootScene extends Phaser.Scene {
    init() {
        console.log("Booting...");

        let value = localStorage.getItem("openedIds");

        if (!value) {
            value = "[]";
        }

        let opened: number[] = JSON.parse(value);

        if (opened.length < 4) {
            opened = [1, 2, 3, 4];
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
        this.load.image("deadline", "assets/deadline.png");
        this.load.image("complexity", "assets/complexity.png");
        this.load.image("datascientist", "assets/datascientist.png");
        this.load.image("map-reduce", "assets/map-reduce.png");
        this.load.image("community", "assets/community.png");
        this.load.image("text", "assets/text.png");
        this.load.image("code", "assets/code.png");
        this.load.image("programmer", "assets/programmer.png");
        this.load.image("coffeescript", "assets/coffeescript.png");
        this.load.image("github", "assets/github.png");
        this.load.image("fortran", "assets/fortran.png");
        this.load.image("java", "assets/java.png");
        this.load.image("manager", "assets/manager.png");
        this.load.image("fsharp", "assets/fsharp.png");
        this.load.image("program", "assets/program.png");
        this.load.image("computer-games", "assets/computer-games.png");
        this.load.image("network", "assets/network.png");
        this.load.image("scrum-master", "assets/scrum-master.png");
        this.load.image("piece", "assets/piece.png");
        this.load.image("android", "assets/android.png");
        this.load.image("coffee-machine", "assets/coffee-machine.png");
        this.load.image("shader", "assets/shader.png");
        this.load.image("bitcoin", "assets/bitcoin.png");
        this.load.image("node", "assets/node.png");
        this.load.image("sql", "assets/sql.png");
        this.load.image("asm", "assets/asm.png");
        this.load.image("satoshi", "assets/satoshi.png");
        this.load.image("zuckerberg", "assets/zuckerberg.png");
        this.load.image("pair-programming", "assets/pair-programming.png");
        this.load.image("consensus", "assets/consensus.png");
        this.load.image("it", "assets/it.png");
        this.load.image("rdbms", "assets/rdbms.png");
        this.load.image("basic", "assets/basic.png");
        this.load.image("ddc", "assets/ddc.png");
        this.load.image("k8s", "assets/k8s.png");
        this.load.image("js", "assets/js.png");
        this.load.image("sysadmin", "assets/sysadmin.png");
        this.load.image("raft", "assets/raft.png");
        this.load.image("clouds", "assets/clouds.png");
        this.load.image("cman", "assets/cman.png");
        this.load.image("csharp", "assets/csharp.png");
        this.load.image("bug", "assets/bug.png");
        this.load.image("legacy", "assets/legacy.png");
        this.load.image("script", "assets/script.png");
        this.load.image("tester", "assets/tester.png");
        this.load.image("tests", "assets/tests.png");
        this.load.image("qa", "assets/qa.png");
        this.load.image("quantum-computer", "assets/quantum-computer.png");
        this.load.image("pizza", "assets/pizza.png");
        this.load.image("experience", "assets/experience.png");
        this.load.image("habr", "assets/habr.png");
        this.load.image("error", "assets/error.png");
        this.load.image("compiler", "assets/compiler.png");
        this.load.image("c", "assets/c.png");
        this.load.image("c-plus-plus", "assets/c-plus-plus.png");
        this.load.image("windows", "assets/windows.png");
        this.load.image("vs", "assets/vs.png");
        this.load.image("ticket", "assets/ticket.png");
        this.load.image("microsoft", "assets/microsoft.png");
        this.load.image("linux", "assets/linux.png");
        this.load.image("linus", "assets/linus.png");
        this.load.image("html", "assets/html.png");
        this.load.image("holywar", "assets/holywar.png");
        this.load.image("gamer", "assets/gamer.png");
        this.load.image("fb", "assets/fb.png");
        this.load.image("dotnext", "assets/dotnext.png");
        this.load.image("dotnetcore", "assets/dotnetcore.png");
        this.load.image("dotnet", "assets/dotnet.png");
        this.load.image("stallman", "assets/stallman.png");
        this.load.image("dos", "assets/dos.png");
        this.load.image("onn", "assets/onn.png");
        this.load.image("gates", "assets/gates.png");
        this.load.image("screen", "assets/screen.png");
        this.load.image("dodo", "assets/dodo.png");
        this.load.image("middle", "assets/middle.png");
        this.load.image("senior", "assets/senior.png");
        this.load.image("user", "assets/user.png");
        this.load.image("ui", "assets/ui.png");
        this.load.image("documentation", "assets/documentation.png");
        this.load.image("open-source", "assets/open-source.png");
        this.load.image("internet", "assets/internet.png");
        this.load.image("ux", "assets/ux.png");
        this.load.image("azure", "assets/azure.png");
        this.load.image("sre", "assets/sre.png");
        this.load.image("docker", "assets/docker.png");
        this.load.image("richter", "assets/richter.png");
        this.load.image("site", "assets/site.png");
        this.load.image("dodopizza-ru", "assets/dodopizza-ru.png");
        this.load.image("backend", "assets/backend.png");
        this.load.image("frontend", "assets/frontend.png");
        this.load.image("autotests", "assets/autotests.png");
        this.load.image("death-screen", "assets/death-screen.png");
        this.load.image("dodo-is", "assets/dodo-is.png");
        this.load.image("dodo-is-com", "assets/dodo-is-com.png");
        this.load.image("combo", "assets/combo.png");
        this.load.image("pizza-robot", "assets/pizza-robot.png");
        this.load.image("alchemy", "assets/alchemy.png");
        this.load.image("drone", "assets/drone.png");
        this.load.image("hardware-engineer", "assets/hardware-engineer.png");
        this.load.image("coffee-break", "assets/coffee-break.png");

    }

    create() {

        const db: Db = this.cache.json.get("db");

        const openedIds: number[] = this.cache.obj.get("openedIds");
        this.cache.obj.add("opened", [openedIds.length, db.items.length]);

        this.scene.start("game");
    }
}
