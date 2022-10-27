import { QRL, Signal, useClientEffect$ } from "@builder.io/qwik";

export function useSelection(
  ref: Signal<HTMLElement | undefined>,
  callback: QRL<(selection: Selection) => void>,
  onRemove?: QRL<() => void>
) {
  useClientEffect$(() => {
    const selectionChangeHandler = () => {
      const selection = document.getSelection();
      if (!ref.value || !selection?.containsNode(ref.value, true)) {
        document.removeEventListener("selectionchange", selectionChangeHandler);
        onRemove && onRemove();
        return;
      }

      callback(selection);
    };
    const selectStartHandler = () => {
      document.addEventListener("selectionchange", selectionChangeHandler);
    };
    ref.value?.addEventListener("selectstart", selectStartHandler);

    return () => {
      ref.value?.removeEventListener("selectstart", selectStartHandler);
      document.removeEventListener("selectionchange", selectionChangeHandler);
      onRemove && onRemove();
    };
  });
}
