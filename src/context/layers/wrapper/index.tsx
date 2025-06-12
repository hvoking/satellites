// React imports
import { useContext, createContext } from 'react';

const WrapperLayerContext: React.Context<any> = createContext(null)

export const useWrapperLayer = () => useContext(WrapperLayerContext);

export const WrapperLayerProvider = ({ children }: any) => {
  const getColor = (tileId: any) => {
    const m = Math.pow(2, tileId.z);
    const s = tileId.z + tileId.x * m + tileId.y * m;
    const r = (Math.sin(s + 5) * 1924957) % 1;
    const g = (Math.sin(s + 7) * 3874133) % 1;
    const b = (Math.sin(s + 3) * 7662617) % 1;
    return [ r, g, b ];
  };

  let program: any;
  let vertexBuffer: any;

  const wrapperLayer = {
      id: 'wrapper-layer',
      type: 'custom',
      renderingMode: '3d',

      onAdd: (map: any, gl: any) => {
        const vertexSource = `
          attribute vec2 a_pos;
          void main() {
              gl_Position = vec4(a_pos, 1.0, 1.0);
          }
        `;

        const fragmentSource = `
          precision highp float;
          uniform vec3 u_color;
          void main() {
              gl_FragColor = vec4(u_color, 0.5);
          }
        `;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);

        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        program.aPos = gl.getAttribLocation(program, "a_pos");
        program.uColor = gl.getUniformLocation(program, "u_color");

        const verts = new Float32Array([1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1]);
        
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      },

      shouldRerenderTiles: () => {
          // return true only when frame content has changed otherwise, all the terrain
          // render cache would be invalidated and redrawn causing huge drop in performance.
          return true;
      },

      renderToTile: (gl: any, tileId: any) => {
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(program.aPos);
        gl.vertexAttribPointer(program.aPos, 2, gl.FLOAT, false, 0, 0);
        
        const color = getColor(tileId);
        gl.uniform3f(program.uColor, color[0], color[1], color[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },

      render: (gl: any, matrix: any) => {
      }
  };

  return (
    <WrapperLayerContext.Provider value={{ wrapperLayer }}>
      {children}
    </WrapperLayerContext.Provider>
  );
};