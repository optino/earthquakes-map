// -----------------------------------------------------------------------------
//  Earth Renderer
// -----------------------------------------------------------------------------


const $ = window.Muilessium;
const _ = $.UTILS;

const THREE = $.DEPENDENCIES.THREE;


export default class EarthRenderer extends $.FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.scene     = null;
        this.camera    = null;
        this.controls  = null;
        this.renderer  = null;
        this.composer  = null;
        this.raycaster = null;

        this.earth = null;
        this.stars = null;
        this.pointsMeshesCache = null;

        this.state = _.extend(this.state, {
            hoveredPoint: null
        });

        this.init();

        this.domCache.element.appendChild(this.renderer.domElement);
    }


    init() {
        this.initScene();
        this.initLights();
        this.initCamera();
        this.initControls();
        this.initRenderer();
        this.initComposer();
        this.initRaycaster();
        this.initWorld();
        this.initEventListeners();
    }


    initScene() {
        this.scene = new THREE.Scene();
    }


    initLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambient);
    }


    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            2000);
        this.camera.position.x = -75;
        this.camera.position.z = -75;
    }


    initControls() {
        this.controls = new $.MODULES.EarthControls(this.camera);
    }


    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (window.devicePixelRatio > 2) {
            this.renderer.setPixelRatio(2);
        }
    }


    initComposer() {
        this.composer = new $.DEPENDENCIES.EffectComposer(this.renderer);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        const renderPass = new $.DEPENDENCIES.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const effectPass = new $.DEPENDENCIES.EffectPass(
            this.camera,
            new $.DEPENDENCIES.BloomEffect()
        );

        effectPass.renderToScreen = true;

        this.composer.addPass(effectPass);
    }


    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
    }


    initWorld() {
        this.earth = new $.MODULES.sceneObjects.Earth(this.renderer, $.SETTINGS.earth);
        this.stars = new $.MODULES.sceneObjects.Stars(this.renderer, $.SETTINGS.stars);

        this.scene.add(this.earth.mesh);
        this.scene.add(this.stars.mesh);
    }


    initEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.domCache.element.addEventListener('dblclick', this.onDoubleClick.bind(this));

        $.EVENTS.addEventListener('earthquake-points-updated', this.onPointsUpdated.bind(this));

        $.EVENTS.addEventListener('all-resources-loaded', () => {
            this.animate();
            $.EVENTS.fireEvent('animation-started');
        });

        this.onWindowResize();
    }


    onPointsUpdated() {
        const oldPoints = this.scene.getObjectByName('points');

        if (oldPoints) {
            this.scene.remove(oldPoints);
        }

        this.pointsMeshesCache = [];

        const newPoints = new THREE.Group();

        newPoints.name = 'points';
        this.scene.add(newPoints);

        let pointsAdded = 0;

        // If we'll add several thousands of spheres to the scene in one frame,
        // the renderer will render it slowly. So, we add them this way.
        // It'll take some time. But the user will see something like loading
        // animation instead of lag.
        const interval = setInterval(() => {
            for (let i = 0; i < 50; i++) {
                const point = this.earth.points[pointsAdded + i];

                if (point) {
                    newPoints.add(point.mesh);
                    this.pointsMeshesCache.push(point.mesh);
                } else {
                    clearInterval(interval);
                }
            }

            pointsAdded += 50;
        }, 20);
    }


    useRaycaster() {
        if (!this.pointsMeshesCache) {
            return;
        }

        const intersects = this.raycaster.intersectObjects(this.pointsMeshesCache);

        if (intersects[0]) {
            this.domCache.element.style.cursor = 'pointer';

            _.forEach(this.earth.points, (point) => {
                if (point.mesh.uuid === intersects[0].object.uuid) {
                    point.setState($.MODULES.sceneObjects.EarthquakePoint.states.focus);
                    this.state.hoveredPoint = point;
                } else {
                    point.restoreLastSavedState();
                }
            });
        } else {
            this.domCache.element.style.cursor = 'auto';
            this.state.hoveredPoint = null;

            _.forEach(this.earth.points, (point) => {
                point.restoreLastSavedState();
            });
        }
    }


    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }


    onDoubleClick() {
        if (this.state.hoveredPoint) {
            const url = this.state.hoveredPoint.feature.properties.url;

            window.open(url, '_blank');
        }
    }


    animate() {
        if (this.controls.isMouseSlow) {
            this.useRaycaster();
        }

        this.controls.update();
        this.render();

        requestAnimationFrame(this.animate.bind(this));
    }


    render() {
        this.camera.lookAt(this.scene.position);

        this.raycaster.setFromCamera(this.controls.mouse, this.camera);

        this.composer.render(this.scene, this.camera);
    }
}

