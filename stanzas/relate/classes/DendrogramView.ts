import { Dataset } from "./Dataset";
import { HaploEthnicities } from "./HaploEthnicities";
import CONF from "../conf.js";
import { createSVGElement } from "../util.js";
import { Tooltip } from "./Tooltip";

const numberFormatter = new Intl.NumberFormat("en-US");

function debounce(
  func: (...args: any[]) => any,
  wait: number,
  immediate?: boolean,
) {
  let timeout;
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

class DendrogramView {
  #el: SVGGElement | null = null;
  #RelateViewer: SVGElement | null = null;
  #inner = document.createElementNS("http://www.w3.org/2000/svg", "g");
  #grid = document.createElementNS("http://www.w3.org/2000/svg", "g");

  #container: HTMLElement | null = null;

  #gridN = 5;

  #gridLabelYMargin = 8;

  #x0 = null;

  static #instance: DendrogramView | null = null;

  static get instance() {
    return this.#instance;
  }

  static initialise(root: HTMLElement) {
    if (!this.#instance) {
      this.#instance = new DendrogramView(root);
      this.#instance.init();
    }
    return this.#instance;
  }

  private constructor(root: HTMLElement) {
    this.#el = root.querySelector("#DendrogramView");
    this.#RelateViewer = root.querySelector("#RelateViewer");
    this.#container = this.#el.closest("#Container");

    Tooltip.initialise(this.#container);
  }
  /**
   * Initialize the DendrogramView.
   * Sets the initial transform attribute for the SVG element.
   */
  init() {
    this.#el.setAttributeNS(
      null,
      "transform",
      `translate(${CONF.stagePadding.left}, ${CONF.haplotypeViewWidth / 2})`,
    );
    this.#el.appendChild(this.#inner);

    this.#grid.setAttribute(
      "transform",
      `translate(0, ${CONF.stagePadding.top - CONF.haplotypeViewWidth / 2})`,
    );
    this.#grid.style.pointerEvents = "none";

    this.#el.appendChild(this.#grid);

    this.#inner.addEventListener("click", this.#handleBranchClick);

    this.#inner.addEventListener("mouseover", this.#handleBranchHover);

    this.#inner.addEventListener("mouseout", this.#handleBranchUnhover);

    this.#container.addEventListener(
      "scroll",
      debounce(this.#updateLabelsPositions, 300),
    );

    this.#inner.addEventListener("mouseover", this.#handleMutationHover);
    this.#inner.addEventListener("mouseout", this.#handleMutationUnhover);
  }

  #handleBranchClick = (e) => {
    e.stopPropagation();

    if (
      e.target.tagName === "rect" &&
      e.target.dataset.type === "click-handle"
    ) {
      const leaves = Dataset.instance.getLeafBranches(e.target.branch);
      const branchIds = leaves.map((leaf) => leaf.branchId);

      this.#el.dispatchEvent(
        new CustomEvent("select-haplotype", {
          detail: { shiftKey: e.shiftKey, indexes: branchIds },
          bubbles: true,
        }),
      );
    }
  };

  #handleBranchHover = (e) => {
    if (
      e.target.tagName === "rect" &&
      e.target.dataset.type === "click-handle"
    ) {
      const decendants = Dataset.instance.getDescendantsBranches(
        e.target.branch,
      );
      decendants.forEach((branch) => {
        branch.line.classList.add("-hovered");
        if (branch.beam) {
          branch.beam.classList.add("-hovered");
        }
      });
    }
  };

  #handleBranchUnhover = (e) => {
    if (
      e.target.tagName === "rect" &&
      e.target.dataset.type === "click-handle"
    ) {
      const decendants = Dataset.instance.getDescendantsBranches(
        e.target.branch,
      );
      decendants.forEach((branch) => {
        branch.line.classList.remove("-hovered");
        if (branch.beam) {
          branch.beam.classList.remove("-hovered");
        }
      });
    }
  };

  #handleMutationHover = (e) => {
    if (e.target.tagName !== "circle" || !e.target.mutation) {
      return;
    }

    const mutation = e.target.mutation;

    const x = e.target.cx.baseVal.value;
    const y = e.target.cy.baseVal.value;

    Tooltip.instance.show(
      `Alleles: ${mutation.alleles.join(", ")}\nPosition: ${mutation.snp}`,
      x + CONF.stagePadding.left,
      y + CONF.haplotypeViewWidth / 2,
    );
  };

  #handleMutationUnhover = (e) => {
    if (e.target.tagName !== "circle" || !e.target.mutation) {
      return;
    }
    Tooltip.instance.hide();
  };

  /**
   * Clear the SVG element content.
   */
  clear() {
    this.#inner.innerHTML = "";
    this.#grid.innerHTML = "";
  }

  /**
   * Move labels closer to the branch positions.
   * @param {*} terminalBranches
   */
  moveLabels(terminalBranches) {
    // Move label positions to branch positions
    window.requestAnimationFrame(() => {
      const selectedRegion = this.#RelateViewer.dataset.selectedRegion;
      let textX = 0;

      for (let i = 0; i < terminalBranches.length; i++) {
        const branch = terminalBranches[i];

        const g = this.#RelateViewer.querySelector(
          `#HaplotypesView > g[data-index="${branch.line.dataset.branchId}"]`,
        );

        if (i === 0) {
          const bgRect = g.querySelector(
            `g[data-region="${selectedRegion}"] > rect.bg`,
          );
          //@ts-ignore
          textX = bgRect.x.baseVal.value;
        }

        const checkbox = g.querySelector("g.checkbox");
        checkbox.setAttribute("transform", `translate(${textX - 4}, 0)`);

        g.setAttribute(
          "transform",
          `translate(0 , ${
            +branch.line.dataset.index *
            (CONF.haplotypeViewWidth + CONF.haplotypeViewGap)
          })`,
        );
      }
    });
  }

  /**
   * Return the labels to their original positions
   */
  moveLabelsBack() {
    window.requestAnimationFrame(() => {
      const haplotypes = Dataset.instance.haplotypes;
      for (let i = 0; i < haplotypes.length; i++) {
        const g = this.#RelateViewer.querySelector(
          `#HaplotypesView > g[data-index="${i}"]`,
        );
        const checkbox = g.querySelector("g.checkbox");
        checkbox.setAttribute("transform", `translate(-4, 0)`);

        g.setAttribute(
          "transform",
          `translate(0 , ${
            i * (CONF.haplotypeViewWidth + CONF.haplotypeViewGap)
          })`,
        );
      }
    });
  }

  /**
   * Draw the dendrogram based on the specified tree index.
   * @param  treeIndex - The index of the tree to draw.
   * @param  x0 - X coordinate of the dendrogram base
   */
  draw(treeIndex: number, x0: number) {
    this.#x0 = x0;
    this.clear(); // Clear existing content

    // Get the selected tree
    const tree = Dataset.instance.ancestors[treeIndex].branches;

    // Get the terminal branches (bottom branches)
    const rootBranch = tree.find((branch) => branch.parentBranchId === -1);
    const terminalBranches = Dataset.instance.getLeafBranches(rootBranch);

    this.moveLabels(terminalBranches);

    // Calculate overall length of the tree
    let branch = terminalBranches[0];
    let overAllLength = branch.distance;
    while (true) {
      const parentBranch = tree.find(
        (parentBranch) => parentBranch.branchId === branch.parentBranchId,
      );
      if (!parentBranch) {
        break;
      }
      overAllLength += parentBranch.distance;
      branch = parentBranch;
    }

    // Clear the SVG element
    while (this.#inner.firstChild) {
      this.#inner.removeChild(this.#inner.firstChild);
    }

    // Draw the dendrogram
    // const minGap = CONF.innerWidth / Dataset.instance.haplotypes.length;
    const hRatio = CONF.clusterWidth / overAllLength;

    this.addGridlines(
      hRatio,
      x0,
      overAllLength,
      (CONF.haplotypeViewWidth + CONF.haplotypeViewGap) *
        terminalBranches.length,
    );

    const drawnBranches = [];
    const existingSiblingBranches = [];

    // Draw terminal branches

    for (let i = 0; i < terminalBranches.length; i++) {
      const branch = terminalBranches[i];

      const haplotype = Dataset.instance.haplotypes[branch.branchId];

      const ethnic = HaploEthnicities.instance.getSample(haplotype);

      const y =
        CONF.stagePadding.top +
        (CONF.haplotypeViewWidth + CONF.haplotypeViewGap) * i;

      const line = createSVGElement("line", {
        x1: x0,
        y1: y,
        x2: x0 + branch.distance * hRatio,
        y2: y,
        "data-index": i,
        "data-branch-id": branch.branchId,
        "data-parent-branch-id": branch.parentBranchId,
        "data-ethnic": ethnic?.popname,
      });
      line.ethnic = ethnic;
      this.#inner.appendChild(line);
      branch.line = line;

      const siblingBranch = drawnBranches.find(
        (drawnBranch) => drawnBranch.parentBranchId === branch.parentBranchId,
      );
      if (siblingBranch) {
        existingSiblingBranches.push(siblingBranch);
      }
      drawnBranches.push(branch);
    }

    // Draw other branches

    const undrawnBranches = [...tree];
    // Remove terminal branches from undrawnBranches
    for (const terminalBranch of terminalBranches) {
      const index = undrawnBranches.findIndex(
        (branch) => branch.branchId === terminalBranch.branchId,
      );
      undrawnBranches.splice(index, 1);
    }

    while (true) {
      const childBranches = [existingSiblingBranches.shift()];
      if (!childBranches[0]) {
        break;
      }
      childBranches.push(
        drawnBranches.find(
          (branch) =>
            branch.parentBranchId === childBranches[0].parentBranchId &&
            branch.branchId !== childBranches[0].branchId,
        ),
      );
      const ethnic =
        childBranches[0].line.ethnic &&
        childBranches[0].line.ethnic.popname ===
          childBranches[1].line.ethnic?.popname
          ? childBranches[0].line.ethnic
          : undefined;

      const branch = tree.find(
        (branch) => branch.branchId === childBranches[0].parentBranchId,
      );

      // Draw branch
      const x = childBranches[0].line.x2.baseVal.value;

      const y =
        (childBranches[0].line.y2.baseVal.value +
          childBranches[1].line.y2.baseVal.value) /
        2;
      const beam = createSVGElement("line", {
        x1: childBranches[0].line.x2.baseVal.value,
        y1: childBranches[0].line.y1.baseVal.value,
        x2: childBranches[1].line.x2.baseVal.value,
        y2: childBranches[1].line.y1.baseVal.value,
      });

      this.#inner.appendChild(beam);

      const line = createSVGElement("line", {
        x1: x,
        y1: y,
        x2: x + branch.distance * hRatio,
        y2: y,
        "data-branch-id": branch.branchId,
        "data-parent-branch-id": branch.parentBranchId,
        "data-ethnic": ethnic?.popname,
      });

      const clickHandle = createSVGElement("rect", {
        x,
        y: y - 1.5,
        width: branch.distance * hRatio,
        height: 3,
        fill: "transparent",
        "data-type": "click-handle",
        "data-branch-id": branch.branchId,
        "data-parent-branch-id": branch.parentBranchId,
        "data-ethnic": ethnic?.popname,
      });

      clickHandle.branch = branch;
      line.ethnic = ethnic;
      this.#inner.appendChild(line);
      this.#inner.appendChild(clickHandle);
      branch.line = line;
      branch.beam = beam;

      const siblingBranche = drawnBranches.find(
        (drawnBranche) => drawnBranche.parentBranchId === branch.parentBranchId,
      );
      if (siblingBranche) {
        existingSiblingBranches.push(siblingBranche);
      }
      drawnBranches.push(branch);
      // Remove from undrawnBranches and existingSiblingBranches
      const index = drawnBranches.indexOf(childBranches[1]);
      drawnBranches.splice(index, 1);
    }

    // Map mutations
    const mutationsOfThisTree = Dataset.instance.mutations.filter(
      (mutation) => mutation.treeIndex === treeIndex,
    );
    for (const mutation of mutationsOfThisTree) {
      if (mutation.isNotMapping) {
        continue;
      }
      const branch = tree.find(
        (branch) => branch.branchId === mutation.branchIndices[0],
      );
      const x =
        (branch.line.x1.baseVal.value + branch.line.x2.baseVal.value) / 2;
      const y = branch.line.y1.baseVal.value;

      const circle = createSVGElement("circle", {
        cx: x,
        cy: y,
        r: 2,
        class: "mutation",
      });
      this.#inner.appendChild(circle);
      circle.mutation = mutation;
    }
  }

  /**
   *
   * @param {number} hRatio scaling factor
   * @param {number} x0 base x coordinate for dendrogram
   * @param {number} maxX maximum x coordinate for dendrogram
   * @param {number} height height of the dendrogram
   */
  addGridlines(hRatio: number, x0: number, maxX: number, height: number) {
    this.#grid.innerHTML = "";

    function getNiceStep(range, N) {
      const uglyStep = range / N;
      const order = Math.floor(Math.log10(uglyStep));
      const base = Math.pow(10, order);
      const firstDigit = Math.floor(uglyStep / base);

      if (firstDigit === 1) {
        return base;
      } else if (firstDigit === 2) {
        return base * 2;
      } else {
        return base * 5;
      }
    }

    const step = getNiceStep(maxX - x0, this.#gridN);

    const labelsG = createSVGElement("g", {
      transform: `translate(${x0}, ${-this.#gridLabelYMargin})`,
      class: "labels",
    });

    for (let i = 0; i <= maxX; i += step) {
      const x = i * hRatio;
      const text = createSVGElement("text", {
        x,

        "text-anchor": "middle",
        "font-size": 10,
        "dominant-baseline": "hanging",
      });
      text.textContent = numberFormatter.format(i);

      const line = createSVGElement("line", {
        x1: x + x0,
        y1: 0,
        x2: x + x0,
        y2: height,
        stroke: "black",
        "stroke-opacity": 0.15,
      });
      this.#grid.appendChild(line);
      labelsG.appendChild(text);
    }

    this.#grid.appendChild(labelsG);

    const { width: labelsGWidth, height: labelsGHeight } = labelsG.getBBox();

    const labelsBg = createSVGElement("rect", {
      x: -1,
      y: -1,
      width: labelsGWidth + 1,
      height: labelsGHeight + 1,
      class: "labels-bg",
    });

    labelsG.insertBefore(labelsBg, labelsG.firstChild);
  }

  #updateLabelsPositions = (e) => {
    const scrollTop = this.#container.scrollTop;

    const labelsG = this.#grid.querySelector("g.labels");
    if (scrollTop < CONF.stagePadding.top) {
      labelsG.setAttribute(
        "transform",
        `translate(${this.#x0}, ${-this.#gridLabelYMargin})`,
      );
      return;
    }

    labelsG.setAttribute(
      "transform",
      `translate(${this.#x0}, ${scrollTop - CONF.stagePadding.top})`,
    );
  };
}

// Create and export a singleton instance of DendrogramView
export { DendrogramView };
