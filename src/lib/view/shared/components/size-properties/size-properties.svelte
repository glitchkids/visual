<script lang="ts">
  import type { TSize } from "@core/layer-common-properties";

  interface Props {
    item: {
      setWidth(w: number): void;
      getWidth(): number;
      setHeight(h: number): void;
      getHeight(): number;
      setSize(size: TSize): void;
      toggleRatioLock(): void;
      isRatioLock(): boolean;
    };
    onChange(): void;
  }
  let { item, onChange }: Props = $props();
</script>

<div class="space-y-2">
  <p class="text-lg">Size</p>

  <div class="grid grid-cols-3 items-center">
    <div class="space-x-4">
      <p>width</p>
      <input
        class="max-w-16 font-medium"
        type="number"
        bind:value={
          () => item.getWidth(),
          (w) => {
            item.setWidth(w);
            if (onChange) onChange();
          }
        }
      />
    </div>

    <div class="space-x-4">
      <p>height</p>
      <input
        class="max-w-16 font-medium"
        type="number"
        bind:value={
          () => item.getHeight(),
          (h) => {
            item.setHeight(h);
            if (onChange) onChange();
          }
        }
      />
    </div>

    <div>
      <p>aspect-ratio</p>
      <input
        type="checkbox"
        bind:checked={
          () => item.isRatioLock(),
          () => {
            item.toggleRatioLock();
            if (onChange) onChange();
          }
        }
      />
    </div>
  </div>
</div>
