<script lang="ts" module>
  import { getContext, setContext } from "svelte";
  import { FiniteStateMachine } from "runed";
  import { on } from "svelte/events";

  class DndRoot {
    stateMachine: FiniteStateMachine;

    #offGhostelementEvents: (() => void) | undefined;
    #clickOffset!: { x: number; y: number };
    ghostElement: HTMLElement | null = null;

    constructor() {
      this.stateMachine = new FiniteStateMachine("default", {
        default: {
          dragStart: () => "dragging",
        },
        dragging: {
          dragEnd: () => "default",
        },
      });
    }

    setGhostElement(
      div: HTMLDivElement,
      initialPosition: { x: number; y: number },
      clickPosition: { x: number; y: number }
    ) {
      console.log(initialPosition);
      const ghostElement = div.cloneNode(true) as HTMLDivElement;
      ghostElement.style.opacity = "80%";
      ghostElement.style.position = "fixed";
      ghostElement.style.zIndex = "900";
      ghostElement.style.top = initialPosition.y + "px";
      ghostElement.style.left = initialPosition.x + "px";
      ghostElement.style.pointerEvents = "none";
      ghostElement.classList.remove("relative");
      ghostElement.classList.remove("z-0");
      this.ghostElement = ghostElement;

      this.#clickOffset = {
        x: clickPosition.x - initialPosition.x,
        y: clickPosition.y - initialPosition.y,
      };
      this.#offGhostelementEvents = this.#createGhostElementEvent();
    }

    removeGhostElement() {
      if (this.#offGhostelementEvents) this.#offGhostelementEvents();
      if (!this.ghostElement) return;
      document.body.removeChild(this.ghostElement);
      this.ghostElement = null;
    }

    #createGhostElementEvent() {
      if (!this.ghostElement) return;

      document.body.appendChild(this.ghostElement);
      return on(document.body, "dragover", (e) => {
        this.ghostElement!.style.top = e.clientY - this.#clickOffset.y + "px";
        // this.ghostElement.style.left = e.clientX - this.#clickOffset.x + "px";
      });
    }
  }

  export const getDndRoot = () => getContext<DndRoot>("getDndRoot");
</script>

<script>
  const { children } = $props();

  const dndRoot = new DndRoot();
  setContext("getDndRoot", dndRoot);
</script>

<div class="p-4 flex flex-col gap-4">
  {@render children?.()}
</div>
