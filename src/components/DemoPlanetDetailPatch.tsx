import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import {
  BufferAttribute,
  Color,
  PlaneGeometry,
  Vector3,
} from "three";
import {
  sampleDemoPlanetSurfaceAtPosition,
  writeDemoPlanetColor,
} from "./demoTerrain";

const TILE_SIZE = 8;
const TILE_OVERLAP = 0.48;
const TILE_SEGMENTS = 28;
const TILE_GRID_RADIUS = 2;
const TILE_SURFACE_OFFSET = 0.012;

const tileDirection = new Vector3();
const tileSurfaceNormal = new Vector3();
const tileColor = new Color();
const tileCenterPosition = new Vector3();
const tileFrameUp = new Vector3();
const tileFrameTangent = new Vector3();
const tileFrameBitangent = new Vector3();
const tileReference = new Vector3(0, 1, 0);
const tileReferenceFallback = new Vector3(1, 0, 0);
const playerTangent = new Vector3();
const playerBitangent = new Vector3();
const snappedTileAnchor = new Vector3();
const tileUpdateDelta = new Vector3();

function buildTileGeometry() {
  const geometry = new PlaneGeometry(
    TILE_SIZE + TILE_OVERLAP * 2,
    TILE_SIZE + TILE_OVERLAP * 2,
    TILE_SEGMENTS,
    TILE_SEGMENTS,
  );
  const vertexCount = (TILE_SEGMENTS + 1) * (TILE_SEGMENTS + 1);
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(vertexCount * 3), 3),
  );
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(vertexCount * 3), 3),
  );

  return geometry;
}

function getLocalSurfaceBasis(up: Vector3) {
  tileFrameUp.copy(up).normalize();
  if (Math.abs(tileFrameUp.dot(tileReference)) > 0.92) {
    tileFrameTangent.crossVectors(tileReferenceFallback, tileFrameUp);
  } else {
    tileFrameTangent.crossVectors(tileReference, tileFrameUp);
  }
  tileFrameTangent.normalize();
  tileFrameBitangent.crossVectors(tileFrameUp, tileFrameTangent).normalize();

  return {
    up: tileFrameUp,
    tangent: tileFrameTangent,
    bitangent: tileFrameBitangent,
  };
}

function writeTileGeometry(
  geometry: PlaneGeometry,
  tileCenter: Vector3,
  tangent: Vector3,
  bitangent: Vector3,
) {
  const positionAttribute = geometry.getAttribute("position") as BufferAttribute;
  const colorAttribute = geometry.getAttribute("color") as BufferAttribute;
  const positions = positionAttribute.array as Float32Array;
  const colors = colorAttribute.array as Float32Array;
  const stride = TILE_SEGMENTS + 1;
  const fullSize = TILE_SIZE + TILE_OVERLAP * 2;
  const halfSize = fullSize * 0.5;

  for (let row = 0; row <= TILE_SEGMENTS; row += 1) {
    const z = halfSize - (row / TILE_SEGMENTS) * fullSize;

    for (let column = 0; column <= TILE_SEGMENTS; column += 1) {
      const x = (column / TILE_SEGMENTS) * fullSize - halfSize;
      const index = row * stride + column;
      const offset = index * 3;

      tileDirection
        .copy(tileCenter)
        .addScaledVector(tangent, x)
        .addScaledVector(bitangent, z)
        .normalize();

        const surface = sampleDemoPlanetSurfaceAtPosition(tileDirection);
        tileSurfaceNormal.copy(surface.normal);
        const point = surface.point.addScaledVector(tileSurfaceNormal, TILE_SURFACE_OFFSET);

      positions[offset] = point.x;
      positions[offset + 1] = point.y;
      positions[offset + 2] = point.z;
    }
  }

  positionAttribute.needsUpdate = true;
  geometry.computeVertexNormals();

  const normalAttribute = geometry.getAttribute("normal") as BufferAttribute;
  const normals = normalAttribute.array as Float32Array;

  for (let row = 0; row <= TILE_SEGMENTS; row += 1) {
    for (let column = 0; column <= TILE_SEGMENTS; column += 1) {
      const index = row * stride + column;
      const offset = index * 3;

      tileDirection.set(positions[offset], positions[offset + 1], positions[offset + 2]).normalize();
      
      const nx = normals[offset];
      const ny = normals[offset + 1];
      const nz = normals[offset + 2];
      const slope = 1 - Math.max(0, nx * tileDirection.x + ny * tileDirection.y + nz * tileDirection.z);

      writeDemoPlanetColor(tileDirection, slope, tileColor);
      colors[offset] = tileColor.r;
      colors[offset + 1] = tileColor.g;
      colors[offset + 2] = tileColor.b;
    }
  }

  colorAttribute.needsUpdate = true;
}

export function DemoPlanetDetailPatch(props: {
  positionRef: MutableRefObject<Vector3>;
  upRef: MutableRefObject<Vector3>;
}) {
  const tiles = useMemo(() => {
    const items: Array<{
      key: string;
      geometry: PlaneGeometry;
      offsetX: number;
      offsetY: number;
    }> = [];

    for (let row = -TILE_GRID_RADIUS; row <= TILE_GRID_RADIUS; row += 1) {
      for (let column = -TILE_GRID_RADIUS; column <= TILE_GRID_RADIUS; column += 1) {
        items.push({
          key: `${column}:${row}`,
          geometry: buildTileGeometry(),
          offsetX: column,
          offsetY: row,
        });
      }
    }

    return items;
  }, []);
  const lastAnchorRef = useRef(new Vector3(Number.POSITIVE_INFINITY, 0, 0));

  useFrame(() => {
    const basis = getLocalSurfaceBasis(props.upRef.current);
    playerTangent.copy(basis.tangent);
    playerBitangent.copy(basis.bitangent);

    const tangentOffset = props.positionRef.current.dot(playerTangent);
    const bitangentOffset = props.positionRef.current.dot(playerBitangent);
    snappedTileAnchor
      .copy(props.positionRef.current)
      .addScaledVector(
        playerTangent,
        Math.round(tangentOffset / TILE_SIZE) * TILE_SIZE - tangentOffset,
      )
      .addScaledVector(
        playerBitangent,
        Math.round(bitangentOffset / TILE_SIZE) * TILE_SIZE - bitangentOffset,
      )
      .normalize()
      .multiplyScalar(props.positionRef.current.length());

    tileUpdateDelta.copy(snappedTileAnchor).sub(lastAnchorRef.current);
    if (tileUpdateDelta.lengthSq() < 0.01) {
      return;
    }

    lastAnchorRef.current.copy(snappedTileAnchor);

    for (const tile of tiles) {
      tileCenterPosition
        .copy(snappedTileAnchor)
        .addScaledVector(playerTangent, tile.offsetX * TILE_SIZE)
        .addScaledVector(playerBitangent, tile.offsetY * TILE_SIZE);

      writeTileGeometry(
        tile.geometry,
        tileCenterPosition,
        playerTangent,
        playerBitangent,
      );
    }
  });

  return (
    <>
      {tiles.map((tile) => (
        <mesh
          key={tile.key}
          geometry={tile.geometry}
          frustumCulled={false}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#ffffff"
            vertexColors
            metalness={0.02}
            roughness={0.96}
          />
        </mesh>
      ))}
    </>
  );
}
