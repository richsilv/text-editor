import {
  $,
  component$,
  useSignal,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { useSelection } from "./hooks";
import styles from "./styles.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  const ref = useSignal<HTMLDivElement>();
  const state = useStore<{ bounds: Omit<DOMRectReadOnly, "toJSON"> | null }>({
    bounds: null,
  });

  useSelection(
    ref,
    $((selection) => {
      if (selection.rangeCount !== 1 || selection.isCollapsed) {
        state.bounds = null;
        return;
      }

      const range = selection.getRangeAt(0);
      const bounds = range.getBoundingClientRect();
      const rects = range.getClientRects();
      state.bounds =
        rects.length > 1 && rects.item(0)!.left > rects.item(1)!.right
          ? rects.item(1)!.toJSON()
          : bounds.toJSON();
    }),
    $(() => {
      state.bounds = null;
    })
  );

  return (
    <>
      <div className="text-editor" contentEditable="true" ref={ref}></div>
      <p>This is some non-interactive text. {state.bounds?.left}</p>
    </>
  );
});

export const head: DocumentHead = {
  title: "Text Editor",
};
