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


    static createMesh(positionXYZ, size, color) {
        const sphere = new THREE.SphereGeometry(size * 3 / 100, 12, 12);

        const material = new THREE.MeshBasicMaterial({
            color,
            opacity: 0.95,
            transparent: true
        });

        const mesh = new THREE.Mesh(sphere, material);

        mesh.position.set(...positionXYZ);

        return mesh;
    }


    static chooseColor(magnitude) {
        let result;

        if (magnitude < 6) {
            result = 0xff9800;
        } else if (magnitude < 7) {
            result = 0xff9800;
        } else if (magnitude < 8) {
            result = 0xf44336;
        } else {
            result = 0xf44336;
        } 

        return result;
    }


    static chooseSize(magnitude) {
        let result;

        if (magnitude < 6) {
            result = magnitude;
        } else if (magnitude < 7) {
            result = magnitude * 3;
        } else if (magnitude < 8) {
            result = magnitude * 5;
        } else {
            result = magnitude * 10;
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

        this.init();
    }


    init() {
        const magnitude = this.feature.properties.mag;

        this.mesh = EarthquakePoint.createMesh(
            this.positionXYZ,
            EarthquakePoint.chooseSize(magnitude),
            EarthquakePoint.chooseColor(magnitude)
        );

        if (inLast24Hours(this.feature.properties.time)) {
            this.setState(EarthquakePoint.states.pulse);
            this.lastSavedState = EarthquakePoint.states.pulse;
        }
    }


    setState(state) {
        if (this.state === state) {
            return;
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

