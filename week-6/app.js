import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

const csvFile = "./data/mushroom.csv";
const trainingLabel = "class";
const ignored = ["class", "population", "habitat", "bruises"];

let decisionTree;

let goodPoison = 0;
let goodEdible = 0;
let isPoison = 0;
let isEdible = 0;

function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
            trainModel(results.data);
            setupFormPrediction();
        },
    });
}

function trainModel(data) {
    const trainData = data.slice(0, Math.floor(data.length * 0.8));
    const testData = data.slice(Math.floor(data.length * 0.8) + 1);

    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel,
    });

    const visual = new VegaTree("#view", 800, 400, decisionTree.toJSON());

    // let mushroom = testData[0];
    // let mushroomPrediction = decisionTree.predict(mushroom);
    // console.log(`The mushroom is: ${mushroomPrediction}`);

    function accuracy(data, tree, label) {
        let correct = 0;
        for (const row of data) {
            if (row.class === tree.predict(row)) {
                correct++;
            }
        }
        const accuracy = document.getElementById("accuracy");
        accuracy.innerText = `Accuracy ${label}: ${correct / data.length}`;
        console.log(`Accuracy ${label}: ${correct / data.length}`);
    }

    accuracy(trainData, decisionTree, "train");
    accuracy(testData, decisionTree, "test");

    for (const row of data) {
        const prediction = decisionTree.predict(row);
        if (row.class === "e" && prediction === "p") {
            isPoison++;
        } else if (row.class === "p" && prediction === "e") {
            isEdible++;
        } else if (row.class === "p" && prediction === "p") {
            goodPoison++;
        } else if (row.class === "e" && prediction === "e") {
            goodEdible++;
        }
    }

    document.getElementById("isEdible").innerHTML = goodEdible.toString();
    document.getElementById("isNotEdible").innerHTML = isEdible.toString();
    document.getElementById("isPoison").innerHTML = isPoison.toString();
    document.getElementById("isNotPoison").innerHTML = goodPoison.toString();

    const json = decisionTree.toJSON();
    const jsonString = JSON.stringify(json);
    console.log(jsonString);
}

function setupFormPrediction() {
    const form = document.getElementById("predictionForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputs = Array.from(form.elements);
        const attributes = inputs
            .filter((input) => input.tagName === "SELECT")
            .map((input) => input.value);
        const prediction = decisionTree.predict(attributes);
        displayPredictionResult(prediction);
    });
}

function displayPredictionResult(prediction) {
    const form = document.getElementById("predictionForm");
    const inputs = Array.from(form.elements);
    const attributes = inputs
        .filter((input) => input.tagName === "SELECT")
        .map((input) => input.value);
    const userInput = attributes.join(", ");
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = `Input: ${userInput}<br>Prediction: ${prediction}`;
}


loadData();
