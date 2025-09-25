<script lang="ts">
  interface Props {
    item: { setScale(v: number): void; getScale(): number };
    onChange?(): void;
  }
  let { item, onChange }: Props = $props();
</script>

<div>
  <p class="text-lg">Scale</p>
  <input
    type="number"
    bind:value={
      () => item.getScale(),
      (v) => {
        item.setScale(v);
        if (onChange) onChange();
      }
    }
  />
</div>
