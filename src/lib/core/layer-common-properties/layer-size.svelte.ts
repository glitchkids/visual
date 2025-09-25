import { SizeProperties } from "@view/shared/components/size-properties";
import type { Constructor } from "../types";

export type TSize = { w: number; h: number };

export function applyLayerSizeMixin<T extends Constructor>(superclass: T) {
  return class extends superclass {
    #size: TSize = $state({ w: 40, h: 40 });
    #lock: number | null = $state(null);
    #isLock = $derived(this.#lock !== null);

    getWidth() {
      return this.#size.w;
    }
    setWidth(w: number) {
      if (!this.#isLock) this.#size.w = w;
      else {
        this.setSize({
          w,
          h: w / (this.#lock as number),
        });
      }
    }

    getHeight() {
      return this.#size.h;
    }
    setHeight(h: number) {
      if (!this.#isLock) this.#size.h = h;
      else {
        this.setSize({
          w: h * (this.#lock as number),
          h,
        });
      }
    }

    getSize() {
      return this.#size;
    }
    setSize(size: TSize) {
      this.#size = size;
    }

    #getLockRatio() {
      return this.#size.w / this.#size.h;
    }
    toggleRatioLock() {
      this.#lock = this.#lock ? null : this.#getLockRatio();
    }
    isRatioLock() {
      return this.#isLock;
    }
    getParams() {
      return [SizeProperties, ...(super.getParams ? super.getParams() : [])];
    }
  };
}
