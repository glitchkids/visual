import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export class Exporter {
  static #instance: Exporter;
  static getInstance() {
    if (!this.#instance) this.#instance = new Exporter();
    return this.#instance;
  }

  #ffmpeg: FFmpeg;

  constructor() {
    this.#ffmpeg = new FFmpeg();
    this.#ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
  }

  async load() {
    await this.#ffmpeg.load({
      coreURL: await toBlobURL(
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js",
        "application/javascript"
      ),
      wasmURL: await toBlobURL(
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm",
        "application/wasm"
      ),
    });
  }

  getFFmpeg() {
    return this.#ffmpeg;
  }
}
