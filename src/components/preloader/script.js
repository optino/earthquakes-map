// -----------------------------------------------------------------------------
//  Preloader
// -----------------------------------------------------------------------------


const $ = window.Muilessium;
const _ = $.UTILS;


export default class Preloader extends $.FACTORY.BaseComponent {
    // It'll be only one instance of preloader,
    // so we can use hardcoded number of events here.
    static numberOfEvents = 2;


    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            effects: element.querySelector('.effects'),
            counter: element.querySelector('.counter')
        });

        this.state = _.extend(this.state, {
            eventsCounter: 0
        });

        this.initEventListeners();
    }


    initEventListeners() {
        $.EVENTS.addEventListener('main-executed', this.onNextEvent.bind(this), true);
        $.EVENTS.addEventListener('images-loaded', this.hideEffectsLayer.bind(this), true);
        $.EVENTS.addEventListener('earthquakes-data-loaded', this.onNextEvent.bind(this));
        $.EVENTS.addEventListener('animation-started', this.hidePreloader.bind(this));

        return this;
    }


    onNextEvent() {
        this.state.eventsCounter++;

        this.domCache.counter.innerHTML = `${this.state.eventsCounter} / ${Preloader.numberOfEvents}`;

        if (this.state.eventsCounter === Preloader.numberOfEvents) {
            $.EVENTS.fireEvent('all-resources-loaded');
        }
    }


    hideEffectsLayer() {
        setTimeout(() => {
            _.animateElement(this.domCache.effects, 'fade-out');
        }, 300);
    }


    hidePreloader() {
        setTimeout(() => {
            _.animateElement(this.domCache.element, 'fade-out');
        }, 100);
    }
}

