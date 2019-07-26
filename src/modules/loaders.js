// -----------------------------------------------------------------------------
//  Loaders
// -----------------------------------------------------------------------------


import earthquakeLoader from './earthquake-loader';

const $ = window.Muilessium;
const THREE = $.DEPENDENCIES.THREE;


class Loaders {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.imageLoader = new THREE.ImageLoader(this.loadingManager);
        this.earthquakeLoader = earthquakeLoader;
    }
}


const loaders = new Loaders();

export default loaders;

