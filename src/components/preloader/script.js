// -----------------------------------------------------------------------------
//  Preloader
// -----------------------------------------------------------------------------


const $ = window.Muilessium;
const _ = window.Muilessium.UTILS;


export default class Preloader extends $.FACTORY.BaseComponent {
    static numberOfEvents = 4;


    constructor(element, options) {
        super(element, options);


        this.domCache = _.extend(this.domCache, {
            effects: element.querySelector('.effects'),
            counter: element.querySelector('.counter')
        });

        this.state = _.extend(this.state, {
            eventsCounter: 0
        });

        this.initControls();
        this.initEventListeners();
    }


    initControls() {
        return this;
    }


    initEventListeners() {
        $.EVENTS.addEventListener('main-executed', this.onNextEvent.bind(this), true);
        $.EVENTS.addEventListener('images-loaded', this.hideEffectsLayer.bind(this), true);
        $.EVENTS.addEventListener('texture-loaded', this.onNextEvent.bind(this));
        $.EVENTS.addEventListener('earthquakes-data-loaded', this.onNextEvent.bind(this));

        return this;
    }


    onNextEvent() {
        this.state.eventsCounter++;

        this.domCache.counter.innerHTML = `${this.state.eventsCounter} / ${Preloader.numberOfEvents}`;

        if (this.state.eventsCounter === Preloader.numberOfEvents) {
            _.animateElement(this.domCache.element, 'fade-out');
            $.EVENTS.fireEvent('all-resources-loaded');
        }
    }


    hideEffectsLayer() {
        setTimeout(() => {
            _.animateElement(this.domCache.effects, 'fade-out');
        }, 300);
    }
}

