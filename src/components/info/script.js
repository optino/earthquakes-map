// -----------------------------------------------------------------------------
//  Info
// -----------------------------------------------------------------------------


import { EarthquakeLoader } from '../../modules/earthquake-loader';

const $ = window.Muilessium;
const _ = window.Muilessium.UTILS;


export default class Info extends $.FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            version: element.querySelector('.version'),
            dates: element.querySelector('.dates'),
            counter: element.querySelector('.counter')
        });

        if (this.domCache.version) {
            this.domCache.version.innerHTML = `v${__PROJECT_VERSION__}`;
        }

        if (this.domCache.dates) {
            const today = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setYear(today.getFullYear() - 1);

            this.domCache.dates.innerHTML = `${EarthquakeLoader.formatDate(oneYearAgo)} ~ ${EarthquakeLoader.formatDate(today)}`;
        }

        this.initEventListeners();
    }


    initEventListeners() {
        $.EVENTS.addEventListener('earthquakes-data-updated', this.onDataUpdated.bind(this));
    }


    onDataUpdated() {
        const data = $.STORE.get('earthquakes-data');
        const featuresLength = data.features.length;

        if (this.domCache.counter) {
            this.domCache.counter.innerHTML = featuresLength;
        }
    }
}

