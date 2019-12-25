const fs = require("fs");

const content = fs.readFileSync("blueprints.txt", "utf8");

const lines = content.split("\n");

const items = [];
const blueprints = [];

let id = 1;

for (let i = 0; i < lines.length; i++) {

    let row = lines[i];

    let result = null;

    try {
        result = parseRow(row);
    } catch (e) {
        console.log(row);
        throw e;
    }


    if (result == null) {
        continue;
    }

    if (result[0]) {
        items.push(result[0]);
    }

    if (result[1]) {
        blueprints.push(result[1]);
    }
}

function getPoints(generation) {

    if(generation < 1){
        return 0;
    }

    if(generation < 2) {
        return 5;
    }

    return getPoints(generation - 1) + (generation - 1) * 2
}

function parseRow(row) {
    if (!row) {
        return null;
    }

    row = row.trim();

    if (!row || row.startsWith("#")) {
        return null;
    }

    if (row.startsWith("-")) {
        const splits = row.split(";");

        let descr = splits[2];

        descr = descr.endsWith(".") ? descr : descr + ".";

        const obj = {
            id: id++,
            generation: 0,
            name: splits[0].replace("-", ""),
            points: 0,
            texture: splits[1],
            description: descr
        };

        return [obj, null];
    }

    const data = row.split(";");

    const splits = data[0].split("=");

    const ingredients = splits[0].split(" + ");
    const result = splits[1].trim();

    const first = ingredients[0].trim();
    const second = ingredients[1].trim();

    const firstItem = items.find(x => x.name === first);
    const secondItem = items.find(x => x.name === second);

    let resultItem = items.find(x => x.name === result);

    const resultArr = [];

    if (resultItem == null) {

        const gen = Math.max(firstItem.generation, secondItem.generation) + 1;

        resultItem = {
            id: id++,
            generation: gen,
            name: result,
            points: getPoints(gen),
            texture: data[1],
            description: data[2]
        };

        resultArr.push(resultItem);
    } else {
        resultArr.push(null);
    }

    resultArr.push({
        firstId: firstItem.id,
        secondId: secondItem.id,
        resultId: resultItem.id
    });

    return resultArr;
}

const obj = {
    items, blueprints
};

const maxGeneration = Math.max.apply(null, items.map(x => x.generation));

console.log("Max generation:", maxGeneration);

const resultContent = JSON.stringify(obj, null, 2);

fs.writeFileSync("db.json", resultContent);
