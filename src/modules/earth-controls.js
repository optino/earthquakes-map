// -----------------------------------------------------------------------------
//  Earth Controls
// -----------------------------------------------------------------------------


import DEPENDENCIES from '../dependencies';

const THREE = DEPENDENCIES.THREE;


export default class EarthControls {
    constructor(camera) {
        this.mouse = new THREE.Vector2();

        this.orbitControls = new DEPENDENCIES.OrbitControls(camera);

        this.orbitControls.minPolarAngle = Math.PI * 1 / 4;
        this.orbitControls.maxPolarAngle = Math.PI * 3 / 4;
        this.orbitControls.autoRotate = true;
        this.orbitControls.rotateSpeed = 0.1;
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.3;
        this.orbitControls.autoRotateSpeed = -0.5;
        this.orbitControls.minDistance = 60;
        this.orbitControls.maxDistance = 120;
        this.orbitControls.enableKeys = false;

        if (__DEBUG__) {
            this.orbitControls.minDistance = 1;
            this.orbitControls.maxDistance = 1000;
        }

        this.isUserAFK = false;
        this.AFKTimer = null;
        this.mouseSpeed = 0;
        this.isMouseSlow = false;
        this.oldMousePosition = { x: 0, y: 0 }; 

        this.orbitControls.update();

        this.initEventListeners();
    }


    initEventListeners() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }


    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.isUserAFK = false;
        this.isMouseStatic = false;

        if (this.AFKTimer) {
            clearTimeout(this.AFKTimer);
        }

        this.AFKTimer = setTimeout(() => {
            this.isUserAFK = true;
        }, 10000);

        const deltaX = event.pageX - this.oldMousePosition.x;
        const deltaY = event.pageY - this.oldMousePosition.y;
        const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

        this.mouseSpeed = distance;

        this.isMouseSlow = (distance < window.innerWidth / 50);

        this.oldMousePosition = {
            x: event.pageX,
            y: event.pageY
        };
    }


    update() {
        const distanceToTheCenter = this.orbitControls.target.distanceTo(
            this.orbitControls.object.position);

        this.orbitControls.rotateSpeed = 0.0007 * distanceToTheCenter;

        if (this.isUserAFK) {
            this.orbitControls.autoRotate = true;
        } else {
            this.orbitControls.autoRotate = false;
        }

        this.orbitControls.update();
    }
}

