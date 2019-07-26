// -----------------------------------------------------------------------------
//  Earthquake Loader
// -----------------------------------------------------------------------------


const $ = window.Muilessium;
const _ = $.UTILS;


class EarthquakeLoader {
    static loadData() {
        let today = new Date();
        let oneYearAgo = new Date();
        oneYearAgo.setYear(today.getFullYear() - 1);

        today = _.formatDateForUSGSAPI(today);
        oneYearAgo = _.formatDateForUSGSAPI(oneYearAgo);

        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${oneYearAgo}&endtime=${today}&minmagnitude=5`;

        _.ajax.get(url, (data) => {
            $.STORE.set('earthquakes-data', JSON.parse(data));
            $.EVENTS.fireEvent('earthquakes-data-loaded');
            $.EVENTS.fireEvent('earthquakes-data-updated');
        });
    }
}


const earthquakeLoader = new EarthquakeLoader();

export default earthquakeLoader;

