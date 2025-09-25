import { PositionProperties } from "@view/shared/components/position-properties";
import type { Constructor } from "../types";
export type TPosition = { x: number; y: number };

export function applyLayerPositionMixin<T extends Constructor>(superclass: T) {
  return class extends superclass {
    #position: TPosition = $state({ x: 0, y: 0 });
    #lock: boolean = $state(false);

    getX() {
      return this.#position.x;
    }
    setX(x: number) {
      if (this.#lock) return;
      this.#position.x = x;
    }

    getY() {
      return this.#position.y;
    }
    setY(y: number) {
      if (this.#lock) return;
      this.#position.y = y;
    }

    getPosition() {
      return this.#position;
    }
    setPosition(position: TPosition) {
      if (this.#lock) return;
      this.#position = position;
    }

    togglePositionLock() {
      this.#lock = !this.#lock;
    }
    isPositionLock() {
      return this.#lock;
    }
    getParams() {
      return [
        PositionProperties,
        ...(super.getParams ? super.getParams() : []),
      ];
    }
  };
}
