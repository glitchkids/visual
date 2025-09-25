<script module lang="ts">
  import { getContext, setContext } from "svelte";

  class SoloPrevisualizer {
    #current: any | undefined = $state(undefined);

    setCurrent(layer: any) {
      this.#current = layer;
    }
    getCurrent() {
      return this.#current;
    }
    clear() {
      this.#current = undefined;
    }
  }
  const soloPrevisualizer = new SoloPrevisualizer();

  export const getSoloPrevisualizer = () =>
    getContext<SoloPrevisualizer>("SoloPrevisualizer");
</script>

<script>
  const { children } = $props();

  setContext("SoloPrevisualizer", soloPrevisualizer);
</script>

{@render children?.()}
