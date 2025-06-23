// React imports
import { useContext, createContext } from 'react';

// Context imports
import { useSatellitesApi } from 'context/api/satellites';

// Third-party imports
import * as satellite from 'satellite.js';
import mapboxgl from 'mapbox-gl';

const SatellitesLayerContext: React.Context<any> = createContext(null)

export const useSatellitesLayer = () => useContext(SatellitesLayerContext);

export const SatellitesLayerProvider = ({ children }: any) => {
  const { satellitesData } = useSatellitesApi();

  const KM_TO_M = 1000;
  const TIME_STEP = 3 * 1000;

  const globeVertCode = `
    attribute vec3 a_pos_ecef;
    attribute vec3 a_pos_merc;

    uniform mat4 u_projection;
    uniform mat4 u_globeToMercMatrix;
    uniform float u_globeToMercatorTransition;

    void main() {
      vec4 p = u_projection * u_globeToMercMatrix * vec4(a_pos_ecef, 1.);
      if (u_globeToMercatorTransition > 0.) {
          vec4 merc = u_projection * vec4(a_pos_merc, 1.);
          p = mix(p, merc, u_globeToMercatorTransition);
      }
      gl_PointSize = 30.;
      gl_Position = p;
    }
  `;

  const mercVertCode = `
    precision highp float;
    attribute vec3 a_pos_merc;
    uniform mat4 u_projection;

    void main() {
      gl_PointSize = 30.;
      gl_Position = u_projection * vec4(a_pos_merc, 1.);
    }
  `;

  const fragCode = `
    precision highp float;
    uniform vec4 u_color;

    void main() {
      gl_FragColor = vec4(0., 1., 0., 1.);
    }
  `;

  let time = new Date();
  
  let posEcef: number[] = [];
  let posMerc: number[] = [];

  let posEcefVbo: any;
  let posMercVbo: any;
  
  let globeProgram: any;
  let mercProgram: any;

  const createShader = (gl: any, src: string, type: number) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    const message = gl.getShaderInfoLog(shader);
    if (message.length > 0) console.error(message);
    return shader;
  };

  const createProgram = (gl: any, vert: string, frag: string) => {
    const vertShader = createShader(gl, vert, gl.VERTEX_SHADER);
    const fragShader = createShader(gl, frag, gl.FRAGMENT_SHADER);

    const program = gl.createProgram()!;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Could not compile WebGL program:\n${gl.getProgramInfoLog(program)}`);
    }
    return program;
  };

  const updateVboAndActivateAttrib = (gl: any, prog: any, vbo: any, data: number[], attribName: string) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
    const attribLoc = gl.getAttribLocation(prog, attribName);
    gl.vertexAttribPointer(attribLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLoc);
  };

  const updateBuffers = () => {
    time = new Date(+time + TIME_STEP);
    const gmst = satellite.gstime(time);

    posEcef = [];
    posMerc = [];

    for (let i = 0; i < satellitesData.length; i++) {
      const { satrec } = satellitesData[i];
      const eci = satellite.propagate(satrec, time);
      if (eci?.position) {
        const geodetic = satellite.eciToGeodetic(eci.position, gmst);
        const lngLat = [ satellite.degreesLong(geodetic.longitude), satellite.degreesLat(geodetic.latitude) ];
        const altitude = geodetic.height * KM_TO_M;

        const merc = mapboxgl.MercatorCoordinate.fromLngLat(lngLat as [number, number], altitude);
        const ecef = mapboxgl.LngLat.convert(lngLat as [number, number]).toEcef(altitude);

        posEcef.push(...ecef);
        posMerc.push(...[ merc.x, merc.y, merc.z ]);
      }
    }
  };

  const satellitesLayer = {
    id: 'satellites',
    type: 'custom',
    renderingMode: '3d',
    
    onAdd(map: any, gl: any) {
      posEcefVbo = gl.createBuffer()!;
      posMercVbo = gl.createBuffer()!;
      globeProgram = createProgram(gl, globeVertCode, fragCode);
      mercProgram = createProgram(gl, mercVertCode, fragCode);
    },

    render(gl: any, matrix: any, projection: any, globeToMercMatrix: any, transition: number) {
      if (!satellitesData?.length) return;
      updateBuffers();

      const primitiveCount = posEcef.length / 3;
      gl.disable(gl.DEPTH_TEST);

      if (projection?.name === 'globe') {
        gl.useProgram(globeProgram);
        updateVboAndActivateAttrib(gl, globeProgram, posEcefVbo, posEcef, 'a_pos_ecef');
        updateVboAndActivateAttrib(gl, globeProgram, posMercVbo, posMerc, 'a_pos_merc');

        gl.uniformMatrix4fv(gl.getUniformLocation(globeProgram, 'u_projection'), false, matrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(globeProgram, 'u_globeToMercMatrix'), false, globeToMercMatrix);
        gl.uniform1f(gl.getUniformLocation(globeProgram, 'u_globeToMercatorTransition'), transition);

        gl.drawArrays(gl.POINTS, 0, primitiveCount);
      } 
      else {
        gl.useProgram(mercProgram);
        updateVboAndActivateAttrib(gl, mercProgram, posMercVbo, posMerc, 'a_pos_merc');
        gl.uniformMatrix4fv(gl.getUniformLocation(mercProgram, 'u_projection'), false, matrix);
        gl.drawArrays(gl.POINTS, 0, primitiveCount);
      }
    },
  };

  return (
    <SatellitesLayerContext.Provider value={{ satellitesLayer }}>
      {children}
    </SatellitesLayerContext.Provider>
  );
};