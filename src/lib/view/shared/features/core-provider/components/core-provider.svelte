<script module lang="ts">
  // Layer
  import { createColorLayerConstructor } from "@core/color-layer";
  import { createAmplitudeBarLayerConstructor } from "@core/amplitude-bar-layer";
  import { createAmplitudeCubeLayerConstructor } from "@core/amplitude-cube-layer";
  import { createImageLayerConstructor } from "@core/image-layer";
  import { createVideoLayerConstructor } from "@core/video-layer";
  // end Layer

  import { applyLayerAudioContextAmplitudeConstructor } from "@core/layer-audio-context";
  import {
    createLayerFactory,
    createBaseLayerConstructor,
    LayerAggregator,
  } from "@core/layer";
  import {
    applyLayerColorMixin,
    applyLayerPositionMixin,
    applyLayerSizeMixin,
  } from "@core/layer-common-properties";
  import { applyLayerCommonStrategyMixin } from "@core/layer-common-strategy";
  import {
    createTimelineConstructor,
    createTimelineReadOnlyConstructor,
  } from "@core/timeline";
  import { getContext, setContext } from "svelte";

  const Timeline = createTimelineConstructor({ LayerAggregator });
  const TimelineReadOnly = createTimelineReadOnlyConstructor({ Timeline });

  // Layer
  const BaseLayer = createBaseLayerConstructor({
    applyLayerPositionMixin,
    applyLayerSizeMixin,
    applyLayerCommonStrategyMixin,
    LayerAggregator,
  });
  const ColorLayer = createColorLayerConstructor({
    BaseLayer,
    applyLayerColorMixin,
    TimelineReadOnly,
  });
  const AmplitudeBarLayer = createAmplitudeBarLayerConstructor({
    BaseLayer,
    TimelineReadOnly,
    applyLayerAudioContextAmplitudeConstructor,
    applyLayerColorMixin,
  });
  const AmplitudeCubeLayer = createAmplitudeCubeLayerConstructor({
    applyLayerAudioContextAmplitudeConstructor,
    applyLayerColorMixin,
    BaseLayer,
    TimelineReadOnly,
  });
  const ImageLayer = createImageLayerConstructor({
    BaseLayer,
    TimelineReadOnly,
  });
  const VideoLayer = createVideoLayerConstructor({
    BaseLayer,
    TimelineReadOnly,
  });
  //
  const LayerFactory = createLayerFactory({
    ColorLayer,
    AmplitudeBarLayer,
    AmplitudeCubeLayer,
    ImageLayer,
    VideoLayer,
  });

  // Context
  export const getLayerFactory = () =>
    getContext<InstanceType<typeof LayerFactory>>("LayerFactory");
  export const getLayerAggregator = () =>
    getContext<InstanceType<typeof LayerAggregator>>("LayerAggregator");
  export const getTimeline = () =>
    getContext<InstanceType<typeof Timeline>>("Timeline");
  export const getTimelineReadOnly = () =>
    getContext<InstanceType<typeof TimelineReadOnly>>("TimelineReadOnly");
</script>

<script>
  setContext("LayerFactory", LayerFactory.getInstance());
  setContext("LayerAggregator", LayerAggregator.getInstance());
  setContext("Timeline", Timeline.getInstance());
  setContext("TimelineReadOnly", TimelineReadOnly.getInstance());

  const { children } = $props();
</script>

{@render children?.()}
