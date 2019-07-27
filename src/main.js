// -----------------------------------------------------------------------------
//  MAIN
// -----------------------------------------------------------------------------


import DEPENDENCIES from './dependencies';
import POLYFILLS    from './polyfills';
import UTILS        from './utils';

const GLOBAL_PREFIX = 'ui-';


document.addEventListener('DOMContentLoaded', () => {
    if (!window.Muilessium) {
        console.log('Muilessium is not defined. Include muilessium.min.js before this.');
    }

    const $ = window.Muilessium;
    const _ = $.UTILS;

    // See /docs/events.svg for more information about events.
    $.EVENTS.addEvent('main-executed');
    $.EVENTS.addEvent('earthquakes-data-loaded');
    $.EVENTS.addEvent('all-resources-loaded');
    $.EVENTS.addEvent('earthquakes-data-updated');
    $.EVENTS.addEvent('earthquake-points-updated');
    $.EVENTS.addEvent('animation-started');

    window.Muilessium.DEPENDENCIES = _.extend($.DEPENDENCIES, DEPENDENCIES);
    window.Muilessium.POLYFILLS    = _.extend($.POLYFILLS,    POLYFILLS);
    window.Muilessium.UTILS        = _.extend($.UTILS,        UTILS);

    // The order is important!
    // We shouldn't import modules and components before dependencies, polyfills and utilities.
    window.Muilessium.SETTINGS = require('./settings').default;
    window.Muilessium.MODULES  = require('./modules').default;

    const components = require('./components/index').default;

    _.forEach(Object.keys(components), (type) => {
        $.FACTORY.registerComponent(type, components[type]);
        $.FACTORY.create(type, `.${GLOBAL_PREFIX}${_.toLispCase(type)}`, {});
    });

    $.EVENTS.fireEvent('main-executed');

    $.EVENTS.addEventListener('animation-started', () => {
        console.log(`Earthquakes map ${__PROJECT_VERSION__}`);
        console.log(`DEBUG: ${__DEBUG__}`);

        // We print this information after the start of the animation
        // because all components will be initialized and we'll see their states.
        console.log($);
    }, true);
});

