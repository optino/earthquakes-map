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
const av    = DEPENDENCIES.av;


export default class Earth extends SceneObject {
    static radius = 30;


    static createMesh(textureURL, textureFallbackURL) {
        const group = new THREE.Group();

        const emptySphere = new THREE.SphereGeometry(Earth.radius + 0.02, 64, 64);
        const fallbackSphere = new THREE.SphereGeometry(Earth.radius + 0.01, 64, 64);
        const sphere = new THREE.SphereGeometry(Earth.radius, 64, 64);

        const emptyMaterial = new THREE.MeshBasicMaterial({
            color: 0x0d47a1,
            opacity: 1,
            transparent: true
        });

        const fallbackMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.Texture(),
            opacity: 1
        });

        const material = new THREE.MeshBasicMaterial({
            map: new THREE.Texture()
        });

        $.EVENTS.addEventListener('animation-started', () => {
            Earth.loaders.imageLoader.load(textureFallbackURL, (fallbackImage) => {
                fallbackMaterial.map.image = fallbackImage;
                fallbackMaterial.map.needsUpdate = true;

                av({
                    from: 1,
                    to: 0,
                    duration: 3000,
                    change: (value) => {
                        emptyMaterial.opacity = value;
                    }
                });

                $.EVENTS.addEventListener('all-points-rendered', () => {
                    Earth.loaders.imageLoader.load(textureURL, (image) => {
                        material.map.image = image;
                        material.map.needsUpdate = true;
                        fallbackMaterial.transparent = true;

                        av({
                            from: 1,
                            to: 0,
                            duration: 3000,
                            delay: 1000,
                            change: (value) => {
                                fallbackMaterial.opacity = value;
                            }
                        });
                    });
                }, true);
            });
        }, true);

        group.add(new THREE.Mesh(emptySphere, emptyMaterial));
        group.add(new THREE.Mesh(fallbackSphere, fallbackMaterial));
        group.add(new THREE.Mesh(sphere, material));

        return group;
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
        const data = $.STORE.get('earthquakes-data');
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

