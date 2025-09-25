<script module>
  import { CoreProvider } from "@view/shared/features/core-provider";
  import { CreateLayer } from "@view/features/create-layer";
  import { LayersManager } from "@view/features/layers-manager";
  import {
    Previsualizer,
    SoloPrevisualizerProvider,
  } from "@view/features/previsualizer";
  import { CanvasManager } from "@view/features/canvas-manager";
  import { createRawSnippet } from "svelte";
</script>

<SoloPrevisualizerProvider>
  <div class="flex h-screen">
    <CoreProvider>
      <div class="flex-col flex flex-8/12">
        <Previsualizer />
      </div>
      <div>
        <div class="tabs tabs-border">
          <input
            type="radio"
            name="config_tabs"
            class="tab flex-1"
            aria-label="Canvas"
          />
          <div class="tab-content p-6">
            <CanvasManager />
          </div>

          <input
            type="radio"
            name="config_tabs"
            class="tab flex-1"
            aria-label="Layers"
            checked
          />
          <div class="tab-content p-6">
            <CreateLayer />
            <LayersManager />
          </div>
        </div>
      </div>
    </CoreProvider>
  </div>
</SoloPrevisualizerProvider>
