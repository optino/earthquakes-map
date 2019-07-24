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

    $.EVENTS.addEvent('main-executed');

    window.Muilessium.DEPENDENCIES = _.extend($.DEPENDENCIES, DEPENDENCIES);
    window.Muilessium.POLYFILLS    = _.extend($.POLYFILLS,    POLYFILLS);
    window.Muilessium.UTILS        = _.extend($.UTILS,        UTILS);

    window.Muilessium.MODULES = require('./modules').default;

    function addComponents() {
        const components = require('./components/index').default;

        _.forEach(Object.keys(components), (type) => {
            $.FACTORY.registerComponent(type, components[type]);
            $.FACTORY.create(type, `.${GLOBAL_PREFIX}${_.toLispCase(type)}`, {});
        });
    }

    addComponents();

    $.EVENTS.fireEvent('main-executed');
});

