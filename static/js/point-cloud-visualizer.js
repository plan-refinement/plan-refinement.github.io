import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';


const render = (containerId, asset, camera_z = 0.7) => {
    const container = document.getElementById(containerId);
    container.style.position = 'relative';

    let renderer, stats, gui;
    let scene, camera, controls, mesh, dirlight, ambientLight;
    let isinitialized = false;

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

        // Load .ply file
        let loader = new PLYLoader();
        loader.load(
            // resource URL
            asset,
            // called when resource is loaded
            function (geometry) {
                // Apply color to vertices
                const material = new THREE.MeshPhongMaterial({ vertexColors: true });
                mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
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

        if (mesh) {
            mesh.rotation.z += 0.01;
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

render('pc-container-sheet-1', './static/models/sheet1.ply', 4);
render('pc-container-sheet-2', './static/models/sheet2.ply', 4);