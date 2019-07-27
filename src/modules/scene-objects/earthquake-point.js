// -----------------------------------------------------------------------------
//  Earthquake Point
// -----------------------------------------------------------------------------


import SceneObject from './scene-object';

const $ = window.Muilessium;
const _ = $.UTILS;

const THREE = $.DEPENDENCIES.THREE;


export default class EarthquakePoint extends SceneObject {
    static states = Object.freeze({
        default: 0,
        pulse:   1,
        focus:   2
    });


    static colors = Object.freeze({
        orange: 0xff9800,
        red: 0xf44336,
        green: 0x4caf50,
        violet: 0x673ab7
    });


    static materialsCache = Object.freeze({
        orange: new THREE.MeshBasicMaterial({
            color: EarthquakePoint.colors.orange,
        }),
        red: new THREE.MeshBasicMaterial({
            color: EarthquakePoint.colors.red,
        })
    });


    static spheresCache = Object.freeze({
        small:  new THREE.SphereBufferGeometry(0.15, 8, 8),
        medium: new THREE.SphereBufferGeometry(0.45, 12, 12),
        big:    new THREE.SphereBufferGeometry(0.9,  12, 12),
        extra:  new THREE.SphereBufferGeometry(1.8,  12, 12)
    });


    static alternativeGeometriesCache = Object.freeze({
        small:  new THREE.CylinderBufferGeometry(0.15 * 2, 0.15 / 10, 6, 12),
        medium: new THREE.CylinderBufferGeometry(0.45 * 2, 0.45 / 10, 12, 12),
        big:    new THREE.CylinderBufferGeometry(0.9  * 2,  0.9 / 10, 24, 12),
        extra:  new THREE.CylinderBufferGeometry(1.8  * 2,  1.8 / 10, 36, 12)
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


    static chooseAlternativeGeometry(magnitude) {
        let result;

        if (magnitude < 6) {
            result = EarthquakePoint.alternativeGeometriesCache.small;
        } else if (magnitude < 7) {
            result = EarthquakePoint.alternativeGeometriesCache.medium;
        } else if (magnitude < 8) {
            result = EarthquakePoint.alternativeGeometriesCache.big;
        } else {
            result = EarthquakePoint.alternativeGeometriesCache.extra;
        }

        return result;
    }


    constructor(feature, position, angles) {
        super();

        this.feature = feature;
        this.positionXYZ = position;
        this.angles = angles;
        this.state = EarthquakePoint.states.default;
        this.lastSavedState = this.state;
        this.mesh = null;
        this.stateEffectTimer = null;
        this.hasClonedMaterial = false;

        this.init();
    }


    init() {
        const magnitude = this.feature.properties.mag;

        if (_.inLast24Hours(this.feature.properties.time)) {
            this.mesh = new THREE.Mesh(
                EarthquakePoint.chooseAlternativeGeometry(magnitude),
                EarthquakePoint.chooseMaterial(magnitude)
            );

            this.mesh.rotation.z = this.angles.phi;
            this.mesh.rotation.y = this.angles.theta;

            this.cloneMaterial();
            this.setState(EarthquakePoint.states.pulse);
            this.lastSavedState = EarthquakePoint.states.pulse;
        } else if (_.inLast30Days(this.feature.properties.time)) {
            this.mesh = new THREE.Mesh(
                EarthquakePoint.chooseAlternativeGeometry(magnitude),
                EarthquakePoint.chooseMaterial(magnitude)
            );

            this.mesh.rotation.z = this.angles.phi;
            this.mesh.rotation.y = this.angles.theta;
        } else {
            this.mesh = new THREE.Mesh(
                EarthquakePoint.chooseSphere(magnitude),
                EarthquakePoint.chooseMaterial(magnitude)
            );
        }

        this.mesh.position.set(...(this.positionXYZ));
    }


    cloneMaterial() {
        this.mesh.material = this.mesh.material.clone();
        this.hasClonedMaterial = true;
    }


    setState(state) {
        if (this.state === state) {
            return;
        }

        if (!this.hasClonedMaterial) {
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

                let isHighlighted = false;

                this.stateEffectTimer = setInterval(() => {
                    isHighlighted = !isHighlighted;

                    if (isHighlighted) {
                        this.mesh.material.color = new THREE.Color(EarthquakePoint.colors.green);
                    } else {
                        this.mesh.material.color = new THREE.Color(EarthquakePoint.colors.violet);
                    }
                }, 500);

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

