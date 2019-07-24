// -----------------------------------------------------------------------------
//  Loaders
// -----------------------------------------------------------------------------


import DEPENDENCIES from '../dependencies';
import earthquakeLoader from './earthquake-loader';

const THREE = DEPENDENCIES.THREE;

const $ = window.Muilessium;


class Loaders {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.imageLoader = new THREE.ImageLoader(this.loadingManager);
        this.earthquakeLoader = earthquakeLoader;
    }
}


const loaders = new Loaders();

export default loaders;

