<script lang="ts">
  import {
    getLayerAggregator,
    getTimelineReadOnly,
  } from "@view/shared/features/core-provider";
  import LayerManager from "./layer-manager.svelte";

  const layerAggregator = getLayerAggregator();
  const timelineReadOnly = getTimelineReadOnly();
</script>

<div class="space-y-2">
  {#each layerAggregator.getAll() as layer (layer.getId())}
    <LayerManager
      {layer}
      onDelete={() => {
        timelineReadOnly.render();
      }}
    />
  {/each}
</div>
