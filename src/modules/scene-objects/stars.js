// -----------------------------------------------------------------------------
//  Stars
// -----------------------------------------------------------------------------


import DEPENDENCIES from '../../dependencies';
import SceneObject from './scene-object';

const THREE = DEPENDENCIES.THREE;

const $ = window.Muilessium;


export default class Stars extends SceneObject {
    static createMesh(textureURL) {
        const sphere = new THREE.SphereGeometry(500, 64, 64);

        sphere.scale(-1, 1, 1);

        const texture = new THREE.Texture();

        const material = new THREE.MeshBasicMaterial({
            map: texture
        });

        Stars.loaders.imageLoader.load(textureURL, (image) => {
            texture.image = image;
            texture.needsUpdate = true;

            $.EVENTS.fireEvent('texture-loaded');
        });

        return new THREE.Mesh(sphere, material);
    }


    constructor(textureURL) {
        super();

        this.mesh = Stars.createMesh(textureURL);
    }
}

