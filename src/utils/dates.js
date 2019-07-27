// -----------------------------------------------------------------------------
//  Dates
// -----------------------------------------------------------------------------


export function inLast24Hours(date) {
    const hour = 1000 * 60 * 60;
    const oneDayAgo = Date.now() - hour * 24;

    return date > oneDayAgo;
}


export function inLast30Days(date) {
    const hour = 1000 * 60 * 60;
    const oneDayAgo = Date.now() - hour * 24 * 30;

    return date > oneDayAgo;
}



// We use this API - https://earthquake.usgs.gov/fdsnws/event/1/
export function formatDateForUSGSAPI(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
}

