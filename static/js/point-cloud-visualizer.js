import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


const render = (containerId, asset, camera_z = 0.7) => {
    const container = document.getElementById(containerId);
    container.style.position = 'relative';

    let renderer, stats;
    let scene, camera, controls, cube, dirlight, ambientLight;

    function initScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 2;
        controls.maxDistance = 10;

        dirlight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirlight.position.set(0, 0, 1);
        scene.add(dirlight);

        ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        // the loading of the object is asynchronous
        let loader = new OBJLoader();
        loader.load(
            // resource URL
            asset,
            // called when resource is loaded
            function (object) {
                cube = object.children[0];
                cube.material = new THREE.MeshPhongMaterial({ color: 0x999999 });
                cube.position.set(0, 0, 0);
                cube.name = asset;
                scene.add(cube);
            },
            // called when loading is in progress
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened' + error);
            }
        );

        camera.position.z = camera_z;
    }

    function initSTATS() {
        stats = new Stats();
        stats.showPanel(0);
        stats.dom.style.position = 'absolute';
        stats.dom.style.top = 0;
        stats.dom.style.left = 0;
        container.appendChild(stats.dom);
    }

    function animate() {
        requestAnimationFrame(animate);

        cube = scene.getObjectByName(asset);
        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
        stats.update();
    }

    function onWindowResize() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    initScene();
    initSTATS();
    animate();
};

render('pc-container-sheet-1', './static/models/cube.obj', 4);
render('pc-container-sheet-2', './static/models/cube.obj', 4);