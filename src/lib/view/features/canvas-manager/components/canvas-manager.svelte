<script>
  import { getTimeline } from "@view/shared/features/core-provider";
  import { SizeProperties } from "@view/shared/components/size-properties";
  import { ColorProperties } from "@view/shared/components/color-properties";

  const timeline = getTimeline();
</script>

<SizeProperties item={timeline} onChange={() => timeline.render()} />
<ColorProperties item={timeline} onChange={() => timeline.render()} />
