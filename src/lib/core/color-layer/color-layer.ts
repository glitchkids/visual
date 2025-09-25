import type { applyLayerColorMixin } from "../layer-common-properties";
import type { createBaseLayerConstructor } from "../layer";
import type { createTimelineReadOnlyConstructor } from "../timeline";

type TCreateBaseLayerConstructorDependencies = {
  applyLayerColorMixin: typeof applyLayerColorMixin;
  BaseLayer: ReturnType<typeof createBaseLayerConstructor>;
  TimelineReadOnly: ReturnType<typeof createTimelineReadOnlyConstructor>;
};

export function createColorLayerConstructor({
  BaseLayer,
  TimelineReadOnly,
  applyLayerColorMixin,
}: TCreateBaseLayerConstructorDependencies) {
  return class ColorLayer extends applyLayerColorMixin(BaseLayer) {
    #timeline!: InstanceType<typeof TimelineReadOnly>;

    constructor() {
      super();
      this.setName("MyColorLayer");
      this.#timeline = TimelineReadOnly.getInstance();
    }
    getType() {
      return "Color";
    }

    render() {
      const context = this.#timeline.getRenderContext();
      if (!context) return;
      if (!this.getColor()) return;

      context.fillStyle = this.getColor() as string;
      context.fillRect(
        this.getX(),
        this.getY(),
        this.getWidth(),
        this.getHeight()
      );
    }
  };
}
