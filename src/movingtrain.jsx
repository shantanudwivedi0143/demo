import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function MovingTrain({ position = [0, 0, 0], ...props }) {
  const ref = useRef();
  const { scene } = useGLTF('/train.glb');

  const speed = 0.1;
  const loopLength = 100;
  const stopZ = 0;
  const pauseDuration = 10;

  const isPaused = useRef(false);
  const pauseStartTime = useRef(null);
  const hasStoppedOnce = useRef(false); // ✅ Added this

  useFrame(() => {
    if (!ref.current) return;

    const train = ref.current;
    const currentZ = train.position.z;

    // Handle pause
    if (isPaused.current) {
      const now = performance.now();
      if ((now - pauseStartTime.current) / 1000 >= pauseDuration) {
        isPaused.current = false;
      } else {
        return;
      }
    }

    // Only stop once at stopZ
    if (!hasStoppedOnce.current && Math.abs(currentZ - stopZ) < speed) {
      train.position.z = stopZ;
      isPaused.current = true;
      pauseStartTime.current = performance.now();
      hasStoppedOnce.current = true; // ✅ Don't stop again next loop
      return;
    }

    // Move
    train.position.z += speed;

    // Loop and reset stop flag
    if (train.position.z > position[2] + loopLength) {
      train.position.z = position[2];
      hasStoppedOnce.current = false; // ✅ Allow pause next cycle
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={props.scale || [1, 1, 1]}
    />
  );
}

export default MovingTrain;