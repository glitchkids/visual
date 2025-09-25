import type {
  applyLayerPositionMixin,
  applyLayerSizeMixin,
} from "../layer-common-properties";
import type { applyLayerCommonStrategyMixin } from "../layer-common-strategy/layer-common-strategy";
import type { LayerAggregator } from "./layer-aggregator.svelte";

type TCreateBaseLayerDependencies = {
  applyLayerCommonStrategyMixin: typeof applyLayerCommonStrategyMixin;
  applyLayerPositionMixin: typeof applyLayerPositionMixin;
  applyLayerSizeMixin: typeof applyLayerSizeMixin;
  LayerAggregator: typeof LayerAggregator;
};
export function createBaseLayerConstructor({
  applyLayerCommonStrategyMixin,
  applyLayerPositionMixin,
  applyLayerSizeMixin,
  LayerAggregator,
}: TCreateBaseLayerDependencies) {
  return applyLayerCommonStrategyMixin(
    { LayerAggregator },
    applyLayerSizeMixin(
      applyLayerPositionMixin(
        class BaseLayer {
          #name: string = $state("Layer");
          #id: string;

          constructor() {
            this.#id = crypto.randomUUID();
          }

          setName(name: string) {
            this.#name = name;
          }
          getName() {
            return this.#name;
          }
          getId() {
            return this.#id;
          }
          hasSolo() {
            return false;
          }
        }
      )
    )
  );
}
