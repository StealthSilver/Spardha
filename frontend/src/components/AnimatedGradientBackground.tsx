import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Beautiful gradient palette: sea green → cyan → blue → dark blue
const FIBER_COLORS = [
  // Sea Green shades
  new THREE.Color(0x20E6B8),  // Bright sea green
  new THREE.Color(0x2FFFCC),  // Vibrant mint green
  new THREE.Color(0x00F5C4),  // Brilliant turquoise green
  new THREE.Color(0x40FFD4),  // Bright seafoam
  
  // Cyan shades
  new THREE.Color(0x00FFFF),  // Pure bright cyan
  new THREE.Color(0x00F0FF),  // Ultra bright cyan
  new THREE.Color(0x1AFFFF),  // Electric cyan
  new THREE.Color(0x40F8FF),  // Bright light cyan
  
  // Blue shades
  new THREE.Color(0x00D4FF),  // Vivid sky blue
  new THREE.Color(0x00BFFF),  // Bright dodger blue
  new THREE.Color(0x1E90FF),  // Brilliant blue
  new THREE.Color(0x4DB8FF),  // Bright cornflower blue
  
  // Dark Blue shades
  new THREE.Color(0x0080FF),  // Bright deep blue
  new THREE.Color(0x0066CC),  // Rich royal blue
  new THREE.Color(0x0099FF),  // Vibrant azure blue
  new THREE.Color(0x3399FF),  // Light deep blue
];

// Configuration for dense fiber bundle with twisting strands
const FIBER_CONFIG = {
  count: 250,             // Very dense fiber bundle
  segmentsPerFiber: 400,  // Extra smooth for helical motion
  fiberWidth: 0.05,      // Thinner strands for density
  helixFrequency: 5.0,    // Number of helical rotations along the path
  bundleRadius: 0.8,      // Radius of the fiber bundle
  rotationSpeed: 0.05,    // Speed of rotation around central axis
};

// Single fiber strand rotating around the central axis
function AnimatedFiber({ 
  angleInBundle,
  radiusInBundle,
  color, 
  phaseOffset
}: { 
  angleInBundle: number;
  radiusInBundle: number;
  color: THREE.Color; 
  phaseOffset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Create fiber path with a turning point in the middle
  const initialGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = FIBER_CONFIG.segmentsPerFiber;
    
    // Fixed start point (top center)
    const startX = 0;
    const startY = 12;
    const startZ = 1;
    
    // Middle turning point (creates the fabric bend)
    const midX = 4;
    const midY = 6;
    const midZ = 0;  // Pull it back in Z to create the bend
    
    // Fixed end point (bottom left - shifted more to the left)
    const endX = -12;
    const endY = -30;
    const endZ = 6;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      
      // Quadratic Bezier curve through the three points
      // Creates smooth bend through the middle point
      const axisX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
      const axisY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;
      const axisZ = (1 - t) * (1 - t) * startZ + 2 * (1 - t) * t * midZ + t * t * endZ;
      
      // Calculate tangent direction at this point for proper helical wrapping
      const tangentX = 2 * (1 - t) * (midX - startX) + 2 * t * (endX - midX);
      const tangentY = 2 * (1 - t) * (midY - startY) + 2 * t * (endY - midY);
      const tangentZ = 2 * (1 - t) * (midZ - startZ) + 2 * t * (endZ - midZ);
      const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY + tangentZ * tangentZ);
      
      // Normalized tangent direction
      const normDirX = tangentX / tangentLength;
      const normDirY = tangentY / tangentLength;
      const normDirZ = tangentZ / tangentLength;
      
      // Calculate helical position around the curved axis
      const helixAngle = t * Math.PI * 2 * FIBER_CONFIG.helixFrequency + angleInBundle;
      
      // Create perpendicular vectors for helical motion
      let perpX, perpY, perpZ;
      if (Math.abs(normDirY) < 0.9) {
        perpX = 0;
        perpY = 1;
        perpZ = 0;
      } else {
        perpX = 1;
        perpY = 0;
        perpZ = 0;
      }
      
      // Make it perpendicular using cross product
      const crossX = normDirY * perpZ - normDirZ * perpY;
      const crossY = normDirZ * perpX - normDirX * perpZ;
      const crossZ = normDirX * perpY - normDirY * perpX;
      const crossLength = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
      
      const perp1X = crossX / crossLength;
      const perp1Y = crossY / crossLength;
      const perp1Z = crossZ / crossLength;
      
      // Second perpendicular vector (perpendicular to both tangent and perp1)
      const perp2X = normDirY * perp1Z - normDirZ * perp1Y;
      const perp2Y = normDirZ * perp1X - normDirX * perp1Z;
      const perp2Z = normDirX * perp1Y - normDirY * perp1X;
      
      // Helical offset using both perpendicular vectors
      const radius = radiusInBundle;
      const offsetX = (Math.cos(helixAngle) * perp1X + Math.sin(helixAngle) * perp2X) * radius;
      const offsetY = (Math.cos(helixAngle) * perp1Y + Math.sin(helixAngle) * perp2Y) * radius;
      const offsetZ = (Math.cos(helixAngle) * perp1Z + Math.sin(helixAngle) * perp2Z) * radius;
      
      points.push(new THREE.Vector3(
        axisX + offsetX,
        axisY + offsetY,
        axisZ + offsetZ
      ));
    }
    
    const pathCurve = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(
      pathCurve,
      segments,
      FIBER_CONFIG.fiberWidth,
      8,
      false
    );
    
    return tubeGeometry;
  }, [angleInBundle, radiusInBundle]);

  // Rotation animation - rotate the entire group
  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate around Y axis for twisting effect
    groupRef.current.rotation.y = time * FIBER_CONFIG.rotationSpeed + phaseOffset;
    
    // Lower pulsing opacity for better text visibility
    const pulse = 0.35 + Math.sin(time * 0.8 + phaseOffset) * 0.08;
    materialRef.current.opacity = pulse;
    
    // Reduced emissive intensity for less distraction
    materialRef.current.emissiveIntensity = 0.22 + Math.sin(time * 0.5 + phaseOffset) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={initialGeometry} castShadow receiveShadow>
        <meshStandardMaterial 
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.22}
          transparent 
          opacity={0.4}
          roughness={0.3}
          metalness={0.6}
          envMapIntensity={1.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Dense fiber bundle with helical arrangement
function FiberField() {
  const fibers = useMemo(() => {
    const fiberData = [];
    
    // Create very dense helical bundle with multiple layers
    for (let i = 0; i < FIBER_CONFIG.count; i++) {
      // More layers for denser packing
      const layer = Math.floor(i / 50);
      const angleStep = (i % 50) / 50;
      
      // Angle around the bundle
      const angle = angleStep * Math.PI * 2;
      
      // Radius from center (multiple concentric layers)
      const radius = FIBER_CONFIG.bundleRadius * (0.2 + (layer / 8) * 0.8);
      
      fiberData.push({
        id: i,
        angleInBundle: angle,
        radiusInBundle: radius,
        color: FIBER_COLORS[Math.floor(Math.random() * FIBER_COLORS.length)].clone(),
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }
    
    return fiberData;
  }, []);

  return (
    <>
      {/* Soft lighting for illumination */}
      <ambientLight intensity={0.6} />
      
      {/* Key light from top */}
      <directionalLight 
        position={[5, 15, 10]} 
        intensity={1.3} 
        color="#e0f7ff"
      />
      
      {/* Fill light */}
      <pointLight position={[-8, 0, 8]} intensity={0.9} color="#87CEEB" />
      
      {/* Accent light from right */}
      <pointLight position={[15, -10, 8]} intensity={0.8} color="#4682B4" />
      
      {/* Additional depth light */}
      <pointLight position={[0, 0, -5]} intensity={0.5} color="#20B2AA" />
      
      <group>
        {fibers.map((fiber) => (
          <AnimatedFiber
            key={fiber.id}
            angleInBundle={fiber.angleInBundle}
            radiusInBundle={fiber.radiusInBundle}
            color={fiber.color}
            phaseOffset={fiber.phaseOffset}
          />
        ))}
      </group>
    </>
  );
}

// Main component - positioned with adjustable z-index
export default function AnimatedGradientBackground() {
  return (
    <div className="fixed inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 28], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <FiberField />
      </Canvas>
    </div>
  );
}
