import React, { createContext, createRef,  useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Text, useGLTF,  Text3D, Circle } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import RailTrack from './railtrack';
import MovingTrain from './movingtrain';
function GlbModel({
  path = '',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [0.05, 0.05, 0.05],
  text = null,
  textSize = 0.3,
  textHeight = 2,
}) {
  const { scene, animations } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const mixer = useRef();
  const textRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = child.receiveShadow = true;
      }
    });

    if (animations.length) {
      mixer.current = new THREE.AnimationMixer(clonedScene);
      animations.forEach((clip) => mixer.current.clipAction(clip).play());
    }
  }, [clonedScene, animations]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);

    if (textRef.current) {
      const textPos = textRef.current.getWorldPosition(new THREE.Vector3());
      const camPos = camera.position.clone().setY(textPos.y);
      textRef.current.lookAt(camPos);
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
      {text && (
        <Text
          ref={textRef}
          position={[0, textHeight, 0]}
          fontSize={textSize}
          color="white"
          anchorX="center"
          anchorY="bottom"
        >
          {text}
        </Text>
      )}
    </group>
  );
}

function Road() {
  const roadThickness = 0.01;
  const roadWidth = 45;
  const roadHeight = 29;
  const cornerRadius = 3;
  const color = 'dimgray';

  const horizontalSegments = [
    [0, 0.01, roadHeight / 2 - cornerRadius / 2],
    [0, 0.01, -roadHeight / 2 + cornerRadius / 2],
  ];

  const verticalSegments = [
    [-roadWidth / 2 + cornerRadius / 2, 0.01, 0],
    [roadWidth / 2 - cornerRadius / 2, 0.01, 0],
  ];

  const corners = [
    { position: [-roadWidth / 2 + cornerRadius, roadThickness / 2, roadHeight / 2 - cornerRadius], rotation: [0, -Math.PI / 2, 0] }, // top-left
    { position: [roadWidth / 2 - cornerRadius, roadThickness / 2, roadHeight / 2 - cornerRadius], rotation: [0, 0, 0] }, // top-right
    { position: [roadWidth / 2 - cornerRadius, roadThickness / 2, -roadHeight / 2 + cornerRadius], rotation: [0, Math.PI / 2, 0] }, // bottom-right
    { position: [-roadWidth / 2 + cornerRadius, roadThickness / 2, -roadHeight / 2 + cornerRadius], rotation: [0, Math.PI, 0] }, // bottom-left
  ];

  return (
    <>
      {horizontalSegments.map((pos, i) => (
        <Box key={`h-${i}`} args={[roadWidth - 2 * cornerRadius, roadThickness, cornerRadius]} position={pos}>
          <meshStandardMaterial color={color} />
        </Box>
      ))}

      {verticalSegments.map((pos, i) => (
        <Box key={`v-${i}`} args={[cornerRadius, roadThickness, roadHeight - 2 * cornerRadius]} position={pos}>
          <meshStandardMaterial color={color} />
        </Box>
      ))}

      {corners.map(({ position, rotation }, i) => (
        <mesh key={`c-${i}`} position={position} rotation={rotation}>
          <cylinderGeometry args={[cornerRadius, cornerRadius, roadThickness, 32, 1, false, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </>
  );
}

function Conveyor({
  position = [0, 0, 0],
  roadWidth = 45,
  roadHeight = 29,
  roadThickness = 0.01,
  cornerRadius = 3,
  color = 'dimgray',
}) {
  const segments = [
    { args: [roadWidth - 2 * cornerRadius, roadThickness, cornerRadius], pos: [0, roadThickness / 2, roadHeight / 2 - cornerRadius / 2] },
    { args: [roadWidth - 2 * cornerRadius, roadThickness, cornerRadius], pos: [0, roadThickness / 2, -roadHeight / 2 + cornerRadius / 2] },
    { args: [cornerRadius, roadThickness, roadHeight - 2 * cornerRadius], pos: [-roadWidth / 2 + cornerRadius / 2, roadThickness / 2, 0] },
    { args: [cornerRadius, roadThickness, roadHeight - 2 * cornerRadius], pos: [roadWidth / 2 - cornerRadius / 2, roadThickness / 2, 0] },
  ];

  const corners = [
    { pos: [-roadWidth / 2 + cornerRadius, roadThickness / 2, roadHeight / 2 - cornerRadius], rot: [0, -Math.PI / 2, 0] },
    { pos: [roadWidth / 2 - cornerRadius, roadThickness / 2, roadHeight / 2 - cornerRadius], rot: [0, 0, 0] },
    { pos: [roadWidth / 2 - cornerRadius, roadThickness / 2, -roadHeight / 2 + cornerRadius], rot: [0, Math.PI / 2, 0] },
    { pos: [-roadWidth / 2 + cornerRadius, roadThickness / 2, -roadHeight / 2 + cornerRadius], rot: [0, Math.PI, 0] },
  ];

  return (
    <group position={position}>
      {segments.map(({ args, pos }, i) => (
        <Box key={`seg-${i}`} args={args} position={pos}>
          <meshStandardMaterial color={color} />
        </Box>
      ))}
      {corners.map(({ pos, rot }, i) => (
        <mesh key={`corner-${i}`} position={pos} rotation={rot}>
          <cylinderGeometry args={[cornerRadius, cornerRadius, roadThickness, 32, 1, false, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function MovingBoxesOnConveyor({
  conveyorPosition = [9, 0.1, -8],
  roadWidth = 5,
  roadHeight = 1,
  speed = 1,
  boxCount = 3,
  spacing = 2,
}) {
  const boxes = useMemo(() => Array.from({ length: boxCount }, createRef), [boxCount]);
  const timeRef = useRef(0);
  const segments = [roadWidth, roadHeight, roadWidth, roadHeight];
  const totalLength = segments.reduce((a, b) => a + b, 0);

  useFrame((_, delta) => {
    timeRef.current += delta * speed;

    boxes.forEach((ref, i) => {
      let d = (timeRef.current + i * spacing) % totalLength;
      let x = 0, z = 0;

      if (d < segments[0]) {
        x = -roadWidth / 2 + d; z = -roadHeight / 2;
      } else if ((d -= segments[0]) < segments[1]) {
        x = roadWidth / 2; z = -roadHeight / 2 + d;
      } else if ((d -= segments[1]) < segments[2]) {
        x = roadWidth / 2 - d; z = roadHeight / 2;
      } else {
        x = -roadWidth / 2; z = roadHeight / 2 - (d - segments[2]);
      }

      ref.current?.position.set(
        conveyorPosition[0] + x,
        conveyorPosition[1] + 0.05,
        conveyorPosition[2] + z
      );
    });
  });

  return boxes.map((ref, i) => (
    <mesh ref={ref} key={i}>
      <boxGeometry args={[0.3, 0.1, 0.3]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  ));
}

function MovingTruck({ scale = [0.3, 0.3, 0.3] }) {
  const { scene } = useGLTF('/truck_toyota_corsa_b_compressed.glb');
  const truckRef = useRef();
  const cloned = useMemo(() => {
    const c = clone(scene);
    c.traverse(obj => obj.isMesh && (obj.castShadow = obj.receiveShadow = true));
    return c;
  }, [scene]);

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 5) % (2 * (45 + 29 - 8));
    const hw = 45 / 2 - 2, hh = 29 / 2 - 2;
    let x = 0, z = 0, ry = 0;

    if (t < 41) [x, z, ry] = [-hw + t, hh, -Math.PI / 2];
    else if (t < 66) [x, z, ry] = [hw, hh - (t - 41), 0];
    else if (t < 107) [x, z, ry] = [hw - (t - 66), -hh, Math.PI / 2];
    else [x, z, ry] = [-hw, -hh + (t - 107), Math.PI];

    truckRef.current.position.set(x, 0.15, z);
    truckRef.current.rotation.y = ry + Math.PI;
  });

  return <primitive object={cloned} ref={truckRef} scale={scale} position={[0, 0.15, 0]} />;
}

function FactorySection({ position, size, color, label }) {
  return (
    <>
      <Box args={size} position={position}>
        <meshStandardMaterial color={color} />
      </Box>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.3}
        height={0.05}
        position={[position[0], position[1] + size[1] / 2 + 0.2, position[2]]}
      >
        {label}
        <meshStandardMaterial color="white" />
      </Text3D>
    </>
  );
}

function FactoryLayout({ position = [0, 0, 0] }) {
  const baseX = position[0];
  const baseZ = position[2];
  const y = position[1];

  return (
    <>
      <FactorySection position={[baseX - 2, y + 0.5, baseZ - 3]} size={[2, 1, 2]} color="slategray"  />
      <FactorySection position={[baseX + 2, y + 0.5, baseZ - 3]} size={[2, 1, 2]} color="darkgray"  />
      <FactorySection position={[baseX + 2, y + 0.5, baseZ + 0]} size={[2, 1, 2]} color="gray" />
      <FactorySection position={[baseX - 2, y + 0.5, baseZ + 0]} size={[2, 1, 2]} color="silver"  />
    </>
  );
}

function Wall({ position, size }) {
  return (
    <Box args={size} position={position}>
      <meshStandardMaterial color="lightslategray" />
    </Box>
  );
}

function RoomWithWalls({
  center = [0, 0],
  label = "Area",
  width = 6,
  depth = 6,
  height = 2,
  controlsRef,
  onCircleClick,
}) {
  const [x, z] = center;
  const wallThickness = 0.2;
  const halfW = width / 2;
  const halfD = depth / 2;

  const { camera } = useThree();
  const targetCameraPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const moving = useRef(false);

  const { locked } = useCameraLock();
  const [showCircle, setShowCircle] = useState(false);
  const activeTargetPos = useRef(new THREE.Vector3());

  const handleLabelClick = () => {
    if (locked.current) return;
    locked.current = true;
    setShowCircle(false);
    targetCameraPos.current.set(x , height + 5, z + 4);
    targetLookAt.current.set(x, height / 2, z);
    activeTargetPos.current.copy(targetCameraPos.current);
    moving.current = true;
  };

  useFrame(() => {
    if (showCircle && camera.position.distanceTo(activeTargetPos.current) > 2) {
      setShowCircle(false);
    }

    if (moving.current) {
      camera.position.lerp(targetCameraPos.current, 0.1);
      if (controlsRef?.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 0.1);
        controlsRef.current.update();
      }
      if (camera.position.distanceTo(targetCameraPos.current) < 0.05) {
        camera.position.copy(targetCameraPos.current);
        controlsRef?.current?.target.copy(targetLookAt.current);
        controlsRef?.current?.update();
        moving.current = false;
        locked.current = false;
        setShowCircle(true);
      }
    }
  });

  return (
    <>
      <Wall position={[x - halfW, height / 2, z]} size={[wallThickness, height, depth]} />
      <Wall position={[x + halfW, height / 2, z]} size={[wallThickness, height, depth]} />
      <Wall position={[x, height / 2, z - halfD]} size={[width, height, wallThickness]} />
      <Wall position={[x, height / 2, z + halfD]} size={[width, height, wallThickness]} />

      <Text
        position={[x, height + 2, z]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        onClick={handleLabelClick}
        cursor={locked.current ? "not-allowed" : "pointer"}
      >
        {label}
      </Text>

      {showCircle && (
  <group
    position={[x, height + 2.8, z]}
    onClick={() => onCircleClick?.(label)}
  >
    {/* Glowing Circle */}
    <mesh>
      <circleGeometry args={[0.6, 64]} />
      <meshBasicMaterial
        color="Black"
        transparent
        opacity={0.8}
      />
    </mesh>

    {/* Pulse Ring Animation (Optional Eye Candy) */}
    <mesh scale={1.2}>
      <ringGeometry args={[0.65, 0.75, 64]} />
      <meshBasicMaterial
        color="white"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>

    {/* Floating Label */}
    <Text
      position={[0, 0.3, 0.01]}
      fontSize={0.25}
      color="#fff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.01}
      outlineColor="black"
    >
      Know More
    </Text>

    {/* Sub Label */}
    <Text
      position={[0, -0.1, 0.01]}
      fontSize={0.15}
      color="#FFD700"
      anchorX="center"
      anchorY="middle"
    >
      {label}
    </Text>
  </group>
)}

    </>
  );
}

function ImageXY({ url, position = [0, 0, 0], size = [4, 4], waving = false, label = "" }) {
  const texture = useLoader(THREE.TextureLoader, url);
  const meshRef = useRef();
  const geometryRef = useRef();

  useFrame((state) => {
    if (waving && meshRef.current && geometryRef.current) {
      const time = state.clock.getElapsedTime();

      meshRef.current.rotation.z = Math.sin(time) * 0.05;
      meshRef.current.rotation.x = Math.sin(time * 1.5) * 0.05;

      const vertices = geometryRef.current.attributes.position.array;
      for (let i = 0; i < vertices.length; i += 3) {
        const offsetX = vertices[i];
        vertices[i + 2] = Math.sin(offsetX * 2 + time * 3) * 0.1;
      }
      geometryRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Image Signboard */}
      <mesh ref={meshRef}>
        <planeGeometry ref={geometryRef} args={size} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>

      {/* Text Label */}
      {label && (
        <Text
          position={[0, size[1] / 6 + 0.5, 0.009]} // Place text slightly above the sign
          fontSize={0.1}
          color="#F3282C"
          anchorX="center"
          anchorY="bottom"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

export function Garden({ length = 3, width = 3, position = [0, 0, 0] }) {
  const models = useMemo(() => {
    const grid = [];
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < width; j++) {
        const x = i * 2;
        const z = j * 2;
        grid.push([x, 0.05, z]);
      }
    }
    return grid;
  }, [length, width]);

  const baseSizeX = length * 2;
  const baseSizeZ = width * 2;
  const boundaryHeight = 0.5;

  return (
    <group position={position}>
      {/* Grass Base */}
      <Box args={[baseSizeX, 0.1, baseSizeZ]}>
        <meshStandardMaterial color="#228B22" /> {/* Green grass color */}
      </Box>

      {/* Garden Models */}
      {models.map((pos, idx) => (
        <GlbModel
          key={idx}
          path="linen_with_flowers_compressed.glb"
          position={pos}
          scale={[0.031, 0.031, 0.031]}
          rotation={[0, Math.PI * 1.5, 0]}
        />
      ))}

      {/* Boundaries (grass fence style) */}
      {/* Front */}
      <Box args={[baseSizeX + 0.5, boundaryHeight, 0.2]} position={[0, boundaryHeight / 2, baseSizeZ / 2]}>
        <meshStandardMaterial color="#556B2F" /> {/* Dark green border */}
      </Box>

      {/* Back */}
      <Box args={[baseSizeX + 0.5, boundaryHeight, 0.2]} position={[0, boundaryHeight / 2, -baseSizeZ / 2]}>
        <meshStandardMaterial color="#556B2F" />
      </Box>

      {/* Left */}
      <Box args={[0.2, boundaryHeight, baseSizeZ + 0.5]} position={[-baseSizeX / 2, boundaryHeight / 2, 0]}>
        <meshStandardMaterial color="#8B4513" /> {/* Wood brown for left */}
      </Box>

      {/* Right */}
      <Box args={[0.2, boundaryHeight, baseSizeZ + 0.5]} position={[baseSizeX / 2, boundaryHeight / 2, 0]}>
        <meshStandardMaterial color="#8B4513" /> {/* Wood brown for right */}
      </Box>
    </group>
  );
}



function City({ controlsRef, onCircleClick }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} />
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[100, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#333" />
      </Plane>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.8}
        height={0.08}
        position={[0, 8, 0]}
      >
        SM Informatic & control
        <meshStandardMaterial color="red" />
      </Text3D>
      <OrbitControls ref={controlsRef} enablePan enableRotate enableZoom />
      {/* <PowerRoom position={[0, 0.5, 0]} scale={[0.01, 0.01, 0.01]} /> */}
      
      <FactoryLayout position={[16, 0, -7]} />
      <FactoryLayout position={[9, 0, -1]} />
      <RoomWithWalls center={[-12, -8]} label="Receiving" controlsRef={controlsRef} onCircleClick={onCircleClick} />
      <RoomWithWalls center={[-5, -8]} label="Batching Blending" controlsRef={controlsRef} onCircleClick={onCircleClick} />
      <RoomWithWalls center={[2, -8]} label="Processing" controlsRef={controlsRef} onCircleClick={onCircleClick} />
      <RoomWithWalls center={[9, -8]} label="Packaging" controlsRef={controlsRef} onCircleClick={onCircleClick} />
      <RoomWithWalls center={[16, -8]} label="Shipping" controlsRef={controlsRef} onCircleClick={onCircleClick} />
      <RoomWithWalls center={[9, -2]} label="Material Handling" controlsRef={controlsRef} onCircleClick={onCircleClick} />
      <RoomWithWalls center={[9, 6]} label="Office Automation and digital services" controlsRef={controlsRef}  onCircleClick={() => {if (document.fullscreenElement) {document.exitFullscreen().then(() => {document.getElementById("technology")?.scrollIntoView({ behavior: "smooth" });});} else {document.getElementById("technology")?.scrollIntoView({ behavior: "smooth" });}}} />
      <RoomWithWalls center={[0, 0]} label="Control Room" width={50} depth={30} controlsRef={controlsRef} height={4} onCircleClick={onCircleClick}/>
      <RoomWithWalls center={[-12, -1]} label="Raw material handeling" controlsRef={controlsRef} onCircleClick={onCircleClick} width={7} height={1.4}/>
      <GlbModel path="steel_drum_-_3d_asset_compressed.glb" position={[-10, 0, -1]} scale={[0.3, 0.3, 0.3]} text="Barrel" />
      <GlbModel path="steel_drum_-_3d_asset_compressed.glb" position={[-16, 0, 6]} scale={[0.3, 0.3, 0.3]} text="Barrel" rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="desktop_computer_compressed.glb" position={[-10, 1, -3.66]} scale={[1, 1, 1]} text="Auto Quality Check" textSize={[0.2]} textHeight={[1]} />
      <GlbModel path="xyz_homework_detailing_boiler_compressed.glb" position={[1, 0, -7.66]} scale={[0.3, 0.3, 0.3]} text="Boiler" textSize={[0.4]} textHeight={[8]} />
      <GlbModel path="xyz_homework_detailing_boiler_compressed.glb" position={[-6, 0, -7.66]} scale={[0.3, 0.3, 0.3]} text="Boiler" textSize={[0.4]} textHeight={[8]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="screw.glb" position={[-12, 0.78, -3]} scale={[0.001, 0.001, 0.001]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="grizzly.glb" position={[-18, 0, -5]} scale={[0.61, 0.61, 0.61]}  rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="linen_with_flowers_compressed.glb" position={[-10, 0, 5.3]} scale={[0.061, 0.061, 0.061]} />
      <GlbModel path="stacker_reclaimer.glb" position={[-15.62, 1.42, -1]} scale={[0.0001, 0.0001, 0.0001]} text="Stacker & Reclaimer" textSize={[20]} textHeight={[2]} />
      <GlbModel path="surveillance_camera__animation.glb" position={[-9.3, 1.9, -7.66]} scale={[0.03, 0.03, 0.03]} text="custom camera" textSize={[4]} textHeight={[5]} rotation={[0, -2.6, 0]}/>
      <GlbModel path="surveillance_camera__animation.glb" position={[-2.3, 1.9, -7.66]} scale={[0.03, 0.03, 0.03]} text="custom camera" textSize={[4]} textHeight={[5]} rotation={[0, -2.6, 0]}/>
      <GlbModel path="surveillance_camera__animation.glb" position={[-9.3, 1.9, -7.66]} scale={[0.03, 0.03, 0.03]} text="custom camera" textSize={[4]} textHeight={[5]} rotation={[0, -2.6, 0]}/>
      <GlbModel path="surveillance_camera__animation.glb" position={[11.7, 1.9, -7.66]} scale={[0.03, 0.03, 0.03]} text="custom camera" textSize={[4]} textHeight={[5]} rotation={[0, -2.6, 0]}/>
      <GlbModel path="surveillance_camera__animation.glb" position={[18.7, 1.9, -7.66]} scale={[0.03, 0.03, 0.03]} text="custom camera" textSize={[4]} textHeight={[5]} rotation={[0, -2.6, 0]}/>
      <GlbModel path="surveillance_camera__animation.glb" position={[-8.8, 1.4, -1.34]} scale={[0.03, 0.03, 0.03]} text="custom camera" textSize={[4]} textHeight={[5]} rotation={[0, -2.6, 0]}/>
      <GlbModel path="surveillance_camera__animation.glb" position={[11.7, 1.9, -3.66]} scale={[0.03, 0.03, 0.03]} text="custom camera" textSize={[4]} textHeight={[5]} rotation={[0, -2.6, 0]}/>
      <GlbModel path='truck_toyota_corsa_b_compressed.glb' position={[-17, 0, -9]} scale={[0.3, 0.3, 0.3]} />
      <GlbModel path='truck_toyota_corsa_b_compressed.glb' position={[-18, 0, -7]} scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI * 1.5, 0]} />
      <Road />
      <GlbModel path="/jcb_435b_loader.glb" position={[-18, 0.6, -3.66]} scale={[20, 20, 20]}  />
      <MovingTruck />
     
      <GlbModel path="/weigher_barcode_scanner_compressed.glb" position={[-10, 0, -10]} scale={[1, 1, 1]} text="Scanner Unit" />
      <GlbModel path="/pallet_jack_low_poly_compressed.glb" position={[-10, 0.54, -9]} scale={[0.8, 0.8, 0.8]} rotation={[0, 1.6, 0]} />
      <GlbModel path="centrifugal_pump__bomba_centrifuga_compressed.glb" position={[-4.2, 0, -4.8]} scale={[0.02, 0.02, 0.02]} text="Scanner Unit" />
      {/* <GlbModel path="conveyor.glb" position={[-11, 0, -6]} scale={[0.002, 0.002, 0.002]} text="Scanner Unit" /> */}
      <GlbModel path="entrenador_industrial.glb" position={[-7.6, 0, -9.76]} scale={[0.2, 0.2, 0.2]} text="Programmable controller" textSize={[1]} textHeight={[12]} />
      <GlbModel path="desktop_computer_compressed.glb" position={[-4.6, 1, -10.76]} scale={[1, 1, 1]} text="Custom Batch Code" textSize={[0.2]} textHeight={[1]} />
      <GlbModel path="servo_motor.glb" position={[-3.6, 0.3, -9.76]} scale={[0.008, 0.008, 0.008]} text="Servo Motor" textSize={[20]} textHeight={[50]} />
      {/* <GlbModel path="kinetix_5700_large_frame_servo_drive.glb" position={[-2.6, 0.3, -8.76]} scale={[0.8, 0.8, 0.8]} text="Servo Drive" textSize={[0.2]} textHeight={[1.3]} /> */}
      <GlbModel path="beer_fermenter_v2_compressed.glb" position={[2.6, 0, -11.76]} scale={[0.05, 0.05, 0.05]} />
      <GlbModel path="beer_fermenter_v2_compressed.glb" position={[-12, 0, -2]} scale={[0.05, 0.05, 0.05]}  />
      <GlbModel path="metal_detector_entrance.glb" position={[-15, 0.6, -3.5]} scale={[2, 2, 2]} text="Metal Detector" textSize={[0.07]} textHeight={[0.3]} />
      <GlbModel path="snowy_water_tank_compressed.glb" position={[-16.6, 5, -26.76]} scale={[5, 5, 5]} />
      <GlbModel path="industrial_robotic_arm.glb" position={[9, 0, -7.76]} scale={[3, 3, 3]} text="robotic arm" textSize={[0.04]} textHeight={[0.8]} />
      <GlbModel path="indian_dairy_product_cardboard_box_by_ajay_free.glb" position={[19, -0.4, 0]} scale={[2, 2, 2]} />
      <GlbModel path="indian_dairy_product_cardboard_box_by_ajay_free.glb" position={[19-1, -0.7, 0-2]} scale={[1, 1, 1]} />
      <GlbModel path="indian_dairy_product_cardboard_box_by_ajay_free.glb" position={[19-8, -0.3, 0-6]} scale={[0.5, 0.5, 0.5]} />
      <GlbModel path="rsj_3d_packer.glb" position={[19-7, -0.3, 0-6]} scale={[0.04, 0.04, 0.04]} />
      <GlbModel path="lowpoly_printer_hp_laser_mfp_135w.glb" position={[9, 1, -10.76]} scale={[0.9, 0.9, 0.9]} />

      <GlbModel path="indian_dairy_product_cardboard_box_by_ajay_free.glb" position={[19-10, -0.3, 0-6]} scale={[0.5, 0.5, 0.5]} />
      <GlbModel path="indian_dairy_product_cardboard_box_by_ajay_free.glb" position={[19-28, -0.7, 0-2]} scale={[1, 1, 1]} />
      <GlbModel path="low_poly_farmer_man.glb" position={[19-8, 0, 0-10]} scale={[0.8, 0.8, 0.8]} />
      <GlbModel path="low_poly_farmer_man.glb" position={[19-12, 0, 0-10]} scale={[0.8, 0.8, 0.8]} />
      <GlbModel path="low_poly_farmer_man.glb" position={[19-32, 0, 0-10]} scale={[0.8, 0.8, 0.8]} />
      <GlbModel path="simple_rubber_conveyor.glb" position={[-12, 0, -3]} scale={[0.8, 0.8, 0.8]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="fire_extinguisher_compressed.glb" position={[-14, 0, -3.7]} scale={[0.0003, 0.0003, 0.0003]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="fire_extinguisher_compressed.glb" position={[-14, 0, -10.7]} scale={[0.0003, 0.0003, 0.0003]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="fire_extinguisher_compressed.glb" position={[-3, 0, -8.7]} scale={[0.0003, 0.0003, 0.0003]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="fire_extinguisher_compressed.glb" position={[0, 0, -10.7]} scale={[0.0003, 0.0003, 0.0003]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="fire_extinguisher_compressed.glb" position={[10, 0, -10.7]} scale={[0.0003, 0.0003, 0.0003]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="container.glb" position={[-17, 0, 3]} scale={[0.03, 0.03, 0.03]} rotation={[0, Math.PI * 1.5, 0]}/>
      <GlbModel path="/programmable_motor_compressed.glb" position={[-15, 0, -8]} scale={[0.1, 0.1, 0.1]} />
      <GlbModel path="10kv_compressed.glb" position={[0, 0.5, 0]} scale={[0.01, 0.01, 0.01]} />
      <GlbModel path="office_compressed.glb" position={[9, 0.3, 6]} scale={[0.6, 0.6, 0.6]} textSize={[0.2]} textHeight={[1.3]} rotation={[0, 1.6, 0]} />
      <Conveyor position={[9, 0.1, -8]} roadWidth={5} roadHeight={3} roadThickness={0.0015} cornerRadius={0.5} color="green" />
      <MovingBoxesOnConveyor conveyorPosition={[9, 0.1, -8]} roadWidth={5} roadHeight={3} cornerRadius={0.5} speed={1} />
      {/* <Drone/> */}
      <ImageXY url="/Screenshot 2025-04-23 112148 1.png" position={[10, 3.2, 15.4]} size={[9, 6]} waving={true}/>
      <ImageXY url="/ERP_Formulation-and-Validation-Protocol.png" position={[-12,1, -3.8]} size={[2, 1]} />
      <RailTrack position={[-30, 0, 0]} length={100} sleeperCount={50} />
      <MovingTrain position={[-30, -0.3, -50]} />
      <Garden length={1.5} width={3} position={[-10, 0, 6]} />
      <WorkersGroup position={[-5, 0, 5]} workerCount={5} />
      <ImageXY url="/pngtree-boards-blank-road-sign-png-image_6505418.png" position={[2,2, 4.8]} label="❌ Authorised Person only" />                                                    
                                                          
    </>
  );
}


function ResetCameraHelper({ trigger, controlsRef }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(-10, 20, 30));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const moving = useRef(false);

  useEffect(() => {
    if (trigger) {
      moving.current = true;
    }
  }, [trigger]);

  useFrame(() => {
    if (moving.current) {
      camera.position.lerp(targetPosition.current, 0.1);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 0.1);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(targetPosition.current) < 0.05) {
        camera.position.copy(targetPosition.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
        moving.current = false;
      }
    }
  });

  return null;
}

const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const locked = useRef(false);
  return (
    <CameraContext.Provider value={{ locked }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraLock = () => useContext(CameraContext);


function SkyBackground({ skyTextureUrl }) {
  const texture = useLoader(THREE.TextureLoader, skyTextureUrl);
  const sphereRef = useRef();

  return (
    <mesh ref={sphereRef} scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function AnimateCameraOnFullscreen({ isFullscreen }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isFullscreen) {
      // Start animation toward fullscreen target
      targetPosition.current.set(-10, 20, 30);
      isAnimating.current = true;
    }
  }, [isFullscreen]);

  useFrame(() => {
    if (isAnimating.current) {
      camera.position.lerp(targetPosition.current, 0.06);

      // Stop animation if close enough
      if (camera.position.distanceTo(targetPosition.current) < 0.1) {
        camera.position.copy(targetPosition.current);
        isAnimating.current = false;
      }
    }
  });

  return null;
}

export function WorkersGroup({ position = [0, 0, 0], workerCount = 5 }) {
  const workers = useMemo(() => {
    const workerArray = [];
    const radius = 3; // How far the workers stand from center

    for (let i = 0; i < workerCount; i++) {
      const angle = (i / workerCount) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const rotation = Math.random() * Math.PI * 2;

      workerArray.push({ position: [x, 0, z], rotation });
    }

    return workerArray;
  }, [workerCount]);

  return (
    <group position={position}>
      {workers.map((worker, idx) => (
        <GlbModel
          key={idx}
          path="a_chinese_worker_compressed.glb" // <- replace with your worker GLB path
          position={worker.position}
          rotation={[0, worker.rotation, 0]}
          scale={[0.0001, 0.0001, 0.0001]} // adjust size
        />
      ))}
    </group>
  );
}

export default function App1ferfaweft() {
  const controlsRef = useRef();
  const containerRef = useRef();
  const [resetCamera, setResetCamera] = useState(false);
  const [infoLabel, setInfoLabel] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleResetCamera = () => {
    setResetCamera(true);
    setTimeout(() => setResetCamera(false), 100);
  };

  const handleCircleClick = (label) => {
    setInfoLabel(label);
  };

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  return (
    <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      backgroundImage: `url('https://cdn.photoroom.com/v2/image-cache?path=gs://background-7ef44.appspot.com/backgrounds_v3/black/49_-_black.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      color: "#fff",
    }}
  >
      <div
  ref={containerRef}
  style={{
    width: isFullscreen ? "100vw" : "80vw",
    height: isFullscreen ? "100vh" : "80vh",
    position: "relative",
    borderRadius: isFullscreen ? 0 : "20px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    boxShadow: isFullscreen
      ? "none"
      : "0 20px 40px rgba(116, 183, 227, 0.6), inset 0 0 30px rgba(255, 0, 0, 0.03)",
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  }}
>
  {/* Rotating BG Layer */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "200%",
      height: "200%",
      backgroundImage: `url('https://c4.wallpaperflare.com/wallpaper/1015/775/768/sun-moon-planets-dark-wallpaper-preview.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      animation: "rotateBG 120s linear infinite",
      zIndex: 0,
      transformOrigin: "center center",
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      
    }}
  />

        {/* Overlay to trigger fullscreen */}
        {!isFullscreen && (
          <div
            onClick={enterFullscreen}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              cursor: "pointer",
              zIndex: 20,
              borderRadius: "20px",
            }}
          >
            Click to Enter Virtual Factory
          </div>
        )}

        {/* Exit Button */}
        {isFullscreen && (
          <button
            onClick={exitFullscreen}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 15,
              backgroundColor: "#FD3C3F",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            Exit Fullscreen
          </button>
        )}

        <CameraProvider>
          <Canvas camera={{ position: [-10, 20, 30], fov: 65 }} shadows>
          <OrbitControls
  ref={controlsRef}
  maxPolarAngle={Math.PI / 2}
  minPolarAngle={0}
  maxDistance={100}
  minDistance={4}
/>

            
            <AnimateCameraOnFullscreen isFullscreen={isFullscreen} />
            
            {/* Add Sky Background */}
            <SkyBackground skyTextureUrl='e8b2a4f993ff454189f950f94653a7c3.jpeg'/>

            <City controlsRef={controlsRef} onCircleClick={handleCircleClick} />
            <ResetCameraHelper trigger={resetCamera} controlsRef={controlsRef} />
            
          </Canvas>
        </CameraProvider>

        {/* Info Panel */}
        {infoLabel && (
  <div
    style={{
      position: "fixed",
      top: "10%",
      left: "10%",
      right:"10%",
      width: "80%",
      height: "80%",
      backgroundColor: "#CFE5EC",
      padding: "20px",
      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
      overflowY: "auto",
      zIndex: 1000,
      borderRadius: "10px",
    }}
  >
    <h2 style={{ marginTop: 0, textAlign: "center" }}>
      Information: {infoLabel}
    </h2>
    <div style={{ marginTop: "20px" }}>
      {infoLabel === "Receiving" && (
        <p>Room A is the main production area with advanced machinery.</p>
      )}
      {infoLabel === "Garden" && (
        <p>The Garden area features outdoor seating and greenery.</p>
      )}
      {infoLabel === "Warehouse" && (
        <p>The Warehouse stores raw materials and finished goods.</p>
      )}
      {/* Add more conditions here for different labels */}
      {!["Room A", "Garden", "Warehouse"].includes(infoLabel) && (
        <p>Details and data about <strong>{infoLabel}</strong> go here...</p>
      )}
    </div>
    <button
      onClick={() => setInfoLabel(null)}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "8px 12px",
        cursor: "pointer",
        boxShadow: "0px 0px 20px rgba(255, 0, 0, 0.5)",
      }}
    >
      Close
    </button>
  </div>
)}


        {/* Reset Button */}
        {isFullscreen && (
          <button
            onClick={handleResetCamera}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#FD3C3F",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0px 4px 12px rgba(255, 0, 0, 0.6)",
              zIndex: 10,
            }}
          >
            Reset View
          </button>
        )}
      </div>
    </div>
  );
}
