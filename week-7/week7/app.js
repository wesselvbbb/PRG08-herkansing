const nn = ml5.neuralNetwork({ task: 'regression', debug: true });

nn.load('./model/model.json', modelLoaded);

const result = document.getElementById("result");
const predictBtn = document.getElementById("predict");
result.innerText = `...`;

predictBtn.addEventListener("click", () => predict());

function modelLoaded() {
    result.innerText = "Ready to predict";
}

async function predict() {
    let zipcodeInput = document.getElementById('Zipcode').value;
    let buildYearInput = document.getElementById('Buildyear').value;
    let bathroomsInput = document.getElementById('bathrooms').value;


    if (!zipcodeInput || !buildYearInput || !bathroomsInput) {
        result.innerText = 'Please enter all values.';
        return;
    }


    const zipcode = parseInt(zipcodeInput);
    const buildYear = parseInt(buildYearInput);
    const bathrooms = parseInt(bathroomsInput);


    if (isNaN(zipcode) || isNaN(buildYear) || isNaN(bathrooms)) {
        result.innerText = 'Invalid input. Please enter valid numbers.';
        return;
    }

    console.log(zipcode, buildYear, bathrooms);

    const results = await nn.predict({
        Zipcode: zipcode,
        Buildyear: buildYear,
        bathrooms: bathrooms
    });

    result.innerText = `Predicted value: ${Math.round(results[0].value)} euro`;

}

