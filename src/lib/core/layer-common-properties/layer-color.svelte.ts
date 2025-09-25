import type { Constructor } from "../types";
import { ColorProperties } from "@view/shared/components/color-properties";
export type TColor = string | null;

export function applyLayerColorMixin<T extends Constructor>(superclass: T) {
  return class extends superclass {
    #color: TColor = $state("#000000");

    getColor() {
      return this.#color;
    }
    setColor(color: string) {
      this.#color = color;
    }
    clearColor() {
      this.#color = null;
    }
    getParams() {
      return [ColorProperties, ...(super.getParams ? super.getParams() : [])];
    }
  };
}
