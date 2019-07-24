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
    }
}

