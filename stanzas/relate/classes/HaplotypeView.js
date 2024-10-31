import { Dataset } from "./Dataset";
import CONF from "../conf.js";
import { createSVGElement } from "../util.js";
import { CheckboxInSVG } from "./SVGCheckbox.js";

export default class HaplotypeView {
  #el = document.createElementNS("http://www.w3.org/2000/svg", "g");
  #checkbox = null;

  /**
   * Constructor for the HaplotypeView class.
   * @param {object} params - Parameters for the HaplotypeView.
   * @param {number} params.unitHeight - The height of each unit in the view.
   * @param {string} params.haplotype - The haplotype identifier.
   * @param {object} params.ethnic - The ethnic information object.
   * @param {number} params.index - The index of the haplotype.
   * @param {array} params.regions - The array of regions to be visualized.
   */
  constructor({ unitHeight, haplotype, ethnic, index, regions }) {
    // Create an SVG group element (<g>) and set its attributes

    this.#el.setAttribute(
      "transform",
      `translate(0,${
        (CONF.haplotypeViewWidth + CONF.haplotypeViewGap) * index
      })`
    );
    this.#el.setAttribute("data-haplotype", haplotype);
    this.#el.setAttribute("data-index", index);
    this.#el.classList.add("haplotype-view");

    this.#el.addEventListener("change", this.#handleCheckboxChange);

    // Create a path element to represent mutations
    const path = createSVGElement("path", { "data-haplotype": haplotype });
    if (ethnic) {
      path.setAttribute("data-ethnic", ethnic.popname);
    }
    // Iterate over regions and create visual elements for each
    for (let regionIndex = 0; regionIndex < regions.length; regionIndex++) {
      const g = createSVGElement("g", { "data-region": regionIndex });
      const region = regions[regionIndex];

      // Draw background parallelogram for each region
      const bgPath = createSVGElement("rect", {
        x: region.start * unitHeight,
        y: 0,
        width: (region.end - region.start) * unitHeight,
        height: CONF.haplotypeViewWidth,
        class: "bg",
      });
      g.appendChild(bgPath);

      // Clone the path element and draw mutations for each region
      const path2 = path.cloneNode();
      let d = "";
      for (let i = region.start; i < region.end; i++) {
        if (Dataset.instance.mutationsByHaplotype[index][i] === 1) {
          const originalX = i * unitHeight;
          d += rectangle(originalX, 0, unitHeight, CONF.haplotypeViewWidth);
        }
      }
      path2.setAttribute("d", d);

      const isMutationInRegion =
        Dataset.instance.mutationsByHaplotype[index][region.start] === 1 &&
        Dataset.instance.mutationsByHaplotype[index][region.end - 1] === 1;

      if (isMutationInRegion) {
        path2.setAttribute("data-region", regionIndex);
      }
      g.appendChild(path2);
      g.setAttribute("data-region", regionIndex);
      this.#el.appendChild(g);
    }

    // Draw label for the haplotype
    const text = createSVGElement("text", {
      "text-anchor": "end",
      "dominant-baseline": "hanging",
    });

    text.innerHTML = ethnic
      ? `<tspan data-ethnic="${ethnic.popname}">${ethnic.popname}</tspan> <tspan>${ethnic.gpopname}</tspan> <tspan data-ethnic="${ethnic.popname}" class="haplotype" >${haplotype}</tspan>`
      : "";

    this.#checkbox = new CheckboxInSVG(this.#el, text);
  }

  #handleCheckboxChange = (e) => {
    e.stopPropagation();

    this.#dispatchEvent(e.detail.shiftKey);
  };

  get selected() {
    return this.#checkbox.checked;
  }

  set selected(value) {
    if (value) {
      this.#el.dataset.selected = "true";
    } else {
      delete this.#el.dataset.selected;
    }

    this.#checkbox.checked = value;
  }

  get index() {
    return parseInt(this.#el.dataset.index);
  }

  #dispatchEvent(shiftKey) {
    this.#el.dispatchEvent(
      new CustomEvent("select-haplotype", {
        detail: {
          indexes: [parseInt(this.#el.dataset.index)],
          shiftKey,
        },
        bubbles: true,
      })
    );
  }

  // Getter for the SVG group element
  get el() {
    return this.#el;
  }
}

/**
 * Function to create a rectangle path.
 * @param {number} x - The x-coordinate of the top-left corner.
 * @param {number} y - The y-coordinate of the top-left corner.
 * @param {number} width - The width of the parallelogram.
 * @param {number} height - The height of the parallelogram.
 * @returns {string} - The path data for the parallelogram.
 */
function rectangle(x, y, width, height) {
  return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${
    y + height
  } Z`;
}
