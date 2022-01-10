import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { Triplet, useSphere } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Group, Raycaster, Vector3 } from "three";

import { PHYSICS_GROUPS, PUBLISH_INTERVAL, VOID_LEVEL } from "../../constants";
import { useSpringVelocity } from "./hooks/useSpringVelocity";

import KeyboardMovement from "./controls/KeyboardMovement";
import Crosshair from "./Crosshair";
import { ClientContext, MultiplayerContext } from "matrix";

const PLAYER_HEIGHT = 1.6;
const PLAYER_SPEED = 5;
const JUMP_STRENGTH = 3;
const SPHERE_RADIUS = 1;

const DOWN_VECTOR = new Vector3(0, -1, 0);
const HEIGHT_OFFSET = new Vector3(0, PLAYER_HEIGHT - SPHERE_RADIUS, 0);

interface Props {
  paused?: boolean;
  spawn?: Vector3;
  world: MutableRefObject<Group>;
}

export function Player({
  paused = false,
  spawn = new Vector3(0, 2, 0),
  world,
}: Props) {
  const args: [number] = [SPHERE_RADIUS];

  const { ymap } = useContext(MultiplayerContext);
  const { userId } = useContext(ClientContext);

  const downRay = useRef<undefined | Raycaster>();
  const crosshair = useRef<undefined | Group>();

  const jump = useRef(false);
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());

  const { camera } = useThree();

  const [ref, api] = useSphere(() => ({
    args,
    mass: 1,
    type: "Dynamic",
    position: spawn.toArray(),
    collisionFilterGroup: PHYSICS_GROUPS.PLAYER,
  }));

  const { direction, updateVelocity } = useSpringVelocity(api, PLAYER_SPEED);

  useEffect(() => {
    if (!ymap || !userId) return;

    function publishPosition() {
      ymap.set(userId, position.current.toArray());
    }

    api.position.subscribe((p: Triplet) => position.current.fromArray(p));
    api.velocity.subscribe((v: Triplet) => velocity.current.fromArray(v));

    const interval = setInterval(publishPosition, PUBLISH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [ymap, userId, api.position, api.velocity]);

  useFrame(() => {
    if (position.current.y < VOID_LEVEL) {
      api.position.copy(spawn);
    }

    //move camera
    camera.position.copy(position.current).add(HEIGHT_OFFSET);

    //move hud
    if (crosshair.current) {
      crosshair.current.rotation.copy(camera.rotation);
      crosshair.current.position.copy(camera.position);
    }

    //jumping
    if (downRay.current && world.current) {
      downRay.current.set(camera.position, DOWN_VECTOR);

      const intersects = downRay.current.intersectObject(world.current);
      const distance = intersects[0]?.distance;

      if (jump.current && distance < PLAYER_HEIGHT + 0.1) {
        velocity.current.y = JUMP_STRENGTH;
      }
    }

    //apply velocity
    updateVelocity(camera, velocity.current);
  });

  return (
    <group>
      <mesh ref={ref} />
      <raycaster ref={downRay} />

      <group ref={crosshair}>
        <Crosshair />
      </group>

      <KeyboardMovement paused={paused} direction={direction} jump={jump} />
      <PointerLockControls
        addEventListener={undefined}
        hasEventListener={undefined}
        removeEventListener={undefined}
        dispatchEvent={undefined}
      />
    </group>
  );
}
