// -----------------------------------------------------------------------------
//  Earth
// -----------------------------------------------------------------------------


import DEPENDENCIES from '../../dependencies';
import SceneObject from './scene-object';
import EarthquakePoint from './earthquake-point';
import { EarthquakeLoader } from '../earthquake-loader';

const $ = window.Muilessium;
const _ = window.Muilessium.UTILS;

const THREE = DEPENDENCIES.THREE;


export default class Earth extends SceneObject {
    static radius = 30;


    static createMesh(textureURL, textureFallbackURL) {
        const sphere = new THREE.SphereGeometry(Earth.radius, 64, 64);

        const texture = new THREE.Texture();

        const material = new THREE.MeshBasicMaterial({
            map: texture
        });

        Earth.loaders.imageLoader.load(textureFallbackURL, (fallbackImage) => {
            texture.image = fallbackImage;
            texture.needsUpdate = true;

            $.EVENTS.fireEvent('texture-loaded');

            $.EVENTS.addEventListener('animation-started', () => {
                Earth.loaders.imageLoader.load(textureURL, (image) => {
                    texture.image = image;
                    texture.needsUpdate = true;

                    // $.EVENTS.fireEvent('texture-loaded');
                });
            });
        });

        return new THREE.Mesh(sphere, material);
    }


    static calcPositionXYZ(coordinates) {
        const phi = (90 - coordinates[1]) * Math.PI / 180;
        const theta = (coordinates[0] + 180) * Math.PI / 180;

        const x = -Earth.radius * Math.sin(phi) * Math.cos(theta);
        const z =  Earth.radius * Math.sin(phi) * Math.sin(theta);
        const y =  Earth.radius * Math.cos(phi);

        return [x, y, z];
    }


    constructor(textureURL, textureFallbackURL) {
        super();

        this.mesh = Earth.createMesh(textureURL, textureFallbackURL);
        this.points = [];

        this.initEventListeners();

        EarthquakeLoader.loadData();
    }


    initEventListeners() {
        $.EVENTS.addEventListener('earthquakes-data-updated', this.onDataUpdated.bind(this));
    }


    onDataUpdated() {
        const data = JSON.parse($.STORE.get('earthquakes-data'));
        const features = data.features;

        if (features) {
            _.forEach(features, (feature) => {
                const position = Earth.calcPositionXYZ(feature.geometry.coordinates);

                const point = new EarthquakePoint(feature, position);

                this.points.push(point);
            });
        }

        $.EVENTS.fireEvent('earthquake-points-updated');
    }
}

