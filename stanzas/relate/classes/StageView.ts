import CONF from "../conf.js";
import { HaplotypesView } from "./HaplotypesView";

class StageView {
  #el: HTMLElement;

  static #instance: StageView | null = null;

  static get instance() {
    return this.#instance;
  }

  static initialise(root: HTMLElement | null) {
    if (!root) {
      throw new Error("Root element not found");
    }

    if (this.#instance) {
      return this.#instance;
    } else {
      this.#instance = new StageView(root);
      this.#instance.init();
      return this.#instance;
    }
  }

  private constructor(root: HTMLElement) {
    this.#el = root.querySelector("#RelateViewer");
  }

  init() {
    this.#el.addEventListener("click", this.#handleDeselectAll);
    this.#el.addEventListener("select-haplotype", this.#handleClickHaplotype);
  }

  #handleDeselectAll = () => {
    HaplotypesView.instance.selectedIndices = [];
  };

  update() {
    this.#el.style.width = CONF.stageWidth + "px";
    this.#el.style.height = CONF.stageHeight + "px";
  }

  #handleClickHaplotype = (e) => {
    if (e.detail.shiftKey) {
      HaplotypesView.instance.selectedIndices = [
        ...HaplotypesView.instance.selectedIndices,
        ...e.detail.indexes,
      ];
    } else {
      HaplotypesView.instance.selectedIndices = e.detail.indexes;
    }
  };
}

export { StageView };
