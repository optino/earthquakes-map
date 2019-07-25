// -----------------------------------------------------------------------------
//  Stars
// -----------------------------------------------------------------------------


import DEPENDENCIES from '../../dependencies';
import SceneObject from './scene-object';

const THREE = DEPENDENCIES.THREE;
const av    = DEPENDENCIES.av;

const $ = window.Muilessium;


export default class Stars extends SceneObject {
    static createMesh(textureURL, textureFallbackURL) {
        const group = new THREE.Group();

        const emptySphere = new THREE.SphereGeometry(498, 12, 12);
        const fallbackSphere = new THREE.SphereGeometry(499, 12, 12);
        const sphere = new THREE.SphereGeometry(500, 12, 12);

        emptySphere.scale(-1, 1, 1);
        fallbackSphere.scale(-1, 1, 1);
        sphere.scale(-1, 1, 1);

        const emptyMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
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
            Stars.loaders.imageLoader.load(textureFallbackURL, (fallbackImage) => {
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
                    Stars.loaders.imageLoader.load(textureURL, (image) => {
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


    constructor(textureURL, textureFallbackURL) {
        super();

        this.mesh = Stars.createMesh(textureURL, textureFallbackURL);
    }
}

