import Presets from './presets.js';
import {
    Days, WavePatternTransitionType, Transition, TransitionMethod, predict
} from './predictor.js';
import { locale } from './locale.js';
import i18next from 'i18next';
import locI18next from 'loc-i18next';
import languageDetector from 'i18next-browser-languagedetector';
import html2canvas from 'html2canvas';

const defaultPreset = 'acnh';

const minInput = 0;
const maxInput = 2000;

const selectableDays = [
    Days.MON1, Days.MON2,
    Days.TUE1, Days.TUE2,
    Days.WED1, Days.WED2,
    Days.THU1, Days.THU2,
    Days.FRI1, Days.FRI2,
    Days.SAT1, Days.SAT2,
];

function onBodyLoad() {
    initTranslator();

    buildParameterInputTable()

    writeSettingsToInput(loadSettings());
    writePricesToInput(loadPrices())
}

function onChangeLanguageClick(language) {
    i18next.changeLanguage(language);
    location.reload();
}

function onInlineCopyButtonClick() {
    const maxLength = 99;

    const input = inlineInputForm.inlineInput;
    if (input.value.trim().length <= 0) {
        return;
    }

    input.select(); 
    input.setSelectionRange(0, maxLength);
 
    document.execCommand('copy');   
}

function onInlinePredictionSubmit() {
    const prices = readPricesFromInlineInput();
    if (!prices) {
        return false;
    }
    writePricesToInput(prices);

    return onPredictionSubmit();
}

function onPredictionSubmit() {
    saveSettings({
        tolerance: parseIntWithDefault(parameterInputForm.tolerance.value, 0),
        preset: parameterInputForm.parameterPreset.value,
    });

    const prices = readPricesFromInput();
    savePrices(prices);
    writePricesToInlineInput(prices);

    const result = predict(readParametersFromInput(), prices);
    displayResult(prices, result);

    return false;
}

function onExportImageButtonClick() {
    makeResultImage().then(image => {
        saveImage(image);
    });
}

function onParameterInputToggleButtonClick() {
    const parameterInputTable = document.getElementById('parameterInputTable');
    if (parameterInputTable.style.display == 'block') {
        parameterInputTable.style.display = 'none';
    } else {
        parameterInputTable.style.display = 'block';
    }
}

function onParameterPresetChange() {
    let selectedPresetKey = parameterInputForm.parameterPreset.value;
    writePresetParametersToInput(Presets.getPreset(selectedPresetKey));

    let presetTip = document.getElementById('presetTip');
    presetTip.innerText = selectedPresetKey == 'acnh' ? i18next.t('settings_preset_acnh_tip') : '';
}

function initTranslator() {
    i18next.use(languageDetector);
    i18next.init({
        fallbackLng: 'en',
        debug: true,
        resources: {
            ko: locale.ko,
            en: locale.en,
            'zh-CN': locale.zhcn,
        },
        detection: {
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage'],
        },
    }).then(function(_) {
        const localize = locI18next.init(i18next);
        localize('[data-i18n]');
        document.documentElement.lang = i18next.language;
    });
}

function loadPrices() {
    if (!localStorage || !localStorage.getItem('prices')) {
        return null;
    }

    return localStorage.getItem('prices').split(',')
            .map(e => parseInt(e));
}

function savePrices(prices) {
    if (!localStorage) {
        return;
    }

    localStorage.setItem('prices', prices);
}

function loadSettings() {
    if (!localStorage || !localStorage.getItem('settings')) {
        return null;
    }

    return JSON.parse(localStorage.getItem('settings'));
}

function saveSettings(settings) {
    if (!localStorage) {
        return;
    }

    localStorage.setItem('settings', JSON.stringify(settings));
}

function writeSettingsToInput(settings) {
    parameterInputForm.tolerance.value =
            settings && settings.tolerance ? settings.tolerance : 0;

    parameterInputForm.parameterPreset.value =
            settings && settings.preset ? settings.preset : defaultPreset;
    onParameterPresetChange();
}

function readPricesFromInlineInput() {
    let inlineInput = inlineInputForm.inlineInput.value;
    inlineInput = inlineInput.replace(/^[^0-9]+|[^0-9]+$/g, '');
    inlineInput = inlineInput.replace(/[^0-9/]+|[\/]/g, ' ');

    if (inlineInput == '') {
        return null;
    }
    return inlineInput.split(' ');
}

function writePricesToInlineInput(prices) {
    if (!prices) {
        return;
    }

    let inlinePrices = (prices[0] ? prices[0] : '0') + ' ';

    for (let i = 1; i < prices.length; i++) {
        if (i % 2 == 0) {
            inlinePrices += '/';
        }
        inlinePrices += prices[i] ? prices[i] : '-';
        if (i % 2 == 0) {
            inlinePrices += ' ';
        }
    }
    inlinePrices = inlinePrices.replace(/[^0-9]+$/g, '');

    inlineInputForm.inlineInput.value = inlinePrices;
}

function readPricesFromInput() {
    return Array.from(document.getElementsByName('price')).map(e => {
        let intValue = parseInt(e.value);
        return isBetween(intValue, minInput, maxInput) ? intValue : null;
    });
}

function writePricesToInput(prices) {
    if (!prices) {
        return;
    }

    document.getElementsByName('price').forEach(e => e.value = '');

    const priceInputs = document.getElementsByName('price');
    for (let i = 0; i < priceInputs.length && i < prices.length; i++) {
        if (isBetween(prices[i], minInput, maxInput)) {
            priceInputs[i].value = prices[i];
        }
    }
}

function readParametersFromInput() {
    function readTransitionFromInput(inputIndex) {
        return new Transition(
            parseIntWithDefault(parameterInputForm.transitionMethod[inputIndex].value, -1),
            parseIntWithDefault(parameterInputForm.transitionMin[inputIndex].value, 0),
            parseIntWithDefault(parameterInputForm.transitionMax[inputIndex].value, 0),
        );
    };

    function readSelectedDaysFromInput(inputGroupIndex) {
        const offset = inputGroupIndex * selectableDays.length;
        const selectedDays = new Array();
        for (let i = 0; i < selectableDays.length; i++) {
            if (parameterInputForm.transitionDay[offset + i].checked) {
                selectedDays.push(selectableDays[i]);
            }
        }
        return selectedDays;
    }

    return {
        tolerance: parseIntWithDefault(parameterInputForm.tolerance.value, 0),
        wave: {
            risingTransition:             readTransitionFromInput(0),
            twoTimesFalling1Transition:   readTransitionFromInput(1),
            twoTimesFalling2Transition:   readTransitionFromInput(2),
            threeTimesFalling1Transition: readTransitionFromInput(3),
            threeTimesFalling2Transition: readTransitionFromInput(4),
            threeTimesFalling3Transition: readTransitionFromInput(5),
            twoTimesFallingStartDays:     readSelectedDaysFromInput(0),
            threeTimesFallingStartDays:   readSelectedDaysFromInput(1),
        },
        falling: {
            mon1Transition:      readTransitionFromInput(6),
            otherDaysTransition: readTransitionFromInput(7),
        },
        thirdPeriod: {
            mon1Transition:         readTransitionFromInput(8),
            beforeRisingTransition: readTransitionFromInput(9),
            rising1Transition:      readTransitionFromInput(10),
            rising2Transition:      readTransitionFromInput(11),
            rising3Transition:      readTransitionFromInput(12),
            rising4Transition:      readTransitionFromInput(13),
            rising5Transition:      readTransitionFromInput(14),
            rising6Transition:      readTransitionFromInput(15),
            afterRisingTransition:  readTransitionFromInput(16),
            risingStartDays:        readSelectedDaysFromInput(2),
        },
        fourthPeriod: {
            mon1Transition:         readTransitionFromInput(17),
            beforeRisingTransition: readTransitionFromInput(18),
            rising1Transition:      readTransitionFromInput(19),
            rising2Transition:      readTransitionFromInput(20),
            rising3Transition:      readTransitionFromInput(21),
            rising4Transition:      readTransitionFromInput(22),
            rising5Transition:      readTransitionFromInput(23),
            rising6Transition:      readTransitionFromInput(24),
            afterRisingTransition:  readTransitionFromInput(25),
            risingStartDays:        readSelectedDaysFromInput(3),
            hasFourthPeriodPeak:    parameterInputForm.fourthPeriodPeak.checked,
        },
    };
}

function writePresetParametersToInput(preset) {
    parameterInputForm.parameterPreset.value = preset.key;

    function writeTransitionToInput(inputIndex, transition) {
        parameterInputForm.transitionMethod[inputIndex].value = transition.method;
        parameterInputForm.transitionMin[inputIndex].value = transition.min;
        parameterInputForm.transitionMax[inputIndex].value = transition.max;
    };

    function writeSelectedDaysToInput(inputGroupIndex, days) {
        function dayToOrder(day) {
            return day - selectableDays[0];
        };
        const offset = inputGroupIndex * selectableDays.length;

        for (let i = 0; i < selectableDays.length; i++) {
            parameterInputForm.transitionDay[offset + i].checked = false;
        }
        for (let day of days) {
            parameterInputForm.transitionDay[offset + dayToOrder(day)].checked = true;
        }
    }

    const transitionOrder = [
        preset.wave.risingTransition,
        preset.wave.twoTimesFalling1Transition,
        preset.wave.twoTimesFalling2Transition,
        preset.wave.threeTimesFalling1Transition,
        preset.wave.threeTimesFalling2Transition,
        preset.wave.threeTimesFalling3Transition,
        preset.falling.mon1Transition,
        preset.falling.otherDaysTransition,
        preset.thirdPeriod.mon1Transition,
        preset.thirdPeriod.beforeRisingTransition,
        preset.thirdPeriod.rising1Transition,
        preset.thirdPeriod.rising2Transition,
        preset.thirdPeriod.rising3Transition,
        preset.thirdPeriod.rising4Transition,
        preset.thirdPeriod.rising5Transition,
        preset.thirdPeriod.rising6Transition,
        preset.thirdPeriod.afterRisingTransition,
        preset.fourthPeriod.mon1Transition,
        preset.fourthPeriod.beforeRisingTransition,
        preset.fourthPeriod.rising1Transition,
        preset.fourthPeriod.rising2Transition,
        preset.fourthPeriod.rising3Transition,
        preset.fourthPeriod.rising4Transition,
        preset.fourthPeriod.rising5Transition,
        preset.fourthPeriod.rising6Transition,
        preset.fourthPeriod.afterRisingTransition,
    ];
    for (let i = 0; i < transitionOrder.length; i++) {
        writeTransitionToInput(i, transitionOrder[i]);
    }

    const selectedDaysOrder = [
        preset.wave.twoTimesFallingStartDays,
        preset.wave.threeTimesFallingStartDays,
        preset.thirdPeriod.risingStartDays,
        preset.fourthPeriod.risingStartDays,
    ];
    for (let i = 0; i < selectedDaysOrder.length; i++) {
        writeSelectedDaysToInput(i, selectedDaysOrder[i]);
    }

    parameterInputForm.fourthPeriodPeak.checked = preset.fourthPeriod.hasFourthPeriodPeak;
}

function buildParameterInputTable() {
    buildTransitionMethodInputs();
    buildTransitionAmountInputs();
    buildTransitionDaysInputs()
}

function buildTransitionMethodInputs() {
    const transitionMethods = [
        {
            name: i18next.t('settings_transition_method_price'),
            value: TransitionMethod.PRICE,
        },
        {
            name: i18next.t('settings_transition_method_prev_price_diff'),
            value: TransitionMethod.PREV_PRICE_DIFF,
        },
        {
            name: i18next.t('settings_transition_method_prev_price_ratio'),
            value: TransitionMethod.PREV_PRICE_RATIO,
        },
        {
            name: i18next.t('settings_transition_method_prev_price_ratio_diff'),
            value: TransitionMethod.PREV_PRICE_RATIO_DIFF,
        },
        {
            name: i18next.t('settings_transition_method_purchase_price_ratio'),
            value: TransitionMethod.PURCHASE_PRICE_RATIO,
        },
    ];

    for (let cell of document.getElementsByClassName('transitionMethodCell')) {
        const transitionMethodSelect = document.createElement('select');
        transitionMethodSelect.name = 'transitionMethod';
        cell.appendChild(transitionMethodSelect);

        for (let i = 0; i < transitionMethods.length; i++) {
            const transitionMethodOption = document.createElement('option');
            transitionMethodOption.innerText = transitionMethods[i].name;
            transitionMethodOption.value = transitionMethods[i].value;
            transitionMethodSelect.appendChild(transitionMethodOption);
        }
    }
}

function buildTransitionAmountInputs() {
    const transitionAmountHtml = ''
            + '<input type="number" name="transitionMin" class="transitionAmount">'
            + ' ~ '
            + '<input type="number" name="transitionMax" class="transitionAmount">';

    for (let cell of document.getElementsByClassName('transitionAmountCell')) {
        cell.innerHTML = transitionAmountHtml;
    }
}

function buildTransitionDaysInputs() {
    const days = [
        i18next.t('settings_mon_am'),
        i18next.t('settings_mon_pm'),
        i18next.t('settings_tue_am'),
        i18next.t('settings_tue_pm'),
        i18next.t('settings_wed_am'),
        i18next.t('settings_wed_pm'),
        i18next.t('settings_thu_am'),
        i18next.t('settings_thu_pm'),
        i18next.t('settings_fri_am'),
        i18next.t('settings_fri_pm'),
        i18next.t('settings_sat_am'),
        i18next.t('settings_sat_pm'),
    ];

    let checkBoxOrder = 0;
    for (let cell of document.getElementsByClassName('transitionDaysCell')) {
        for (let day of days) {
            const dayInput = document.createElement('input');
            dayInput.type = 'checkbox';
            dayInput.name = 'transitionDay';
            dayInput.id = 'dayCheckBox' + checkBoxOrder;
            cell.appendChild(dayInput);

            const dayLabel = document.createElement('label');
            dayLabel.className = 'checkBoxLabel';
            dayLabel.innerText = day;
            dayLabel.htmlFor = dayInput.id;
            cell.appendChild(dayLabel);

            checkBoxOrder++;
        }
    }
}

function displayResult(realPrices, result) {
    displayRealPrices(realPrices);

    if (!result) {
        return;
    }

    const tableBody = document.getElementById('predictionTableBody');
    tableBody.innerHTML = '';

    const waveTypeName = i18next.t('result_type_wave');
    const fallingTypeName = i18next.t('result_type_falling');
    const thirdPeriodTypeName = i18next.t('result_type_third_period');
    const fourthPeriodTypeName = i18next.t('result_type_fourth_period');

    let count = 0;
    count += displayWaveResult(waveTypeName, result.wave, tableBody);
    count += displayFallingResult(fallingTypeName, result.falling, tableBody);
    count += displayNthPeriodResult(thirdPeriodTypeName, result.thirdPeriod, tableBody);
    count += displayNthPeriodResult(fourthPeriodTypeName, result.fourthPeriod, tableBody);
    if (!count) {
        displayEmptyResult(tableBody);
    }

    document.getElementById('predictionResult').style.display = 'block';
}

function displayRealPrices(prices) {
    const realPriceCells = document.getElementsByClassName('realPrice');
    for (let i = 0; i < prices.length && i < realPriceCells.length; i++) {
        realPriceCells[i].innerText = (prices[i] ? prices[i] : '-');
    }
}

function displayWaveResult(title, result, tableBody) {
    function transitionTypeToString(type) {
        switch (type) {
            case WavePatternTransitionType.RISING:
                return '↑';
            case WavePatternTransitionType.TWO_TIMES_FALLING:
            case WavePatternTransitionType.THREE_TIMES_FALLING:
                return '↓';
            default:
                return '[' + type + ']';
        }
    };

    let count = 0;
    for (let eachResult of result) {
        const key = eachResult[0];
        const value = eachResult[1];
        if (!value) {
            continue;
        }

        count++;
        const detailedType = [...key]
                .reduce((acc, cur, _) => acc + transitionTypeToString(cur), '');
        displayResultRow(title, detailedType, value, tableBody);
    }
    return count;
}

function displayFallingResult(title, result, tableBody) {
    if (!result) {
        return 0;
    }

    displayResultRow(title, null, result, tableBody);
    return 1;
}

function displayNthPeriodResult(title, result, tableBody) {
    const detailedTypes = [
        i18next.t('result_mutate_mon_am'),
        i18next.t('result_mutate_mon_pm'),
        i18next.t('result_mutate_tue_am'),
        i18next.t('result_mutate_tue_pm'),
        i18next.t('result_mutate_wed_am'),
        i18next.t('result_mutate_wed_pm'),
        i18next.t('result_mutate_thu_am'),
        i18next.t('result_mutate_thu_pm'),
        i18next.t('result_mutate_fri_am'),
        i18next.t('result_mutate_fri_pm'),
        i18next.t('result_mutate_sat_am'),
        i18next.t('result_mutate_sat_pm'),
    ];

    let count = 0;
    for (let i = 0; i < result.length; i++) {
        const eachResult = result[i];
        if (!eachResult) {
            continue;
        }

        count++;
        displayResultRow(title, detailedTypes[i], eachResult, tableBody);
    }
    return count;
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

    let maxPrice = 0;
    let maxPriceCells;
    for (let i = 0; i < result.length; i++) {
        const priceCell = insertedRow.insertCell(-1);
        const min = Math.floor(result[i].min);
        const max = Math.ceil(result[i].max);

        priceCell.innerText = (min == max ? min : min + '~' + max);

        if (maxPrice < max) {
            maxPrice = max;
            maxPriceCells = new Array();
        }
        if (maxPrice == max) {
            maxPriceCells.push(priceCell);
        }
    }
    maxPriceCells.forEach(c => {
        c.className = 'maxPrice';
    });
}

function displayEmptyResult(tableBody) {
    let insertedRow = tableBody.insertRow(-1);

    let cell = document.createElement('td');
    cell.colSpan = 15;
    cell.innerText = i18next.t('result_empty');
    insertedRow.appendChild(cell);
}

async function makeResultImage() {
    const resultElement = document.getElementById('resultTable');
    const titleHeightPx = 80;
    const backgroundColor = '#EDE0BA';

    window.scrollTo(0, 0);  // html2canvas limitation
    const resultCanvas = await html2canvas(resultElement, {
        backgroundColor: backgroundColor,
    });

    const outCanvas = document.createElement('canvas');
    outCanvas.width = resultCanvas.width;
    outCanvas.height = resultCanvas.height + titleHeightPx;
    const ctx = outCanvas.getContext('2d');

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);

    // Title
    ctx.fillStyle = '#42332D';
    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.fillText('moothumb', 10, 60);
    ctx.fillStyle = 'gray';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(window.location.hostname + window.location.pathname, 350, 60);

    // Result
    ctx.drawImage(resultCanvas, 0, titleHeightPx);

    return outCanvas;
}

function saveImage(image) {
    const link = document.createElement('a');
    link.href = image.toDataURL('image/png');
    link.download = 'moothumb_' + Date.now() + '.png';
    link.click();
}

function parseIntWithDefault(string, defaultValue) {
    let value = parseInt(string);
    return value ? value : defaultValue;
}

function isBetween(value, min, max) {
    return value && min <= value && value <= max;
}

window.onBodyLoad = onBodyLoad;
window.onInlineCopyButtonClick = onInlineCopyButtonClick;
window.onInlinePredictionSubmit = onInlinePredictionSubmit;
window.onPredictionSubmit = onPredictionSubmit;
window.onExportImageButtonClick = onExportImageButtonClick;
window.onParameterInputToggleButtonClick = onParameterInputToggleButtonClick;
window.onParameterPresetChange = onParameterPresetChange;
window.onChangeLanguageClick = onChangeLanguageClick;
