<script lang="ts">
  interface Props {
    item: {
      setX(v: number): void;
      getX(): number;
      setY(v: number): void;
      getY(): number;
      isPositionLock(): boolean;
      togglePositionLock(): void;
    };
    onChange?(): void;
  }
  const { item, onChange }: Props = $props();
</script>

<div class="space-y-2">
  <p class="text-lg">Position</p>

  <div class="grid grid-cols-2 items-center">
    <label class="space-x-4">
      <p>x</p>
      <input
        class="w-10 font-medium"
        type="number"
        bind:value={
          () => item.getX(),
          (value) => {
            item.setX(value);
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
          () => item.getY(),
          (value) => {
            item.setY(value);
            if (onChange) onChange();
          }
        }
      />
    </label>
    <label class="space-x-4">
      <p>Lock position</p>
      <input
        class="w-10 font-medium"
        type="checkbox"
        bind:checked={
          () => item.isPositionLock(),
          () => {
            item.togglePositionLock();
            if (onChange) onChange();
          }
        }
      />
    </label>
  </div>
</div>
