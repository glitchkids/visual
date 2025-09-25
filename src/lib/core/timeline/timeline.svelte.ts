import {
  applyLayerColorMixin,
  applyLayerSizeMixin,
  type TSize,
} from "@core/layer-common-properties";
import type { Constructor } from "../types";
import { LayerAggregator } from "@core/layer";
import { on } from "svelte/events";

type TApplyAudioHandlerMixinDependencies = {
  LayerAggregator: typeof LayerAggregator;
};
function applyAudioHandlerMixin<T extends Constructor>(
  { LayerAggregator }: TApplyAudioHandlerMixinDependencies,
  superclass: T
) {
  return class extends superclass {
    #file: File | null = $state(null);
    #src!: string;
    #audioBuffer!: AudioBuffer;
    #audioElement!: HTMLAudioElement;

    #layerAggregator: LayerAggregator;
    constructor(...args: any[]) {
      super(...args);
      this.#layerAggregator = LayerAggregator.getInstance();
    }

    async setFile(file: File) {
      if (this.#src) URL.revokeObjectURL(this.#src);
      this.#file = file;
      this.#src = URL.createObjectURL(this.#file);
      const arrayBuffer = await this.#file.arrayBuffer();
      this.#audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);
      this.#audioElement.src = this.#src;
      await this.#layerAggregator.processAudioAll();
    }
    getSource() {
      return this.#src;
    }
    getFileName() {
      if (!this.#file) return "";
      return this.#file.name;
    }
    getAudioBuffer() {
      return this.#audioBuffer;
    }
    getFile() {
      return this.#file ?? null;
    }
    getAudioTrack() {
      return this.#audioElement.getTra;
    }

    setAudioElement(audioElement: HTMLAudioElement) {
      this.#audioElement = audioElement;
    }
    play() {
      this.#audioElement.play();
    }
    pause() {
      this.#audioElement.pause();
    }
    stop() {
      this.pause();
      this.setTime(0);
    }
    setTime(time: number) {
      if (time > this.#audioElement.duration) return;
      this.#audioElement.currentTime = time;
    }
    getTime() {
      return this.#audioElement.currentTime;
    }
    getDuration() {
      return this.#audioElement.duration;
    }
  };
}

type TApplyCanvasMixinDependencies = {
  LayerAggregator: typeof LayerAggregator;
};
function createBaseCanvasContructor({
  LayerAggregator,
}: TApplyCanvasMixinDependencies) {
  return class BaseCanvas extends applyLayerSizeMixin(
    applyLayerColorMixin(class {})
  ) {
    #canvas!: HTMLCanvasElement;
    #layerAggregator: LayerAggregator;

    constructor() {
      super();
      this.#layerAggregator = LayerAggregator.getInstance();
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

    #setEvents() {
      on(this.#canvas, "");
    }

    setCanvas(canvas: HTMLCanvasElement) {
      this.#canvas = canvas;
      this.#setEvents();
      this.setSize({ h: 1920, w: 1080 });
      this.render();
    }
    getRenderContext() {
      return this.#canvas.getContext("2d");
    }
    render() {
      const context = this.getRenderContext();
      if (!context) return;
      context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
      if (this.getColor()) {
        context.fillStyle = this.getColor() as string;
        context.fillRect(0, 0, this.getWidth(), this.getHeight());
      }
      this.#layerAggregator.renderAll();
    }
    getStream() {
      return this.#canvas.captureStream(60);
    }
  };
}

type TCreateTimelineConstructorDependencies = {
  LayerAggregator: typeof LayerAggregator;
};
export function createTimelineConstructor({
  LayerAggregator,
}: TCreateTimelineConstructorDependencies) {
  const BaseCanvas = createBaseCanvasContructor({ LayerAggregator });
  return class Timeline extends applyAudioHandlerMixin(
    { LayerAggregator },
    BaseCanvas
  ) {
    static #instance: Timeline;
    static getInstance() {
      if (!this.#instance) this.#instance = new Timeline();
      return this.#instance;
    }

    #frame = $state(0);
    #frameInterval = 1000 / 60;

    #startTime = 0;
    #timeNow = 0;
    #timeThen = 0;
    #elapsedTime = 0;

    #state: "playing" | "pause" | "stop" = "stop";

    #animate() {
      if (this.#state === "stop") return;
      if (this.#state === "pause") return;

      requestAnimationFrame(this.#animate.bind(this));
      this.#timeNow = performance.now();
      this.#elapsedTime = this.#timeNow - this.#timeThen;

      if (this.#elapsedTime > this.#frameInterval) {
        this.#timeThen =
          this.#timeNow - (this.#elapsedTime % this.#frameInterval);
        this.#frame++;

        this.render();
      }
    }

    play() {
      if (this.#state === "playing") return;
      this.#state = "playing";

      this.#timeThen = performance.now();
      this.#startTime = this.#timeThen;

      this.#animate();
      super.play();
    }
    pause(): void {
      if (this.#state === "pause" || this.#state === "stop") return;
      super.pause();
      this.#state = "pause";
    }
    stop() {
      super.stop();
      this.#state = "stop";
      this.#frame = 0;
      this.#timeNow = 0;
      this.render();
    }

    getTimelineContext() {
      return {
        state: this.#state,
        frame: this.#frame,
        time: this.getTime(),
        duration: this.getDuration(),
      };
    }
    getFrame() {
      return this.#frame;
    }

    // renderAnimation() {
    //   this.stop();
    //   const stream = this.getStream();
    //   // stream.addTrack();
    //   this.play();

    //   const recorder = new MediaRecorder(stream, {
    //     mimeType: "video/mp4",
    //   });

    //   recorder.recorder.ondataavailable = (evt) => {
    //     console.log(evt);
    //   };
    // }
  };
}

type TCreateTimelineReadOnlyDependencies = {
  Timeline: ReturnType<typeof createTimelineConstructor>;
};
export function createTimelineReadOnlyConstructor({
  Timeline,
}: TCreateTimelineReadOnlyDependencies) {
  return class TimelineReadOnly {
    static #instance: TimelineReadOnly;
    static getInstance() {
      if (!this.#instance) this.#instance = new TimelineReadOnly();
      return this.#instance;
    }

    #timeline: InstanceType<ReturnType<typeof createTimelineConstructor>>;
    constructor() {
      this.#timeline = Timeline.getInstance();
    }

    getTimelineContext() {
      return this.#timeline.getTimelineContext();
    }
    getRenderContext() {
      return this.#timeline.getRenderContext();
    }
    getTime() {
      return this.#timeline.getTime();
    }
    getDuration() {
      return this.#timeline.getDuration();
    }
    getAudioBuffer() {
      return this.#timeline.getAudioBuffer();
    }
    render() {
      return this.#timeline.render();
    }
  };
}

export class CanvasEventsUtils {
  static #clickOffset = { x: 0, y: 0 };
  static #isPointerDown = false;
  static #selectedLayer: BaseLayer | null = null;

  static #isInboundWidth(clickPosition: TPosition, layer: BaseLayer) {
    return (
      clickPosition.x > layer.getPositionProperties().getX() &&
      clickPosition.x <
        layer.getPositionProperties().getX() +
          layer.getSizeProperties().getWidth()
    );
  }
  static #isInboundHeight(clickPosition: TPosition, layer: BaseLayer) {
    return (
      clickPosition.y > layer.getPositionProperties().getY() &&
      clickPosition.y <
        layer.getPositionProperties().getY() +
          layer.getSizeProperties().getHeight()
    );
  }
  static #isLayerInbound(clickPosition: TPosition, layer: BaseLayer) {
    return (
      CanvasEventsUtils.#isInboundWidth(clickPosition, layer) &&
      CanvasEventsUtils.#isInboundHeight(clickPosition, layer)
    );
  }

  static #findSelectedLayer(layers: BaseLayer[], clickPosition: TPosition) {
    const layerSelected = layers
      .filter((layer) => !layer.getPositionProperties().isLock())
      .filter((layer) =>
        CanvasEventsUtils.#isLayerInbound(clickPosition, layer)
      )
      .at(-1);

    if (!layerSelected) {
      CanvasEventsUtils.#selectedLayer = null;
      return;
    }

    CanvasEventsUtils.#selectedLayer = layerSelected;
    CanvasEventsUtils.#clickOffset.x =
      clickPosition.x -
      CanvasEventsUtils.#selectedLayer.getPositionProperties().getX();
    CanvasEventsUtils.#clickOffset.y =
      clickPosition.y -
      CanvasEventsUtils.#selectedLayer.getPositionProperties().getY();
  }

  static setOnClick(canvas: CanvasEventsUtils, t, layers: BaseLayer[]) {
    // return canvas.addEvent("click", ({ offsetX, offsetY }) => {
    //   CanvasEventsUtils.#findSelectedLayer(layers, { x: offsetX, y: offsetY });
    // });
  }

  static setOnPointerDown(canvas: Canvas, layers: BaseLayer[]) {
    // return canvas.addEvent("pointerdown", ({ offsetX, offsetY }) => {
    //   CanvasEventsUtils.#isPointerDown = true;
    //   CanvasEventsUtils.#findSelectedLayer(layers, { x: offsetX, y: offsetY });
    // });
  }

  static setOnPointerUp(canvas: Canvas) {
    // return canvas.addEvent("pointerup", () => {
    //   this.#isPointerDown = false;
    // });
  }

  static setOnMouseMove(canvas: Canvas, layerManager: LayersManager) {
    // canvas.addEvent("mousemove", ({ offsetX: x, offsetY: y }) => {
    //   if (!CanvasEventsUtils.#isPointerDown) return;
    //   if (!CanvasEventsUtils.#selectedLayer) return;
    //   CanvasEventsUtils.#selectedLayer.getPositionProperties().setPosition({
    //     x: Math.round(x - this.#clickOffset.x),
    //     y: Math.round(y - this.#clickOffset.y),
    //   });
    //   layerManager.renderAll();
    // });
  }
}
