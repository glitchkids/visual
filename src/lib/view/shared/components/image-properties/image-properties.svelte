<script lang="ts">
  interface Props {
    item: {
      setImage(v: File): Promise<true>;
      hasImage(): number;
      clearImage(): void;
    };
    onChange?(): void;
  }
  let { item, onChange }: Props = $props();
  let files: FileList | null = $state(null);
</script>

<div>
  <p class="text-lg">Image</p>
  <input
    type="file"
    multiple={false}
    bind:files={
      () => files,
      async (v) => {
        files = v;
        if (files?.length === 0) return;

        await item.setImage(files?.item(0) as File);
        if (onChange) onChange();
      }
    }
  />
</div>
