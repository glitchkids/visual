import type { applyLayerColorMixin, TSize } from "../layer-common-properties";
import type { applyLayerAudioContextAmplitudeConstructor } from "../layer-audio-context";
import type { createBaseLayerConstructor } from "../layer";
import type { createTimelineReadOnlyConstructor } from "../timeline";
import * as THREE from "three";
import ScaleProperties from "@view/shared/components/scale-properties/scale-properties.svelte";

type TCreateAmplitudeCubeLayerConstructorDependencies = {
  applyLayerColorMixin: typeof applyLayerColorMixin;
  BaseLayer: ReturnType<typeof createBaseLayerConstructor>;
  TimelineReadOnly: ReturnType<typeof createTimelineReadOnlyConstructor>;
  applyLayerAudioContextAmplitudeConstructor: typeof applyLayerAudioContextAmplitudeConstructor;
};

export function createAmplitudeCubeLayerConstructor({
  BaseLayer,
  TimelineReadOnly,
  applyLayerColorMixin,
  applyLayerAudioContextAmplitudeConstructor,
}: TCreateAmplitudeCubeLayerConstructorDependencies) {
  return class AmplitudeCubeLayer extends applyLayerAudioContextAmplitudeConstructor(
    { TimelineReadOnly },
    applyLayerColorMixin(BaseLayer)
  ) {
    #timeline!: InstanceType<typeof TimelineReadOnly>;
    #canvas: HTMLCanvasElement;

    #scale = $state(1);

    #scene;
    #camera;
    #renderer;
    #cube;

    constructor() {
      super();
      this.setName("MyAmplitudeCube");
      this.#timeline = TimelineReadOnly.getInstance();

      this.#scene = new THREE.Scene();
      this.#scene.background = null;
      this.#camera = new THREE.PerspectiveCamera(75, 1);
      this.#renderer = new THREE.WebGLRenderer({ alpha: true });
      this.#canvas = this.#renderer.domElement;

      this.setSize({ h: 400, w: 400 });
      this.#resizeCanvas();
      this.processAudio();

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(this.getColor() as string),
      });

      this.#cube = new THREE.Mesh(geometry, material);
      this.#scene.add(this.#cube);
      this.#camera.position.z = 5;

      this.#renderer.render(this.#scene, this.#camera);
    }

    getParams() {
      return [ScaleProperties, ...(super.getParams ? super.getParams() : [])];
    }
    getCanvas() {
      return this.#canvas;
    }

    setColor(color: string): void {
      super.setColor(color);
      this.#cube.material.color = new THREE.Color(this.getColor() as string);
    }

    #resizeCanvas() {
      this.#renderer.setSize(this.getWidth(), this.getHeight());
      this.#camera.aspect = this.getWidth() / this.getHeight();
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

    setScale(s: number) {
      this.#scale = s;
    }
    getScale() {
      return this.#scale;
    }

    render() {
      const audioContext = this.getAudioContext();
      const context = this.#timeline.getRenderContext();
      if (!audioContext || !context) return;

      const { frame, duration, time } = this.#timeline.getTimelineContext();

      this.#cube.rotation.y = frame * 0.01;
      this.#renderer.render(this.#scene, this.#camera);

      const currentIndex = Math.floor((audioContext.length * time) / duration);
      const currentValue = audioContext[currentIndex] ?? 0.01;
      this.#cube.scale.set(
        this.#scale * currentValue,
        this.#scale * currentValue,
        this.#scale * currentValue
      );

      context.drawImage(
        this.#canvas,
        this.getX(),
        this.getY(),
        this.getWidth(),
        this.getHeight()
      );
    }
    getType() {
      return "AmplitudeCube";
    }
    hasSolo() {
      return true;
    }
  };
}
