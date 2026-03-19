"use client";

import { useEffect, useRef } from "react";

export default function ThreadsAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    setCanvasSize();

    // Vertex Shader with 3D transformations and lighting
    const vertexShaderSource = `#version 300 es
      precision highp float;
      
      in vec3 a_position;
      in float a_depth;
      in float a_progress;
      in vec3 a_color;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_aspect;
      
      out float v_depth;
      out float v_progress;
      out vec3 v_color;
      out vec3 v_normal;
      out vec3 v_position;
      
      void main() {
        vec3 pos = a_position;
        
        // Calculate twist and wave motion
        float twistPhase = u_time * 0.0005 + a_depth * 6.28;
        float waveFreq = 2.0 + a_depth * 2.0;
        
        // Primary wave with slant
        float wave1 = sin(twistPhase + a_progress * 3.14159 * waveFreq) * 0.08;
        float wave2 = cos(twistPhase * 0.7 + a_progress * 3.14159 * waveFreq * 0.6) * 0.04;
        
        // Add slant/curve to threads
        float slant = a_progress * 0.15;
        
        // 3D displacement
        pos.x += wave1 + wave2 + slant;
        pos.z = a_depth * 0.3 - 0.15 + wave1 * 0.5;
        
        // Calculate normal for lighting
        float epsilon = 0.01;
        float wave1_next = sin(twistPhase + (a_progress + epsilon) * 3.14159 * waveFreq) * 0.08;
        vec3 tangent = normalize(vec3(wave1_next - wave1, epsilon, 0.0));
        v_normal = vec3(-tangent.y, tangent.x, 0.0);
        
        v_depth = a_depth;
        v_progress = a_progress;
        v_color = a_color;
        v_position = pos;
        
        // Perspective projection
        float perspective = 1.0 / (1.0 + pos.z * 0.5);
        vec2 screenPos = pos.xy * perspective;
        
        // Convert to clip space
        gl_Position = vec4(screenPos * 2.0, pos.z, 1.0);
        gl_PointSize = 2.0;
      }
    `;

    // Fragment Shader with realistic lighting and shading
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      in float v_depth;
      in float v_progress;
      in vec3 v_color;
      in vec3 v_normal;
      in vec3 v_position;
      
      uniform float u_time;
      uniform vec3 u_lightPos;
      
      out vec4 fragColor;
      
      void main() {
        // Lighting calculations
        vec3 lightDir = normalize(u_lightPos - v_position);
        vec3 normal = normalize(v_normal);
        
        // Diffuse lighting
        float diff = max(dot(normal, lightDir), 0.0) * 0.6 + 0.4;
        
        // Specular highlights for thread sheen
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 32.0) * 0.4;
        
        // Ambient occlusion based on depth
        float ao = 0.6 + v_depth * 0.4;
        
        // Edge fade
        float edgeFade = smoothstep(0.0, 0.08, v_progress) * 
                        smoothstep(1.0, 0.92, v_progress);
        
        // Color with lighting
        vec3 litColor = v_color * diff * ao + vec3(spec);
        
        // Opacity with depth and edges
        float alpha = (0.3 + v_depth * 0.5) * edgeFade;
        
        // Subtle shimmer
        float shimmer = sin(u_time * 0.001 + v_depth * 20.0 + v_progress * 10.0) * 0.1 + 0.9;
        
        fragColor = vec4(litColor * shimmer, alpha);
      }
    `;

    function compileShader(gl: WebGL2RenderingContext, source: string, type: number): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Get attribute and uniform locations
    const positionLoc = gl.getAttribLocation(program, "a_position");
    const depthLoc = gl.getAttribLocation(program, "a_depth");
    const progressLoc = gl.getAttribLocation(program, "a_progress");
    const colorLoc = gl.getAttribLocation(program, "a_color");
    
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const aspectLoc = gl.getUniformLocation(program, "u_aspect");
    const lightPosLoc = gl.getUniformLocation(program, "u_lightPos");

    // Create dense threads - very tightly packed
    const threadSpacing = 3; // Pixels between threads (very dense)
    const rect = canvas.getBoundingClientRect();
    const threadCount = Math.floor(rect.width / threadSpacing) + 20; // Extra threads for coverage
    const segmentsPerThread = 150; // High detail
    const totalVertices = threadCount * segmentsPerThread;

    const positions: number[] = [];
    const depths: number[] = [];
    const progresses: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    const colorPalette = [
      [0.22, 0.25, 0.36], // #393f5b
      [0.18, 0.20, 0.31], // #2f3450
      [0.29, 0.31, 0.44], // #4a5070
      [0.03, 0.04, 0.02], // #070a05
      [0.23, 0.25, 0.35], // #3a4159
      [0.20, 0.23, 0.33], // Intermediate shade
    ];

    let vertexIndex = 0;

    for (let t = 0; t < threadCount; t++) {
      const threadDepth = Math.random();
      const threadColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      
      // Distribute threads evenly with slight randomization
      const baseX = ((t - 10) / (threadCount - 20)) * 2 - 1; // Normalized to -1 to 1
      const xOffset = (Math.random() - 0.5) * 0.01; // Slight random offset
      
      for (let s = 0; s < segmentsPerThread; s++) {
        const progress = s / (segmentsPerThread - 1);
        const y = progress * 2 - 1; // -1 to 1 (top to bottom, extended)
        
        // Position: x, y, z (will be modified in shader)
        positions.push(baseX + xOffset, y, 0);
        depths.push(threadDepth);
        progresses.push(progress);
        colors.push(threadColor[0], threadColor[1], threadColor[2]);
        
        // Create line segments
        if (s < segmentsPerThread - 1) {
          indices.push(vertexIndex, vertexIndex + 1);
        }
        
        vertexIndex++;
      }
    }

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const depthBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, depthBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(depths), gl.STATIC_DRAW);

    const progressBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, progressBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(progresses), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

    // Setup vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, depthBuffer);
    gl.enableVertexAttribArray(depthLoc);
    gl.vertexAttribPointer(depthLoc, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, progressBuffer);
    gl.enableVertexAttribArray(progressLoc);
    gl.vertexAttribPointer(progressLoc, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

    // Configure WebGL state
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.lineWidth(1);

    let animationFrameId: number;
    let startTime = Date.now();

    function animate() {
      if (!gl || !canvas) return;

      const time = Date.now() - startTime;
      const rect = canvas.getBoundingClientRect();

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Update uniforms
      gl.uniform1f(timeLoc, time);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(aspectLoc, canvas.width / canvas.height);
      
      // Animated light position for dynamic shading
      const lightX = Math.sin(time * 0.0003) * 0.5;
      const lightY = Math.cos(time * 0.0005) * 0.3;
      gl.uniform3f(lightPosLoc, lightX, lightY, 0.8);

      // Draw all thread segments
      gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_INT, 0);

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Cleanup WebGL resources
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(depthBuffer);
      gl.deleteBuffer(progressBuffer);
      gl.deleteBuffer(colorBuffer);
      gl.deleteBuffer(indexBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
}
