<script module lang="ts">
  function toggleSoloPrevisualizer(
    soloPrevisualizer: ReturnType<typeof getSoloPrevisualizer>,
    layer
  ) {
    if (soloPrevisualizer.getCurrent() === layer) {
      soloPrevisualizer.clear();
      return;
    }
    soloPrevisualizer.setCurrent(layer);
  }
</script>

<script>
  import {
    CollapsibleContent,
    CollapsibleRoot,
    CollapsibleTitle,
  } from "@view/shared/components/collapsible";
  import { getTimelineReadOnly } from "@view/shared/features/core-provider";
  import { getSoloPrevisualizer } from "@view/features/previsualizer";

  const timelineReadOnly = getTimelineReadOnly();
  const soloPrevisualizer = getSoloPrevisualizer();

  const { layer, onDelete } = $props();
  function onChange() {
    timelineReadOnly.render();
  }
</script>

<CollapsibleRoot>
  <CollapsibleTitle>
    {layer.getType()} - {layer.getName()}
  </CollapsibleTitle>
  <CollapsibleContent>
    <div>
      {#if layer.hasSolo()}
        <button
          class="btn"
          onclick={() => toggleSoloPrevisualizer(soloPrevisualizer, layer)}
        >
          Solo
        </button>
      {/if}

      {#each layer.getParams().reverse() as ParamsComponent}
        <ParamsComponent item={layer} {onChange} />
      {/each}

      <button
        onclick={() => {
          layer.remove();
          onDelete();
        }}
      >
        Delete
      </button>
    </div>
  </CollapsibleContent>
</CollapsibleRoot>
