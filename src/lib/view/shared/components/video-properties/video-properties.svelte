<script lang="ts">
  interface Props {
    item: {
      setVideo(v: File): Promise<true>;
      hasVideo(): number;
      clearVideo(): void;
    };
    onChange?(): void;
  }
  let { item, onChange }: Props = $props();
  let files: FileList | null = $state(null);
</script>

<div>
  <p class="text-lg">Video</p>
  <input
    type="file"
    multiple={false}
    bind:files={
      () => files,
      async (v) => {
        files = v;
        if (files?.length === 0) return;

        await item.setVideo(files?.item(0) as File);
        if (onChange) onChange();
      }
    }
  />
</div>
