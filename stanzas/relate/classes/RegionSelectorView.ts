import { Dataset } from "./Dataset";
import { DendrogramView } from "./DendrogramView.js";
import CONF from "../conf.js";
import { createSVGElement } from "../util.js";

const INDICATOR_WIDTH = 10;

class RegionSelectorView {
  #el: HTMLElement;
  #RelateViewer: HTMLElement;
  #style: HTMLStyleElement;
  #totalWidth = 0;
  static #instance: RegionSelectorView | null = null;

  private constructor(root: HTMLElement) {
    this.#el = root.querySelector("#RegionSelectorView")!;
    this.#RelateViewer = root.querySelector("#RelateViewer")!;
    this.#style = document.createElement("style");
  }

  static initialise(root: HTMLElement) {
    this.#instance = new RegionSelectorView(root);
    this.#instance.init();
    return this.#instance;
  }

  static get instance() {
    if (!this.#instance) {
      throw new Error("RegionSelectorView not initialised");
    }
    return this.#instance;
  }

  /**
   * Initialize the RegionSelectorView.
   * Binds the SVG element and sets its initial transform attribute.
   */
  private init() {
    this.#el.setAttribute("transform", `translate(0 ${CONF.mutationTop})`);
    document.head.appendChild(this.#style);
  }

  /**
   * Clear the SVG element content.
   */
  clear() {
    this.#el.innerHTML = "";
  }

  /**
   * Draw the region selector and scale based on the current dataset.
   */
  draw() {
    this.clear(); // Clear existing content

    const unitWidth = CONF.mutationWidth / Dataset.instance.mutations.length;
    let d = "";
    const fragment = new DocumentFragment();
    const regionIndicatorTemplate = createRegionIndicatorTemplate();
    this.#totalWidth = 0;

    const haplotypesHeight = CONF.innerHeight;
    const ancestors = Dataset.instance.ancestors;

    ancestors.forEach((ancestor, i) => {
      // get start and end positions
      // get middle of the region (x2, y2)

      const x1 = CONF.stagePadding.left + ancestor.region.start * unitWidth;
      const x3 = CONF.stagePadding.left + ancestor.region.end * unitWidth;
      const x2 = (x1 + x3) * 0.5;

      // Add border line
      d += `M ${x3} ${0} L ${x3} ${haplotypesHeight} `;

      // Add region selector
      const regionIndicator = regionIndicatorTemplate.cloneNode(
        true
      ) as Element;
      const path = regionIndicator.querySelector("path");
      this.#totalWidth = Math.max(this.#totalWidth + INDICATOR_WIDTH, x2);

      path?.setAttribute("d", `M ${x2} 0 L ${this.#totalWidth} -20`);

      const text = regionIndicator.querySelector("text")!;
      text.setAttribute(
        "transform",
        `translate(${this.#totalWidth} -20) rotate(-90)`
      );
      text.innerHTML = `<tspan>${i}</tspan><tspan> ${ancestor.region.start}-${ancestor.region.end}</tspan>`;

      // Add data-region attribute
      regionIndicator.setAttribute("data-region", `${i}`);

      // Add click event listener to show dendrogram
      regionIndicator.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.#RelateViewer.dataset.selectedRegion === `${i}`) {
          this.#RelateViewer.dataset.selectedRegion = "";
          this.#RelateViewer.classList.remove("-selectedregion");
          DendrogramView.instance?.clear();
          DendrogramView.instance?.moveLabelsBack();
        } else {
          this.#RelateViewer.dataset.selectedRegion = `${i}`;
          this.#RelateViewer.classList.add("-selectedregion");
          DendrogramView.instance?.draw(i, x3 - CONF.stagePadding.left);
        }
      });

      fragment.appendChild(regionIndicator);
    });

    const pathElement = createSVGElement("path", { d, class: "scale" });
    this.#el.appendChild(pathElement);
    this.#el.appendChild(fragment);

    // Generate dynamic CSS for hover effects
    this.generateDynamicCSS(ancestors);
  }

  /**
   * Generate dynamic CSS for hover effects on region elements.
   * @param {Array} ancestors - The list of ancestors with regions.
   */
  generateDynamicCSS(ancestors: any) {
    if (!this.#style || !this.#style.sheet) return;

    while (this.#style.sheet.cssRules?.length > 0) {
      this.#style.sheet.deleteRule(0);
    }
    const sheet = this.#style.sheet;

    ancestors.forEach((_: any, i: number) => {
      sheet?.insertRule(`
        #RelateViewer:has(.region-indicator-view[data-region="${i}"]:hover), #RelateViewer[data-selected-region="${i}"] {
          .haplotype-view > g[data-region="${i}"],
          .region-indicator-view[data-region="${i}"] {
            opacity: 1;
          }
        }
      `);
    });
  }

  /**
   * Get the total height of the region selector view.
   * @returns {number} The total height.
   */
  get width() {
    return this.#totalWidth;
  }
}

/**
 * Create a template for the region indicator.
 * @returns {SVGElement} The region indicator template.
 */
function createRegionIndicatorTemplate() {
  const g = createSVGElement("g", { class: "region-indicator-view" });
  g.innerHTML = "<path></path><text text-anchor='end'></text>";
  return g;
}

export { RegionSelectorView };
