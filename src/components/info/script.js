// -----------------------------------------------------------------------------
//  Info
// -----------------------------------------------------------------------------


const $ = window.Muilessium;
const _ = $.UTILS;


export default class Info extends $.FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            version: element.querySelector('.version'),
            dates:   element.querySelector('.dates'),
            counter: element.querySelector('.counter')
        });

        if (this.domCache.version) {
            this.domCache.version.innerHTML = `v${__PROJECT_VERSION__}`;
        }

        if (this.domCache.dates) {
            let today = new Date();
            let oneYearAgo = new Date();

            oneYearAgo.setYear(today.getFullYear() - 1);

            today = _.formatDateForUSGSAPI(today);
            oneYearAgo = _.formatDateForUSGSAPI(oneYearAgo);

            this.domCache.dates.innerHTML = `${oneYearAgo} ~ ${today}`;
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

