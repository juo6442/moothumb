import {
    Days, Transition, TransitionMethod
} from "./predictor.js";

const acwwPreset = {
    key: "acww",
    wave: {
        risingTransition:             new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 80, 140),
        twoTimesFalling1Transition:   new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 80),
        twoTimesFalling2Transition:   new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 80),
        threeTimesFalling1Transition: new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 80),
        threeTimesFalling2Transition: new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 80),
        threeTimesFalling3Transition: new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 80),
        twoTimesFallingStartDays:   [Days.THU2],
        threeTimesFallingStartDays: [Days.MON2],
    },
    falling: {
        mon1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  78, 80),
        otherDaysTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -4, -1),
    },
    thirdPeriod: {
        mon1Transition:         new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  78,  80),
        beforeRisingTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -4,  -1),
        rising1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising2Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 200),
        rising3Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  200, 600),
        rising4Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 200),
        rising5Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising6Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  78,  80),
        afterRisingTransition:  new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -4,  -1),
        risingStartDays: [Days.WED1, Days.WED2, Days.THU1, Days.THU2],
    },
    fourthPeriod: {
        mon1Transition:         new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  78,  80),
        beforeRisingTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -4,  -1),
        rising1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising2Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising3Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 170),
        rising4Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  170, 200),
        rising5Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 170),
        rising6Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  78,  80),
        afterRisingTransition:  new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -4,  -1),
        risingStartDays: [Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2],
        hasFourthPeriodPeak: true,
    },
};
const accfPreset = {
    key: "accf",
    wave: {
        risingTransition:             new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80, 140),
        twoTimesFalling1Transition:   new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  60, 80),
        twoTimesFalling2Transition:   new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -10, -4),
        threeTimesFalling1Transition: new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  60, 80),
        threeTimesFalling2Transition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -10, -4),
        threeTimesFalling3Transition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -10, -4),
        twoTimesFallingStartDays:   [Days.MON1, Days.MON2, Days.TUE1, Days.FRI1, Days.FRI2, Days.SAT1],
        threeTimesFallingStartDays: [Days.MON1, Days.MON2, Days.TUE1, Days.TUE2, Days.FRI1, Days.FRI2],
    },
    falling: {
        mon1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  75, 80),
        otherDaysTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6, -2),
    },
    thirdPeriod: {
        mon1Transition:         new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  75,  80),
        beforeRisingTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6,  -2),
        rising1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising2Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 200),
        rising3Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  200, 600),
        rising4Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 200),
        rising5Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising6Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  75,  80),
        afterRisingTransition:  new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6,  -2),
        risingStartDays: [Days.WED1, Days.WED2, Days.THU1, Days.THU2],
    },
    fourthPeriod: {
        mon1Transition:         new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  75,  80),
        beforeRisingTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6,  -2),
        rising1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising2Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  80,  140),
        rising3Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 200),
        rising4Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 200),
        rising5Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  140, 200),
        rising6Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO,  75,  80),
        afterRisingTransition:  new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6,  -2),
        risingStartDays: [Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2],
        hasFourthPeriodPeak: true,
    },
};
const acnlPreset = {
    key: "acnl",
    wave: {
        risingTransition:             new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 90, 140),
        twoTimesFalling1Transition:   new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 60, 80),
        twoTimesFalling2Transition:   new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -10, -4),
        threeTimesFalling1Transition: new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 60, 80),
        threeTimesFalling2Transition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -10, -4),
        threeTimesFalling3Transition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -10, -4),
        twoTimesFallingStartDays:   [Days.MON1, Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2, Days.FRI1, Days.FRI2, Days.SAT1],
        threeTimesFallingStartDays: [Days.MON1, Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2, Days.FRI1, Days.FRI2],
    },
    falling: {
        mon1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 85, 90),
        otherDaysTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6, -2),
    },
    thirdPeriod: {
        mon1Transition:         new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 85, 90),
        beforeRisingTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6, -2),
        rising1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 90, 140),
        rising2Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 140, 200),
        rising3Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 200, 600),
        rising4Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 140, 200),
        rising5Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 90, 140),
        rising6Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 90),
        afterRisingTransition:  new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 90),
        risingStartDays: [Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2],
    },
    fourthPeriod: {
        mon1Transition:         new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 90),
        beforeRisingTransition: new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6, -2),
        rising1Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 90, 140),
        rising2Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 90, 140),
        rising3Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 140, 190),
        rising4Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 140, 200),
        rising5Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 140, 190),
        rising6Transition:      new Transition(TransitionMethod.PURCHASE_PRICE_RATIO, 40, 90),
        afterRisingTransition:  new Transition(TransitionMethod.PREV_PRICE_RATIO_DIFF, -6, -2),
        risingStartDays: [Days.MON1, Days.MON2, Days.TUE1, Days.TUE2, Days.WED1, Days.WED2, Days.THU1, Days.THU2],
        hasFourthPeriodPeak: true,
    },
};

export default class Presets {
    static getPreset(key) {
        switch (key) {
            case acwwPreset.key:
                return acwwPreset;
            case accfPreset.key:
                return accfPreset;
            case acnlPreset.key:
                return acnlPreset;
        }
        return null;
    };
}
