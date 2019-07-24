// -----------------------------------------------------------------------------
// DEPENDENCIES
// -----------------------------------------------------------------------------


const THREE          = require('three');
const OrbitControls  = require('three/examples/jsm/controls/OrbitControls.js').OrbitControls;
const EffectComposer = require('postprocessing').EffectComposer;
const RenderPass     = require('postprocessing').RenderPass;
const EffectPass     = require('postprocessing').EffectPass;
const BloomEffect    = require('postprocessing').BloomEffect;


const DEPENDENCIES = {
    THREE,
    OrbitControls,
    EffectComposer,
    RenderPass,
    EffectPass,
    BloomEffect
};

export default DEPENDENCIES;

