// React imports
import { useRef, useContext, createContext } from 'react';

// App imports
import { getMercatorMatrix, getEcefMatrix } from 'utils';

// Context imports
import { useGeo } from 'context/geo';

// Third-party imports
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const AntennaLayerContext: React.Context<any> = createContext(null)

export const useAntennaLayer = () => useContext(AntennaLayerContext);

export const AntennaLayerProvider = ({ children }: any) => {
  const { mapRef } = useGeo();
  
  const globeSceneRef = useRef(new THREE.Scene());
  const sceneRef = useRef(new THREE.Scene());

  const cameraRef = useRef(new THREE.Camera());
  const rendererRef = useRef<any>(null);

  const draggableObjects: any[] = [];

  const modelOrigin = { lng: 148.9819, lat: -35.39847 };
  const modelAltitude = 0;

  const antennaLayer = {
    id: 'antenna-layer',
    type: 'custom',
    renderingMode: '3d',

    onAdd(map: any, gl: any) {
      const renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true
      })

      renderer.autoClear = false;
      rendererRef.current = renderer;

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
      sceneRef.current.add(hemiLight);

      const loader = new GLTFLoader();
      let gltfModel: any = null;
      
      loader.load('https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf', (gltf) => {
        gltfModel = gltf.scene;
        gltfModel.name = 'gltfModel';
        gltfModel.matrixAutoUpdate = false;
        gltfModel.frustumCulled = false;
        gltfModel.userData.lngLat = [ modelOrigin.lng, modelOrigin.lat ];
        gltfModel.rotation.x = Math.PI / 2;
        sceneRef.current.add(gltfModel);
      });
    },

    render(gl: any, matrix: any, projection: any, globeToMercMatrix: any, transition: number) {
      const scene = sceneRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      const map = mapRef?.current?.getMap();

      if (!map) return;

      const isGlobe = projection?.name === 'globe';

      const gltfModel = scene.getObjectByName('gltfModel');

      if (gltfModel) {
        const modelMatrix = isGlobe
          ? getEcefMatrix(modelOrigin, modelAltitude)
          : getMercatorMatrix(modelOrigin, modelAltitude);

        gltfModel.matrix = modelMatrix;
      }

      const m = new THREE.Matrix4().fromArray(matrix);
      let pm = m;

      if (isGlobe) {
        const gm = new THREE.Matrix4().fromArray(globeToMercMatrix);  
        pm = m.multiply(gm);
      }
      
      camera.projectionMatrix.copy(pm);

      renderer.resetState();
    
      // render globe
      renderer.render(globeSceneRef.current, camera);
      
      renderer.clearDepth();
      
      // layers on top of the globe
      renderer.render(scene, camera);

      map.triggerRepaint();
    }
  }

  return (
    <AntennaLayerContext.Provider
      value={{
        rendererRef,
        sceneRef,
        cameraRef,
        draggableObjects,
        antennaLayer
      }}
    >
      {children}
    </AntennaLayerContext.Provider>
  );
};