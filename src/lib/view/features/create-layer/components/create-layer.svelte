<script lang="ts">
  import {
    getLayerFactory,
    getLayerAggregator,
    getTimelineReadOnly,
  } from "@view/shared/features/core-provider";

  const layerFactory = getLayerFactory();
  const layerAggregator = getLayerAggregator();
  const timelineReadOnly = getTimelineReadOnly();

  function createLayer(type: string) {
    const layer = layerFactory.create(type);
    layerAggregator.add(layer);
    timelineReadOnly.render();
  }
</script>

<div class="dropdown w-full mb-4">
  <div tabindex="0" role="button" class="btn w-full">Add layer</div>
  <ul
    class="menu dropdown-content bg-base-100 rounded-box z-1 w-full p-2 shadow-sm"
  >
    {#each layerFactory.getAllName() as name (name)}
      <li>
        <button onclick={() => createLayer(name)}>
          {name}
        </button>
      </li>
    {/each}
  </ul>
</div>
