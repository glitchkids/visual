import { ImageProperties } from "@view/shared/components/image-properties";
import type { createBaseLayerConstructor } from "../layer";
import type { createTimelineReadOnlyConstructor } from "../timeline";

type TCreateBaseLayerConstructorDependencies = {
  BaseLayer: ReturnType<typeof createBaseLayerConstructor>;
  TimelineReadOnly: ReturnType<typeof createTimelineReadOnlyConstructor>;
};

export function createImageLayerConstructor({
  BaseLayer,
  TimelineReadOnly,
}: TCreateBaseLayerConstructorDependencies) {
  return class ImageLayer extends BaseLayer {
    #timeline!: InstanceType<typeof TimelineReadOnly>;
    #file!: File;
    #src!: string;
    #img: HTMLImageElement;

    constructor() {
      super();
      this.setName("MyImageLayer");
      this.#timeline = TimelineReadOnly.getInstance();
      this.#img = document.createElement("img");
    }
    getType() {
      return "ImageLayer";
    }
    getParams() {
      return [ImageProperties, ...(super.getParams ? super.getParams() : [])];
    }

    async setImage(file: File) {
      this.#file = file;
      this.#src = URL.createObjectURL(this.#file);
      const promise = new Promise((r) => {
        this.#img.onload = () => r(true);
      });
      this.#img.src = this.#src;
      return promise;
    }

    render() {
      const context = this.#timeline.getRenderContext();
      if (!context) return;

      context.drawImage(
        this.#img,
        this.getX(),
        this.getY(),
        this.getWidth(),
        this.getHeight()
      );
    }
  };
}
