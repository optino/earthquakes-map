// -----------------------------------------------------------------------------
//  Settings
// -----------------------------------------------------------------------------

const earth = {
    fallbackTexture: {
        url: './images/earth-fallback.jpg',
        width: 2048,
        height: 1024
    },
    texture: {
        urlTemplate: './images/earth-{x}-{y}.jpg',
        partSize: 1024,
        width: 8192,
        height: 4096
    }
};


const stars = {
    fallbackTexture: {
        url: './images/stars-fallback.jpg',
        width: 2048,
        height: 1024
    },
    texture: {
        urlTemplate: './images/stars-{x}-{y}.jpg',
        partSize: 1024,
        width: 8192,
        height: 4096
    }
};


const SETTINGS = {
    earth,
    stars
};

export default SETTINGS;

