<script lang="ts">
  interface Props {
    item: { setColor(v: string): void; getColor(): string; clearColor(): void };
    onChange?(): void;
  }
  let { item, onChange }: Props = $props();
</script>

<div>
  <p class="text-lg">Color</p>
  {#if item.getColor()}
    <div class="grid grid-cols-2 items-center">
      <input
        type="color"
        class="w-24"
        bind:value={
          () => item.getColor(),
          (v) => {
            item.setColor(v);
            if (onChange) onChange();
          }
        }
      />
      <button
        class="btn"
        onclick={() => {
          item.clearColor();
          if (onChange) onChange();
        }}
      >
        Clear
      </button>
    </div>
  {:else}
    <button
      class="btn w-full"
      onclick={() => {
        item.setColor("#000000");
        if (onChange) onChange();
      }}
    >
      Pick Color
    </button>
  {/if}
</div>
