// -----------------------------------------------------------------------------
//  Earthquake Point
// -----------------------------------------------------------------------------


import DEPENDENCIES from '../../dependencies';
import SceneObject from './scene-object';

import { inLast24Hours } from '../../utils/dates';

const THREE = DEPENDENCIES.THREE;


export default class EarthquakePoint extends SceneObject {
    static states = Object.freeze({
        default: 0,
        pulse:   1,
        focus:   2
    });


    static colors = Object.freeze({
        orange: 0xff9800,
        red: 0xf44336
    });


    static materialsCache = Object.freeze({
        orange: new THREE.MeshBasicMaterial({
            color: EarthquakePoint.colors.orange,
            opacity: 0.95,
            transparent: true
        }),
        red: new THREE.MeshBasicMaterial({
            color: EarthquakePoint.colors.red,
            opacity: 0.95,
            transparent: true
        })
    });


    static spheresCache = Object.freeze({
        small:  new THREE.SphereGeometry(0.15, 12, 12),
        medium: new THREE.SphereGeometry(0.45, 12, 12),
        big:    new THREE.SphereGeometry(0.9, 12, 12),
        extra:  new THREE.SphereGeometry(1.8, 12, 12)
    });


    static chooseMaterial(magnitude) {
        let result;

        if (magnitude < 7) {
            result = EarthquakePoint.materialsCache.orange;
        } else {
            result = EarthquakePoint.materialsCache.red;
        } 

        return result;
    }


    static chooseColor(magnitude) {
        let result;

        if (magnitude < 7) {
            result = EarthquakePoint.colors.orange;
        } else {
            result = EarthquakePoint.colors.red;
        } 

        return result;
    }


    static chooseSphere(magnitude) {
        let result;

        if (magnitude < 6) {
            result = EarthquakePoint.spheresCache.small;
        } else if (magnitude < 7) {
            result = EarthquakePoint.spheresCache.medium;
        } else if (magnitude < 8) {
            result = EarthquakePoint.spheresCache.big;
        } else {
            result = EarthquakePoint.spheresCache.extra;
        }

        return result;
    }


    constructor(feature, position) {
        super();

        this.feature = feature;
        this.positionXYZ = position;
        this.state = EarthquakePoint.states.default;
        this.lastSavedState = this.state;
        this.mesh = null;
        this.stateEffectTimer = null;
        this.hasClonedMaterial = false;

        this.init();
    }


    init() {
        const magnitude = this.feature.properties.mag;

        this.mesh = new THREE.Mesh(
            EarthquakePoint.chooseSphere(magnitude),
            EarthquakePoint.chooseMaterial(magnitude)
        );

        this.mesh.position.set(...(this.positionXYZ));

        if (inLast24Hours(this.feature.properties.time)) {
            this.cloneMaterial();
            this.setState(EarthquakePoint.states.pulse);
            this.lastSavedState = EarthquakePoint.states.pulse;
        }
    }


    cloneMaterial() {
        this.mesh.material = this.mesh.material.clone();
        this.hasClonedMaterial = true;
    }


    setState(state) {
        if (this.state === state) {
            return;
        }

        if (!this.hasCloneMaterial) {
            this.cloneMaterial();
        }

        if (this.state !== EarthquakePoint.states.focus) {
            this.lastSavedState = this.state;
        }

        switch (state) {
            case EarthquakePoint.states.default: {
                this.state = state;
                clearInterval(this.stateEffectTimer);

                this.mesh.material.color = new THREE.Color(
                    EarthquakePoint.chooseColor(this.feature.properties.mag));

                break;
            }

            case EarthquakePoint.states.pulse: {
                this.state = state;
                this.stateEffectTimer = setInterval(() => {
                    this.mesh.material.color = new THREE.Color(`hsl(0, 100%, ${Math.floor((Math.sin(Date.now() / 100) + 1) * 50)}%)`);
                }, 20);

                break;
            }

            case EarthquakePoint.states.focus: {
                this.state = state;
                clearInterval(this.stateEffectTimer);

                this.mesh.material.color = new THREE.Color('hsl(0, 100%, 100%)');

                break;
            }

            default: {
                break;
            }
        }
    }


    restoreLastSavedState() {
        this.setState(this.lastSavedState);
    }
}

