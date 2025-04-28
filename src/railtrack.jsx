import React from 'react';

function RailTrack({
  position = [0, 0, 0],
  length = 20,
  sleeperCount = 10,
  railSpacing = 1.2,
  sleeperSpacing = 2,
}) {
  const sleepers = [];

  for (let i = 0; i < sleeperCount; i++) {
    sleepers.push(
      <mesh
        key={i}
        position={[0, 0, -length / 2 + i * sleeperSpacing]} // 🛠️ Fixed position
      >
        <boxGeometry args={[railSpacing + 0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#6e4b28" />
      </mesh>
    );
  }

  return (
    <group position={position}>
      {/* Left Rail */}
      <mesh position={[-railSpacing / 2, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, length]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Right Rail */}
      <mesh position={[railSpacing / 2, 0.1, 0]}>
        <boxGeometry args={[0.1, 0.2, length]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Sleepers */}
      {sleepers}
    </group>
  );
}

export default RailTrack;
