import type { applyLayerColorMixin, TSize } from "../layer-common-properties";
import type { applyLayerAudioContextAmplitudeConstructor } from "../layer-audio-context";
import type { createBaseLayerConstructor } from "../layer";
import type { createTimelineReadOnlyConstructor } from "../timeline";
import { AmplitudeZoomProperties } from "@view/shared/components/amplitude-zoom-properties";

type TCreateBaseLayerConstructorDependencies = {
  applyLayerColorMixin: typeof applyLayerColorMixin;
  BaseLayer: ReturnType<typeof createBaseLayerConstructor>;
  TimelineReadOnly: ReturnType<typeof createTimelineReadOnlyConstructor>;
  applyLayerAudioContextAmplitudeConstructor: typeof applyLayerAudioContextAmplitudeConstructor;
};

export function createAmplitudeBarLayerConstructor({
  BaseLayer,
  TimelineReadOnly,
  applyLayerColorMixin,
  applyLayerAudioContextAmplitudeConstructor,
}: TCreateBaseLayerConstructorDependencies) {
  return class AmplitudeBarLayer extends applyLayerAudioContextAmplitudeConstructor(
    { TimelineReadOnly },
    applyLayerColorMixin(BaseLayer)
  ) {
    #timeline!: InstanceType<typeof TimelineReadOnly>;
    #canvas: HTMLCanvasElement;

    #zoomAmplitude = $state({ y: 100, x: 5 });

    constructor() {
      super();
      this.setName("MyAmplitudeBar");
      this.#timeline = TimelineReadOnly.getInstance();
      this.#canvas = document.createElement("canvas");

      this.setSize({ h: 100, w: 400 });
      this.#resizeCanvas();
      this.processAudio();
    }

    getCanvas() {
      return this.#canvas;
    }

    #resizeCanvas() {
      this.#canvas.width = this.getWidth();
      this.#canvas.height = this.getHeight();
    }
    setSize(size: TSize): void {
      super.setSize(size);
      this.#resizeCanvas();
    }
    setHeight(h: number): void {
      super.setHeight(h);
      this.#resizeCanvas();
    }
    setWidth(w: number): void {
      super.setWidth(w);
      this.#resizeCanvas();
    }

    setZoomAmplitudeX(x: number) {
      this.#zoomAmplitude.x = x;
    }
    getZoomAmplitudeX() {
      return this.#zoomAmplitude.x;
    }
    setZoomAmplitudeY(y: number) {
      this.#zoomAmplitude.y = y;
    }
    getZoomAmplitudeY() {
      return this.#zoomAmplitude.y;
    }

    render() {
      const audioContext = this.getAudioContext();
      const internalCanvasContext = this.#canvas.getContext("2d");
      const context = this.#timeline.getRenderContext();
      if (!audioContext || !internalCanvasContext || !context) return;

      internalCanvasContext.clearRect(0, 0, this.getWidth(), this.getHeight());
      internalCanvasContext.fillStyle = this.getColor() ?? "";

      const { duration, time } = this.#timeline.getTimelineContext();

      const timeRatio = time / duration;
      const offset =
        -(timeRatio * audioContext.length * this.#zoomAmplitude.x) +
        this.#canvas.width / 2;

      audioContext.forEach((v, i) => {
        if (i % 2 === 1) return;
        const height = (v ?? 0.01) * this.#zoomAmplitude.y;
        internalCanvasContext.beginPath();
        internalCanvasContext.roundRect(
          i * this.#zoomAmplitude.x + offset,
          (this.getHeight() - height) / 2,
          this.#zoomAmplitude.x,
          height,
          2
        );
        internalCanvasContext.fill();
        internalCanvasContext.closePath();
      });
      context.drawImage(
        this.#canvas,
        this.getX(),
        this.getY(),
        this.getWidth(),
        this.getHeight()
      );
    }
    getType() {
      return "AmplitudeBar";
    }
    hasSolo() {
      return true;
    }
    getParams() {
      return [
        AmplitudeZoomProperties,
        ...(super.getParams ? super.getParams() : []),
      ];
    }
  };
}
