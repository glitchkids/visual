<script>
  const { children } = $props();
</script>

<div
  tabindex="0"
  class="collapse collapse-arrow bg-base-100 border-base-300 border"
>
  <input type="checkbox" />
  {@render children?.()}
</div>
