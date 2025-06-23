// React imports
import { useRef, useContext, createContext } from 'react';

// App imports
import { getMercatorMatrix, getEcefMatrix } from 'utils';

// Context imports
import { useGeo } from 'context/geo';

// Third-party imports
import * as THREE from 'three';

const CubeLayerContext: React.Context<any> = createContext(null)

export const useCubeLayer = () => useContext(CubeLayerContext);

export const CubeLayerProvider = ({ children }: any) => {
  const { mapRef } = useGeo();
  
  const globeSceneRef = useRef(new THREE.Scene());
  const sceneRef = useRef(new THREE.Scene());

  const cameraRef = useRef(new THREE.Camera());
  const rendererRef = useRef<any>(null);

  const draggableObjects: any[] = [];

  const modelOrigin = { lng: -79.390307, lat: 43.658956 };
  const modelAltitude = 100000;

  const cubeLayer = {
    id: 'cube-layer',
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

// ******************************************************************************************************************************
      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshPhongMaterial({color: 0xeeeeff, side: THREE.DoubleSide});
      const cube = new THREE.Mesh(geometry, material);

      cube.name = 'cube';
      cube.matrixAutoUpdate = false;
      cube.frustumCulled = false;
      cube.userData.lngLat = [ modelOrigin.lng, modelOrigin.lat ];
      cube.rotation.x = Math.PI / 2;
      sceneRef.current.add(cube);

// ******************************************************************************************************************************
    },
    render(gl: any, matrix: any, projection: any, globeToMercMatrix: any, transition: number) {
      const scene = sceneRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      const isGlobe = projection?.name === 'globe';
      
      const map = mapRef?.current?.getMap();
      
      if (!map) return;
      
      const m = new THREE.Matrix4().fromArray(matrix);
      let pm = m;
      
      if (isGlobe) {
        const gm = new THREE.Matrix4().fromArray(globeToMercMatrix);  
        pm = m.multiply(gm);
      }
// **************************************************************************************************************************
      const cube = scene.getObjectByName('cube');
      if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        const dynamicRotation = new THREE.Matrix4().makeRotationFromEuler(cube.rotation);

        const modelMatrix = isGlobe
          ? getEcefMatrix(modelOrigin, modelAltitude)
          : getMercatorMatrix(modelOrigin, modelAltitude);

        cube.matrix = modelMatrix.multiply(dynamicRotation);
      }
// **************************************************************************************************************************      
      camera.projectionMatrix.copy(pm);
      renderer.resetState();
    
      renderer.render(globeSceneRef.current, camera);
      renderer.clearDepth();
      renderer.render(scene, camera);

      map.triggerRepaint();
    }
  }

  return (
    <CubeLayerContext.Provider
      value={{
        rendererRef,
        sceneRef,
        cameraRef,
        draggableObjects,
        cubeLayer
      }}
    >
      {children}
    </CubeLayerContext.Provider>
  );
};