import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
    const [file, setFile] = useState<File | null>(null);
    const [scene, setScene] = useState<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    useEffect(() => {
        if (scene && rendererRef.current && cameraRef.current) {
            const animate = () => {
                requestAnimationFrame(animate);
                if (cameraRef.current && controlsRef.current) {
                    controlsRef.current.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
                }
                rendererRef.current.render(scene, cameraRef.current);
            };

            animate();
        }
    }, [scene]);

    useEffect(() => {
        const handleResize = () => {
            if (cameraRef.current && rendererRef.current) {
                const { clientWidth, clientHeight } = canvasRef.current || { clientWidth: 0, clientHeight: 0 };
                cameraRef.current.aspect = clientWidth / clientHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(clientWidth, clientHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        setFile(selectedFile);
    };

    const handleDisplay = () => {
        if (!file) {
            console.error('No file selected');
            return;
        }

        console.log('Displaying file...');
        displayStl(file);
    };

    const displayStl = (file: File) => {
        if (!canvasRef.current) return;

        const loader = new STLLoader();
        loader.load(
            URL.createObjectURL(file),
            (geometry: THREE.BufferGeometry) => {
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const mesh = new THREE.Mesh(geometry, material);

                if (!scene) {
                    const newScene = new THREE.Scene();
                    setScene(newScene);

                    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
                    camera.position.z = 5;
                    cameraRef.current = camera;

                    const light = new THREE.PointLight(0xffffff, 1, 100);
                    light.position.set(0, 0, 5);

                    newScene.add(mesh);
                    newScene.add(camera);
                    newScene.add(light);

                    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    rendererRef.current = renderer;

                    const controls = new OrbitControls(camera, renderer.domElement);
                    controlsRef.current = controls;
                } else {
                    scene.add(mesh);
                }

                console.log('STL Loaded Successfully:', file.name);
            },
            undefined,
            (error: any) => {
                console.error('Error loading STL:', error);
            }
        );
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleDisplay}>Display STL</button>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

export default App;
