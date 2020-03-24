function onInlinePredictionButtonClick() {
    const prices = readPricesFromInlineInput();
    if (!prices) {
        return;
    }

    writePricesToInput(prices);
    onPredictionButtonClick();
}

function onPredictionButtonClick() {
    const prices = readPricesFromInput();
    savePrices(prices);
    writePricesToInlineInput(prices);

    const result = predict(readParametersFromInput(), prices);
    displayResult(result);
}

function loadPrices() {
    return localStorage.prices.split(',')
            .map(e => parseInt(e));
}

function savePrices(prices) {
    localStorage.prices = prices;
}

function readPricesFromInlineInput() {
    let inlineInput = priceInputForm.inlineInput.value;
    inlineInput = inlineInput.replace(/^[^0-9]+|[^0-9]+$/g, '');
    inlineInput = inlineInput.replace(/[^0-9/]+|[\/]/g, ' ');

    if (inlineInput == '') {
        return null;
    }
    return inlineInput.split(' ');
}

function writePricesToInlineInput(prices) {
    let inlinePrices = (!isNaN(prices[0]) ? prices[0] : '0') + ' ';

    for (let i = 1; i < prices.length; i++) {
        if (i % 2 == 0) {
            inlinePrices += '/';
        }
        if (!isNaN(prices[i])) {
            inlinePrices += prices[i];
        }
        if (i % 2 == 0) {
            inlinePrices += ' ';
        }
    }
    inlinePrices = inlinePrices.replace(/[^0-9]+$/g, '');

    priceInputForm.inlineInput.value = inlinePrices;
}

function readPricesFromInput() {
    return Array.from(document.getElementsByName('price'))
            .map(e => parseInt(e.value));
}

function writePricesToInput(prices) {
    document.getElementsByName('price').forEach(e => e.value = '');

    const priceInputs = document.getElementsByName('price');
    for (i = 0; i < priceInputs.length && i < prices.length; i++) {
        if (!isNaN(prices[i])) {
            priceInputs[i].value = prices[i];
        }
    }
}

// TODO: Implement
function readParametersFromInput() {
    return {
        wave: {
            risingTransition:             new Transition(Method.SP, 90, 140),
            twoTimesFalling1Transition:   new Transition(Method.SP, 60, 80),
            twoTimesFalling2Transition:   new Transition(Method.SP_DIFF, -10, -4),
            threeTimesFalling1Transition: new Transition(Method.SP, 60, 80),
            threeTimesFalling2Transition: new Transition(Method.SP_DIFF, -10, -4),
            threeTimesFalling3Transition: new Transition(Method.SP_DIFF, -10, -4),
            twoTimesFallingStartDays:   [Days.MON1, Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2, Days.FRI1, Days.FRI2, Days.SAT1],
            threeTimesFallingStartDays: [Days.MON1, Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2, Days.FRI1, Days.FRI2],
        },
        falling: {
            mon1Transition:      new Transition(Method.SP, 85, 90),
            otherDaysTransition: new Transition(Method.SP_DIFF, -6, -2),
        },
        thirdPeriod: {
            mon1Transition:         new Transition(Method.SP, 85, 90),
            beforeRisingTransition: new Transition(Method.SP_DIFF, -6, -2),
            rising1Transition:      new Transition(Method.SP, 90, 140),
            rising2Transition:      new Transition(Method.SP, 140, 200),
            rising3Transition:      new Transition(Method.SP, 200, 600),
            rising4Transition:      new Transition(Method.SP, 140, 200),
            rising5Transition:      new Transition(Method.SP, 90, 140),
            rising6Transition:      new Transition(Method.SP, 40, 90),
            afterRisingTransition:  new Transition(Method.SP, 40, 90),
            risingStartDays: [Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2],
        },
        fourthPeriod: {
            mon1Transition:         new Transition(Method.SP, 40, 90),
            beforeRisingTransition: new Transition(Method.SP_DIFF, -6, -2),
            rising1Transition:      new Transition(Method.SP, 90, 140),
            rising2Transition:      new Transition(Method.SP, 90, 140),
            rising3Transition:      new Transition(Method.SP, 140, 190),
            rising4Transition:      new Transition(Method.SP, 140, 200),
            rising5Transition:      new Transition(Method.SP, 140, 190),
            rising6Transition:      new Transition(Method.SP, 40, 90),
            afterRisingTransition:  new Transition(Method.SP_DIFF, -6, -2),
            risingStartDays: [Days.MON1, Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2],
            hasFourthPeriodPeak: true,
        },
    };
}

function displayResult(result) {
    if (!result) {
        return;
    }
    console.log(result);

    const tableBody = document.getElementById('predictionTableBody');
    tableBody.innerHTML = '';
    displayWaveResult('파도형', result.wave, tableBody);
    displayFallingResult('하락형', result.falling, tableBody);
    displayNthPeriodResult('3기형', result.thirdPeriod, tableBody);
    displayNthPeriodResult('4기형', result.fourthPeriod, tableBody);
}

function displayWaveResult(title, result, tableBody) {
    function transitionTypeToString(type) {
        switch (type) {
            case WavePatternTransitionType.RISING:
                return '↑';
            case WavePatternTransitionType.TWO_TIMES_FALLING:
            case WavePatternTransitionType.THREE_TIMES_FALLING:
                return '↓';
        }
    };

    for (let eachResult of result) {
        const key = eachResult[0];
        const value = eachResult[1];
        if (!value) {
            continue;
        }

        detailedType = [...key]
                .reduce((acc, cur, _) => acc + transitionTypeToString(cur), '');
        displayResultRow(title, detailedType, value, tableBody);
    }
}

function displayFallingResult(title, result, tableBody) {
    if (!result) {
        return;
    }

    displayResultRow(title, null, result, tableBody);
}

function displayNthPeriodResult(title, result, tableBody) {
    const detailedTypes = [
        '월AM변조', '월PM변조',
        '화AM변조', '화PM변조',
        '수AM변조', '수PM변조',
        '목AM변조', '목PM변조',
        '금AM변조', '금PM변조',
        '토AM변조', '토PM변조',
    ];

    for (let i = 0; i < result.length; i++) {
        const eachResult = result[i];
        if (!eachResult) {
            continue;
        }

        displayResultRow(title, detailedTypes[i], eachResult, tableBody);
    }
}

function displayResultRow(typeName, detailedType, result, tableBody) {
    let insertedRow = tableBody.insertRow(-1);

    let typeNameCell = document.createElement('th');
    typeNameCell.innerText = typeName;
    insertedRow.appendChild(typeNameCell);

    if (detailedType && detailedType != '') {
        let detailedTypeCell = document.createElement('th');
        detailedTypeCell.innerText = detailedType;
        insertedRow.appendChild(detailedTypeCell);
    } else {
        typeNameCell.colSpan = 2;
    }

    result.forEach(p => {
        let priceCell = insertedRow.insertCell(-1);
        priceCell.innerText = p.toString();
    });
}
