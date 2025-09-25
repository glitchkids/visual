import { createTimelineReadOnlyConstructor } from "@core/timeline";
import type { Constructor } from "@core/types";

type TApplyLayerAudioContextAmplitudeMixin = {
  TimelineReadOnly: ReturnType<typeof createTimelineReadOnlyConstructor>;
};
export function applyLayerAudioContextAmplitudeConstructor<
  T extends Constructor
>({ TimelineReadOnly }: TApplyLayerAudioContextAmplitudeMixin, superclass: T) {
  return class extends superclass {
    #timelineReadOnly: InstanceType<typeof TimelineReadOnly>;
    constructor(...args: any[]) {
      super(...args);
      this.#timelineReadOnly = TimelineReadOnly.getInstance();
    }

    #amplitudes: { real: number[]; absolute: number[] } | undefined;
    #chunksSize = $state(512);
    #getAmplitudes: "real" | "absolute" = $state("absolute");

    async processAudio() {
      const audioBuffer = this.#timelineReadOnly.getAudioBuffer();
      this.#amplitudes = AudioDataProcessorAmplitudeUtils.process(
        audioBuffer,
        this.#chunksSize
      );
    }
    toggleAmplitudeData() {
      this.#getAmplitudes =
        this.#getAmplitudes === "real" ? "absolute" : "real";
    }
    getAmplitudeTransformType() {
      return this.#getAmplitudes;
    }
    getAudioContext() {
      if (!this.#amplitudes) return this.#amplitudes;
      return this.#amplitudes[this.#getAmplitudes];
    }
  };
}

class AudioDataProcessorAmplitudeUtils {
  static process(audioBuffer: AudioBuffer, chunkSize = 512) {
    const channels = this.#processAudioChannel(audioBuffer);
    const chunks = this.#processChannelToChunks(channels, chunkSize);
    return this.#processChunksAmplitude(chunks);
  }

  static #processAudioChannel(audioBuffer: AudioBuffer) {
    if (!audioBuffer) return new Float32Array();

    const numberOfChannels = audioBuffer.numberOfChannels;
    return audioBuffer.getChannelData(0);

    // if (numberOfChannels === 1)
    // TODO Handle multi channel ?
    // Make average of channel data per index
    const channels: Float32Array<ArrayBuffer>[] = [];
    for (let i = 0; i < numberOfChannels; i++) {
      const channel = audioBuffer.getChannelData(i);
      channels.push(channel);
    }
    const averageChannel = new Float32Array(audioBuffer.length);
    for (let i = 0; i < numberOfChannels; i++) {
      const channel = audioBuffer.getChannelData(i);
      channels.push(channel);
    }
    for (let i = 0; i < audioBuffer.length; i++) {
      const sum = Array(numberOfChannels).reduce(
        (sum, _, j) => (sum += channels[i][j]),
        0
      );
      const average = sum / numberOfChannels;
      averageChannel.set([average]);
    }
    return averageChannel;
  }

  static #processChannelToChunks(
    arrayBuffer: Float32Array<ArrayBuffer>,
    chunksSize = 512
  ) {
    const arrayBufferChunks = [];

    let end = false;
    let index = 0;
    while (!end) {
      if (chunksSize * index > arrayBuffer.length) {
        end = true;
        continue;
      }

      const offset =
        chunksSize * index + chunksSize > arrayBuffer.length
          ? arrayBuffer.length - chunksSize * index
          : chunksSize;
      const subArray = arrayBuffer.slice(
        chunksSize * index,
        chunksSize * index + offset
      );
      arrayBufferChunks.push(subArray);

      index++;
    }

    return arrayBufferChunks;
  }

  static #processChunksAmplitude(
    audioChannelChunks: Float32Array<ArrayBuffer>[]
  ) {
    if (!audioChannelChunks) return undefined;
    let min = 0;
    let max = 0;
    const real = audioChannelChunks
      // Average
      .map((chunk) => {
        const sum = chunk.reduce((sum, curr) => (sum += curr), 0);
        const value = parseFloat((sum / chunk?.length).toFixed(2));
        if (value > 0) max = value > max ? value : max;
        if (value < 0) min = Math.abs(value) > min ? Math.abs(value) : min;
        return value;
      })
      // Normalize
      .map((v) => (v > 0 ? v / max : v / min));
    max = 0;
    const absolute = audioChannelChunks
      // Average
      .map((chunk) => {
        const sum = chunk.reduce((sum, curr) => (sum += Math.abs(curr)), 0);
        const value = parseFloat((sum / chunk?.length).toFixed(2));
        max = value > max ? value : max;
        return value;
      })
      // Normalize
      .map((v) => v / max);

    return {
      real,
      absolute,
    };
  }
}
