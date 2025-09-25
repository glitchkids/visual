<script module>
  const bamboozleImage = new Image();
</script>

<script lang="ts">
  import { getDndRoot } from "./dnd-root.svelte";
  import { FiniteStateMachine } from "runed";

  const dndRoot = getDndRoot();
  let element = $state() as HTMLDivElement;

  type MyStates = "default" | "dragging" | "dragover";
  type MyEvents = "dragStart" | "dragEnd" | "dragEnter" | "dragLeave" | "drop";
  const fsmDnD = new FiniteStateMachine<MyStates, MyEvents>("default", {
    default: {
      dragStart: (...args) => {
        const event = args[0] as DragEvent;
        event.dataTransfer!.setDragImage(bamboozleImage, 0, 0);
        event.dataTransfer!.setData("application/gk-dnd", "yes");
        return "dragging";
      },
      dragEnter: () => {
        return "dragover";
      },
    },
    dragging: {
      _enter: ({ args }) => {
        const event = args[0] as DragEvent;
        const bcr = element.getBoundingClientRect();
        dndRoot.setGhostElement(
          element,
          { x: bcr.x, y: bcr.y },
          { x: event.clientX, y: event.clientY }
        );
      },
      _exit: () => {
        dndRoot.removeGhostElement();
      },
      dragEnd: () => {
        dndRoot.stateMachine.send("dragEnd");
        return "default";
      },
    },
    dragover: {
      dragLeave: () => {
        return "default";
      },
      drop: () => {
        return "default";
      },
    },
  });

  const { children } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={[
    fsmDnD.current === "default" && "relative",
    fsmDnD.current === "dragging" && "opacity-0",
    fsmDnD.current === "dragover" && "opacity-50",
  ]}
>
  <div
    ondragenter={(event) => {
      console.log("enter");
      event.stopPropagation();
      fsmDnD.send("dragEnter");
    }}
    ondragleave={(event) => {
      fsmDnD.send("dragLeave");
    }}
    ondrop={(event) => {
      fsmDnD.send("drop");
    }}
    class={[
      dndRoot.stateMachine.current === "dragging" &&
      fsmDnD.current !== "dragging"
        ? "absolute"
        : "hidden",
      "inset-0 z-5",
    ]}
  ></div>
  <div class="relative z-0 flex items-center">
    <div class="flex-1" bind:this={element}>
      {@render children?.()}
    </div>

    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div
      class="size-10 bg-blue-500"
      draggable="true"
      ondragstart={(event) => {
        fsmDnD.send("dragStart", event);
        dndRoot.stateMachine.send("dragStart");
      }}
      ondrag={(e) => {
        // document.body.classList.add("grabbing");
      }}
      ondragend={(event) => {
        fsmDnD.send("dragEnd");
      }}
    />
  </div>
</div>
