// -----------------------------------------------------------------------------
//  Earthquake Loader
// -----------------------------------------------------------------------------


const $ = window.Muilessium;
const _ = window.Muilessium.UTILS;


export class EarthquakeLoader {
    static formatDate(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    }


    static loadData() {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setYear(today.getFullYear() - 1);

        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${EarthquakeLoader.formatDate(oneYearAgo)}&endtime=${EarthquakeLoader.formatDate(today)}&minmagnitude=5`;

        _.ajax.get(url, (data) => {
            $.STORE.set('earthquakes-data', data);
            $.EVENTS.fireEvent('earthquakes-data-updated');
        });
    }


    constructor() {
        $.EVENTS.addEvent('earthquakes-data-updated');
    }
}


const earthquakeLoader = new EarthquakeLoader();

export default earthquakeLoader;

