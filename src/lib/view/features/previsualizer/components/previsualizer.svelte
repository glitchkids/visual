<script module lang="ts">
  function getDirection(value: number) {
    return value > 0 ? "down" : "up";
  }
</script>

<script lang="ts">
  import {
    getLayerAggregator,
    getTimeline,
  } from "@view/shared/features/core-provider";
  import { getSoloPrevisualizer } from "@view/features/previsualizer";
  import { onMount, untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";

  let zoom = $state(0.2);

  const timeline = getTimeline();
  const layerAggregator = getLayerAggregator();
  const soloPrevisualizer = getSoloPrevisualizer();

  let audioEl: HTMLAudioElement;

  onMount(() => {
    timeline.setAudioElement(audioEl);
  });

  const appendPrevisualizerCanvas: Attachment = (element) => {
    if (element.children.length > 0) return;

    const canvas = document.createElement("canvas");
    timeline.setCanvas(canvas);
    element.appendChild(canvas);
    layerAggregator.renderAll();

    return () => {
      console.log("cleaning up");
    };
  };

  const appendSoloPrevisualizerCanvas: Attachment = (element) => {
    if (element.children.length > 0) return;
    const currentLayer = soloPrevisualizer.getCurrent();
    const canvas = currentLayer.getCanvas();
    element.appendChild(canvas);

    untrack(() => layerAggregator.renderAll());

    return () => {
      console.log("cleaning up");
    };
  };

  let files: FileList | null = $state(null);
</script>

<div class="relative h-full">
  <div
    class="flex h-full items-center justify-center relative"
    style:zoom
    onwheel={({ deltaY }) => {
      const direction = getDirection(deltaY);
      direction === "up" ? (zoom += 0.1) : (zoom -= 0.1);
    }}
  >
    {#if soloPrevisualizer.getCurrent()}
      <div
        {@attach appendSoloPrevisualizerCanvas}
        class="border-1 w-fit border-dashed border-neutral-900/5"
      ></div>
    {:else}
      <div
        {@attach appendPrevisualizerCanvas}
        class="border-1 w-fit border-dashed border-neutral-900/5"
      ></div>
    {/if}
  </div>

  <div class="absolute left-0 bottom-0 w-full h-10 bg-violet-50">
    <button class="btn" onclick={() => timeline.play()}> play </button>
    <button class="btn" onclick={() => timeline.pause()}> pause </button>
    <button class="btn" onclick={() => timeline.stop()}> stop </button>
    <button class="btn" onclick={() => timeline.exportAnimation()}>
      Export
    </button>
    <audio bind:this={audioEl}></audio>
    {timeline.getFrame()}
    <input
      type="file"
      bind:files={
        () => files,
        (f) => {
          files = f;
          if (files && files.length > 0)
            timeline.setFile(files?.item(0) as File);
        }
      }
      multiple={false}
    />
  </div>
</div>
