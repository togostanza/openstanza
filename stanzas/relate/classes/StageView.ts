import { Conf } from "../conf";
import { HaplotypesView } from "./HaplotypesView";

class StageView {
  #el: HTMLElement;

  static #instance: StageView | null = null;

  static get instance() {
    if (!this.#instance) {
      throw new Error("StageView not initialised");
    }
    return this.#instance;
  }

  static initialise(root: HTMLElement | null) {
    if (!root) {
      throw new Error("Root element not found");
    }

    this.#instance = new StageView(root);
    this.#instance.init();
    return this.#instance;
  }

  private constructor(root: HTMLElement) {
    this.#el = root.querySelector("#RelateViewer")!;
  }

  init() {
    this.#el.addEventListener("click", this.#handleDeselectAll);
    this.#el.addEventListener("select-haplotype", this.#handleClickHaplotype);
  }

  #handleDeselectAll = () => {
    HaplotypesView.instance!.selectedIndices = [];
  };

  update() {
    this.#el.style.width = Conf.instance.stageWidth + "px";
    this.#el.style.height = Conf.instance.stageHeight + "px";
  }

  #handleClickHaplotype = (e: any) => {
    if (e.detail.shiftKey) {
      HaplotypesView.instance!.selectedIndices = [
        ...HaplotypesView.instance!.selectedIndices,
        ...e.detail.indexes,
      ];
    } else {
      HaplotypesView.instance!.selectedIndices = e.detail.indexes;
    }
  };
}

export { StageView };
