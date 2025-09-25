import type { LayerAggregator } from "../layer/layer-aggregator.svelte";
import type { Constructor } from "../types";

type TLayerCommonStrategyDependencies = {
  LayerAggregator: typeof LayerAggregator;
};

export function applyLayerCommonStrategyMixin<T extends Constructor>(
  { LayerAggregator }: TLayerCommonStrategyDependencies,
  superclass: T
) {
  return class extends superclass {
    #layerAggregator: LayerAggregator;

    constructor(...args: any[]) {
      super(...args);
      this.#layerAggregator = LayerAggregator.getInstance();
    }

    setZIndexPosition(index: number) {
      this.#layerAggregator.setZIndexPosition(this, index);
    }
    remove() {
      this.#layerAggregator.remove(this);
    }
  };
}
