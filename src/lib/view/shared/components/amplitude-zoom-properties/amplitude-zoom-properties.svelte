<script lang="ts">
  interface Props {
    item: {
      setZoomAmplitudeX(v: number): void;
      getZoomAmplitudeX(): number;
      setZoomAmplitudeY(v: number): void;
      getZoomAmplitudeY(): number;
      getAmplitudeTransformType(): string;
      toggleAmplitudeData(): void;
    };
    onChange?(): void;
  }
  const { item, onChange }: Props = $props();
</script>

<div class="space-y-2">
  <p class="text-lg">Amplitude</p>

  <div class="grid grid-cols-2 items-center">
    <label class="space-x-4">
      <p>Zoom X</p>
      <input
        class="w-10 font-medium"
        type="number"
        bind:value={
          () => item.getZoomAmplitudeX(),
          (value) => {
            item.setZoomAmplitudeX(value);
            if (onChange) onChange();
          }
        }
      />
    </label>
    <label class="space-x-4">
      <p>y</p>
      <input
        class="w-10 font-medium"
        type="number"
        bind:value={
          () => item.getZoomAmplitudeY(),
          (value) => {
            item.setZoomAmplitudeY(value);
            if (onChange) onChange();
          }
        }
      />
    </label>
    <label class="space-x-4">
      <p>
        Type of transform : {item.getAmplitudeTransformType()}
      </p>
      <button
        class="btn"
        onclick={() => {
          item.toggleAmplitudeData();
        }}
      >
        Toggle
      </button>
    </label>
  </div>
</div>
