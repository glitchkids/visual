import type { createBaseLayerConstructor } from "../layer";
import type { createTimelineReadOnlyConstructor } from "../timeline";
import { VideoProperties } from "@view/shared/components/video-properties";

type TCreateBaseLayerConstructorDependencies = {
  BaseLayer: ReturnType<typeof createBaseLayerConstructor>;
  TimelineReadOnly: ReturnType<typeof createTimelineReadOnlyConstructor>;
};

export function createVideoLayerConstructor({
  BaseLayer,
  TimelineReadOnly,
}: TCreateBaseLayerConstructorDependencies) {
  return class VideoLayer extends BaseLayer {
    #timeline!: InstanceType<typeof TimelineReadOnly>;
    #file!: File;
    #src!: string;
    #video: HTMLVideoElement;

    constructor() {
      super();
      this.setName("MyVideoLayer");
      this.#timeline = TimelineReadOnly.getInstance();
      this.#video = document.createElement("video");
      this.#video.loop = true;
      this.#video.volume = 0;
    }
    getType() {
      return "VideoLayer";
    }
    getParams() {
      return [VideoProperties, ...(super.getParams ? super.getParams() : [])];
    }

    async setVideo(file: File) {
      this.#file = file;
      this.#src = URL.createObjectURL(this.#file);
      const promise = new Promise((r) => {
        this.#video.onloadeddata = () => {
          this.setSize({
            h: this.#video.videoHeight,
            w: this.#video.videoWidth,
          });
          r(true);
        };
      });
      this.#video.src = this.#src;
      return promise;
    }

    render() {
      const context = this.#timeline.getRenderContext();
      if (!context || !this.#src) return;

      const { time, state } = this.#timeline.getTimelineContext();

      if (state === "stop") {
        if (!this.#video.paused) this.#video.pause();
        this.#video.currentTime = 0;
      }
      if (state === "pause") {
        if (!this.#video.paused) this.#video.pause();
      }
      if (state === "playing") {
        if (this.#video.paused) this.#video.play();
      }

      //   this.#video.currentTime = time % this.#video.duration;

      context.drawImage(
        this.#video,
        this.getX(),
        this.getY(),
        this.getWidth(),
        this.getHeight()
      );
    }
  };
}
