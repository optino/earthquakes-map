// -----------------------------------------------------------------------------
//  MODULES
// -----------------------------------------------------------------------------


import EarthControls    from './modules/earth-controls';
import EarthquakeLoader from './modules/earthquake-loader';
import Loaders          from './modules/loaders';

import SceneObject     from './modules/scene-objects/scene-object';
import Earth           from './modules/scene-objects/earth';
import EarthquakePoint from './modules/scene-objects/earthquake-point';
import Stars           from './modules/scene-objects/stars';


const MODULES = {
    EarthControls,
    EarthquakeLoader,
    Loaders,

    sceneObjects: {
        SceneObject,
        Earth,
        EarthquakePoint,
        Stars
    }
};

export default MODULES;

