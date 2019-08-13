// -----------------------------------------------------------------------------
//  Earth
// -----------------------------------------------------------------------------


import SceneObject from './scene-object';
import EarthquakePoint from './earthquake-point';
import UpdatableTexture from '../updatable-texture';

const $ = window.Muilessium;
const _ = $.UTILS;

const THREE = $.DEPENDENCIES.THREE;
const av    = $.DEPENDENCIES.av;


export default class Earth extends SceneObject {
    static radius = 30;


    static createMesh(renderer, settings) {
        const group = new THREE.Group();

        const emptySphere    = new THREE.SphereBufferGeometry(Earth.radius - 0.02, 64, 64);
        const fallbackSphere = new THREE.SphereBufferGeometry(Earth.radius - 0.01, 64, 64);

        // The Google Chrome doesn't support big textures now. So we need to split
        // the big texture of size 8192x4096 into two the textures of size 4096x4096.
        // This is a bad solution, but it works in this case.
        const spherePart1 = new THREE.SphereBufferGeometry(Earth.radius, 64, 64, 0, Math.PI);
        const spherePart2 = new THREE.SphereBufferGeometry(Earth.radius, 64, 64, 0, Math.PI);

        const emptyMaterial = new THREE.MeshBasicMaterial({
            color: 0x0d47a1,
        });

        const fallbackMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.Texture(),
            transparent: true,
            opacity: 0
        });

        const materialPart1 = new THREE.MeshBasicMaterial({
            map: new UpdatableTexture(),
            transparent: true,
            opacity: 0
        });

        const materialPart2 = new THREE.MeshBasicMaterial({
            map: new UpdatableTexture(),
            transparent: true,
            opacity: 0
        });

        $.EVENTS.addEventListener('animation-started', () => {
            Earth.loaders.imageLoader.load(settings.fallbackTexture.url, (fallbackImage) => {
                fallbackMaterial.map.image = fallbackImage;
                fallbackMaterial.map.needsUpdate = true;

                av({
                    from: 0,
                    to: 1,
                    duration: 2000,
                    change: (value) => {
                        fallbackMaterial.opacity = value;
                    },
                    done: () => {
                        const texture = settings.texture;

                        av({
                            from: 0,
                            to: 1,
                            duration: 7000,
                            change: (value) => {
                                materialPart1.opacity = value;
                                materialPart2.opacity = value;
                            }
                        });

                        materialPart1.map.setRenderer(renderer);
                        materialPart1.map.setSize(texture.width, texture.height);
                        materialPart2.map.setRenderer(renderer);
                        materialPart2.map.setSize(texture.width, texture.height);

                        const partsX = texture.width / texture.partSize;
                        const partsY = texture.height / texture.partSize;

                        for (let x = 0; x < partsX * 2; x++) {
                            for (let y = 0; y < partsY; y++) {
                                const url = texture.urlTemplate.replace('{x}', x).replace('{y}', y);

                                Earth.loaders.imageLoader.load(url, (partImage) => {
                                    // The full texture is really big and Three.js
                                    // can allocate a lot of memory for it. If we'll update it
                                    // as the ordinary texture, it will cause a freeze effect
                                    // for a couple of seconds. So we update it this way.
                                    // The memory will not be allocated in the one moment
                                    // and the user will be able to see some FPS reduction,
                                    // but without hardcore lags.
                                    setTimeout(() => {
                                        if (x < partsX) {
                                            materialPart1.map.update(
                                                partImage,
                                                x * texture.partSize,
                                                y * texture.partSize
                                            );
                                        } else {
                                            materialPart2.map.update(
                                                partImage,
                                                (x - partsX) * texture.partSize,
                                                y * texture.partSize
                                            );
                                        }
                                    }, 5000 * Math.random());
                                });
                            }
                        }
                    }
                });
            });
        }, true);

        group.add(new THREE.Mesh(emptySphere, emptyMaterial));
        group.add(new THREE.Mesh(fallbackSphere, fallbackMaterial));
        group.add(new THREE.Mesh(spherePart1, materialPart1));

        const part2 = new THREE.Mesh(spherePart2, materialPart2);

        part2.rotation.y = Math.PI;
        group.add(part2);

        return group;
    }


    static calcPointAngles(coordinates) {
        const phi = (90 - coordinates[1]) * Math.PI / 180;
        const theta = (coordinates[0] + 180) * Math.PI / 180;

        return {
            phi,
            theta
        };
    }


    static calcPositionXYZ(angles) {
        const phi = angles.phi;
        const theta = angles.theta;

        const x = -Earth.radius * Math.sin(phi) * Math.cos(theta);
        const z =  Earth.radius * Math.sin(phi) * Math.sin(theta);
        const y =  Earth.radius * Math.cos(phi);

        return [x, y, z];
    }


    constructor(renderer, settings) {
        super();

        this.mesh = Earth.createMesh(renderer, settings);
        this.points = [];

        this.initEventListeners();

        Earth.loaders.earthquakeLoader.constructor.loadData();
    }


    initEventListeners() {
        $.EVENTS.addEventListener('earthquakes-data-updated', this.onDataUpdated.bind(this));
    }


    onDataUpdated() {
        const data = $.STORE.get('earthquakes-data');
        const features = data.features;

        if (features) {
            _.forEach(features, (feature) => {
                const angles = Earth.calcPointAngles(feature.geometry.coordinates);
                const position = Earth.calcPositionXYZ(angles);

                const point = new EarthquakePoint(feature, position, angles);

                this.points.push(point);
            });
        }

        $.EVENTS.fireEvent('earthquake-points-updated');
    }
}

