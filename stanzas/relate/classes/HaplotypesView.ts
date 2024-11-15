import { Dataset } from "./Dataset";
import { HaploEthnicities } from "./HaploEthnicities";
import HaplotypeView from "./HaplotypeView";
import CONF from "../conf.js";

class HaplotypesView {
  #el: HTMLElement;
  #haplotypeViews: HaplotypeView[] = [];
  #selectedIndices: number[] = [];

  static #instance: HaplotypesView | null = null;

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
      this.#instance = new HaplotypesView(root);
      return this.#instance;
    }
  }

  private constructor(root: HTMLElement) {
    this.#el = root.querySelector("#HaplotypesView")!;
  }

  clear() {
    this.#el.innerHTML = "";
    this.#haplotypeViews = [];
  }

  draw() {
    // empty
    this.clear();

    const unitHeight = CONF.mutationWidth / Dataset.instance.mutations.length;
    this.#el.setAttributeNS(
      null,
      "transform",
      `translate(${CONF.stagePadding.left}, ${CONF.stagePadding.top})`,
    );

    // Draw mutations
    const regions = CONF.regions;

    for (let i = 0; i < Dataset.instance.haplotypes.length; i++) {
      const haplotype = Dataset.instance.haplotypes[i];
      const ethnic = HaploEthnicities.instance.getSample(haplotype);
      const haplotypeView = new HaplotypeView({
        unitHeight,
        haplotype,
        ethnic,
        index: i,
        regions,
      });
      this.#haplotypeViews.push(haplotypeView);
      this.#el.appendChild(haplotypeView.el);
    }
  }

  get selectedIndices() {
    return this.#selectedIndices;
  }

  set selectedIndices(indexes) {
    this.#selectedIndices = indexes;

    this.#haplotypeViews.forEach((haplotypeView, index) => {
      haplotypeView.selected = indexes.includes(index);
    });
  }
}

export { HaplotypesView };
