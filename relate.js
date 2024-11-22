import { S as Stanza, b as appendCustomCss, c as defineStanzaElement } from './index-6c9e96c8.js';

async function loadFiles(filePaths) {
    const filePromises = filePaths.map(async (filePath) => {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.text();
    });
    return Promise.all(filePromises);
}
function createSVGElement(type, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", type);
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value.toString());
    }
    return element;
}

/**
 * Class representing a dataset containing haplotypes, mutations, and ancestor information.
 */
class Dataset {
    #haplotypes = [];
    #mutations = [];
    #ancestors = [];
    #mutationsByHaplotype = [];
    static #instance = null;
    static get instance() {
        if (!this.#instance) {
            this.#instance = new Dataset();
        }
        return this.#instance;
    }
    constructor() { }
    static async initialise({ id, folderURL, }) {
        await this.instance.init(id, folderURL);
        return this.instance;
    }
    /**
     * Defines the dataset by loading and parsing the data files.
     *
     * @param {string} id - The identifier for the dataset files.
     */
    async init(id, folderURL) {
        console.log("init", id, folderURL);
        const path = `${folderURL}${id}`;
        try {
            const [ancData, mutData, hapData] = await loadFiles([".anc", ".mut", ".haploidid.fullassembled.BOTH.txt"].map((ext) => path + ext));
            this.#parseHaprotypes(hapData);
            this.#parseMutations(mutData);
            this.#parseAncestors(ancData);
            this.#getMutationsByHaplotype();
        }
        catch (error) {
            throw new Error("Error fetching file:" + error);
        }
    }
    /**
     * Parses the haplotype data.
     */
    #parseHaprotypes(hapData) {
        // Get haplotypes
        this.#haplotypes = hapData
            .split("\n")
            .filter((line) => line.length > 0)
            .map((hap) => hap.split(".")[0]);
    }
    /**
     * Parses the mutation data.
     */
    #parseMutations(mutData) {
        const lines = mutData.trim().split("\n").slice(1); // Exclude header line
        this.#mutations = lines
            .filter((line) => line.length > 0)
            .map((line) => {
            const parts = line.split(";").map((part) => part.trim());
            return {
                snp: parseInt(parts[0], 10),
                posOfSnp: parseInt(parts[1], 10),
                dist: parseInt(parts[2], 10),
                rsId: parts[3],
                treeIndex: parseInt(parts[4], 10),
                branchIndices: parts[5]
                    .split(" ")
                    .map((index) => parseInt(index, 10)),
                isNotMapping: parseInt(parts[6], 10),
                isFlipped: parseInt(parts[7], 10),
                ageBegin: parseFloat(parts[8]),
                ageEnd: parseFloat(parts[9]),
                alleles: parts[10].split("/"),
            };
        });
    }
    /**
     * Parses the ancestor data.
     */
    #parseAncestors(ancData) {
        const treesRawData = ancData.trim().split("\n").slice(2);
        const startNumbers = treesRawData
            .filter((line) => line.length > 0)
            .map((tree) => parseInt(tree.match(/^(\d+)/)[0]));
        const regions = startNumbers.map((start, index) => {
            return {
                start,
                end: startNumbers[index + 1]
                    ? startNumbers[index + 1] - 1
                    : this.#mutations[this.#mutations.length - 1].snp,
            };
        });
        this.#ancestors = treesRawData.map((tree, index) => {
            const treeData = tree.match(/:\s*(.+)/)[1];
            const branches = treeData
                .split(") ")
                .filter((branch) => branch)
                .map((branch, index) => {
                // Restore the closing parenthesis lost during split
                branch = branch.trim().endsWith(")") ? branch : branch + ")";
                const branchParts = branch.match(/(-?\d+):\(([\d.]+) ([\d.]+) (-?\d+) (-?\d+)\)/);
                return {
                    branchId: index,
                    parentBranchId: parseInt(branchParts[1], 10),
                    distance: parseFloat(branchParts[2]),
                    weight: parseFloat(branchParts[3]),
                    branchFrom: parseInt(branchParts[4], 10),
                    branchTo: parseInt(branchParts[5], 10),
                };
            });
            for (const branch of branches) {
                const children = branches.filter((child) => child.parentBranchId === branch.branchId);
                if (children.length > 0) {
                    branch.children = children;
                }
            }
            return { branches, region: regions[index] };
        });
    }
    /**
     * Creates a matrix of mutations by haplotype.
     */
    #getMutationsByHaplotype() {
        const findChildren = (branchId, treeIndex, mutatedBranches) => {
            mutatedBranches.push(branchId);
            const branches = this.#ancestors[treeIndex].branches.filter((branch) => branch.parentBranchId === branchId);
            if (branches.length !== 0) {
                for (const branch of branches) {
                    findChildren(branch.branchId, treeIndex, mutatedBranches);
                }
            }
        };
        this.#mutationsByHaplotype = new Array(this.#haplotypes.length)
            .fill(null)
            .map(() => new Array(this.#mutations.length).fill(0));
        for (let i = 0; i < this.#mutations.length; i++) {
            const { treeIndex, branchIndices } = this.#mutations[i];
            const mutatedBranches = [];
            for (const branchId of branchIndices) {
                findChildren(branchId, treeIndex, mutatedBranches);
            }
            for (let i2 = 0; i2 < mutatedBranches.length; i2++) {
                if (this.#mutationsByHaplotype[mutatedBranches[i2]]) {
                    this.#mutationsByHaplotype[mutatedBranches[i2]][i] = 1;
                }
            }
        }
    }
    getLeafBranches(branch) {
        if (!branch) {
            return [];
        }
        const leaves = [];
        const findLeaves = (branch) => {
            if (branch.children) {
                for (const child of branch.children) {
                    findLeaves(child);
                }
            }
            else {
                leaves.push(branch);
            }
        };
        findLeaves(branch);
        return leaves;
    }
    getDescendantsBranches(branch) {
        const descendants = [];
        const findDescendants = (branch) => {
            descendants.push(branch);
            if (branch.children) {
                for (const child of branch.children) {
                    findDescendants(child);
                }
            }
        };
        findDescendants(branch);
        return descendants;
    }
    get haplotypes() {
        return this.#haplotypes;
    }
    get mutations() {
        return this.#mutations;
    }
    get ancestors() {
        return this.#ancestors;
    }
    get mutationTotalLength() {
        return this.#ancestors[this.#ancestors.length - 1].region.end;
    }
    get mutationsByHaplotype() {
        return this.#mutationsByHaplotype;
    }
}

class HaploEthnicities {
    #data = new Map();
    static #instance = null;
    static get instance() {
        if (!this.#instance) {
            // this.#instance = new HaploEthnicities();
            throw new Error("HaploEthnicities not initialised");
        }
        return this.#instance;
    }
    static async initialise(hapmapFileURL) {
        this.#instance = new HaploEthnicities();
        await this.#instance.init(hapmapFileURL);
        return this.#instance;
    }
    constructor() { }
    async init(hapmapFileURL) {
        // Load ethnicities data file
        try {
            const [text] = await loadFiles([hapmapFileURL]);
            // Parse and return ethnicities associated with haplotypes
            text
                .split("\n")
                .splice(1)
                .filter((line) => line.length > 0)
                .forEach((eth) => {
                const [sampleid, popname, gpopname] = eth.split("\t");
                this.#data.set(sampleid, { sampleid, popname, gpopname });
            });
            return this;
        }
        catch (error) {
            throw new Error("Error fetching hapmap file:" + error);
        }
    }
    get data() {
        return this.#data;
    }
    getSample(sampleid) {
        if (!this.#data.has(sampleid)) {
            return {
                sampleid,
                popname: "",
                gpopname: "",
            };
        }
        return this.#data.get(sampleid);
    }
    getPopname(sampleid) {
        const sample = this.getSample(sampleid);
        return sample ? sample.popname : undefined;
    }
}

class RegionSelectorView {
    #el;
    #RelateViewer;
    #style;
    #totalWidth = 0;
    static #instance = null;
    constructor(root) {
        this.#el = root.querySelector("#RegionSelectorView");
        this.#RelateViewer = root.querySelector("#RelateViewer");
        const existingStyle = root.getRootNode().querySelector("style#dynamic-css");
        if (existingStyle) {
            existingStyle.remove();
        }
        this.#style = document.createElement("style");
        this.#style.id = "dynamic-css";
    }
    static initialise(root) {
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
    init() {
        this.#el.setAttribute("transform", `translate(0 ${Conf.instance.mutationTop})`);
        this.#el.getRootNode().appendChild(this.#style);
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
        const unitWidth = Conf.instance.mutationWidth / Dataset.instance.mutations.length;
        let d = "";
        const fragment = new DocumentFragment();
        const regionIndicatorTemplate = createRegionIndicatorTemplate();
        this.#totalWidth = 0;
        const haplotypesHeight = Conf.instance.innerHeight;
        const ancestors = Dataset.instance.ancestors;
        ancestors.forEach((ancestor, i) => {
            // get start and end positions
            // get middle of the region (x2, y2)
            const x1 = Conf.instance.stagePadding.left + ancestor.region.start * unitWidth;
            const x3 = Conf.instance.stagePadding.left + ancestor.region.end * unitWidth;
            const x2 = (x1 + x3) * 0.5;
            // Add border line
            d += `M ${x3} ${0} L ${x3} ${haplotypesHeight} `;
            // Add region selector
            const regionIndicator = regionIndicatorTemplate.cloneNode(true);
            const path = regionIndicator.querySelector("path");
            this.#totalWidth = Math.max(this.#totalWidth + Conf.instance.haplotypeViewWidth, x2);
            path?.setAttribute("d", `M ${x2} 0 L ${this.#totalWidth} -20`);
            const text = regionIndicator.querySelector("text");
            text.setAttribute("transform", `translate(${this.#totalWidth} -20) rotate(-90)`);
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
                }
                else {
                    this.#RelateViewer.dataset.selectedRegion = `${i}`;
                    this.#RelateViewer.classList.add("-selectedregion");
                    DendrogramView.instance?.draw(i, x3 - Conf.instance.stagePadding.left);
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
    generateDynamicCSS(ancestors) {
        if (!this.#style || !this.#style.sheet)
            return;
        const sheet = this.#style.sheet;
        while (sheet.cssRules?.length > 0) {
            sheet.deleteRule(0);
        }
        ancestors.forEach((_, i) => {
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

// Height (width after rotating) of the dendrogram
const CLUSTER_WIDTH = 300;
const MUTATION_WIDTH = 1.5;
class Conf {
    params;
    static #instance;
    static initialise(params) {
        this.#instance = new Conf(params);
        return this.#instance;
    }
    static get instance() {
        return this.#instance;
    }
    constructor(params) {
        this.params = params;
    }
    get haplotypeViewWidth() {
        return Math.max(8, this.params.fontHeightPx);
    }
    get haplotypeViewGap() {
        return 4;
    }
    get stagePadding() {
        return this.params.padding;
    }
    get clusterWidth() {
        return CLUSTER_WIDTH;
    }
    get mutationWidth() {
        return MUTATION_WIDTH * Dataset.instance.mutations.length;
    }
    get mutationTop() {
        return this.stagePadding.top;
    }
    get innerHeight() {
        return (this.haplotypeViewWidth * Dataset.instance.haplotypes.length +
            this.haplotypeViewGap * (Dataset.instance.haplotypes.length - 1));
    }
    get stageHeight() {
        return this.stagePadding.top + this.innerHeight + this.stagePadding.bottom;
    }
    get stageWidth() {
        if (!RegionSelectorView.instance) {
            throw new Error("RegionSelectorView instance not found");
        }
        return (this.stagePadding.left +
            Math.max(this.mutationWidth, RegionSelectorView.instance.width) +
            this.clusterWidth +
            this.stagePadding.right);
    }
    get regions() {
        return Dataset.instance.ancestors.map((ancestor) => ancestor.region);
    }
}

class Tooltip {
    arrowHeight = 5;
    #tip = null;
    #tooltipTextElement = null;
    #tipBorder = null;
    #element = null;
    static #instance = null;
    static get instance() {
        if (!Tooltip.#instance) {
            throw new Error("Tooltip not initialised");
        }
        return Tooltip.#instance;
    }
    static initialise(root) {
        if (!root) {
            throw new Error("Root element not found");
        }
        this.#instance = new Tooltip(root);
        return this.#instance;
    }
    init(parent) {
        if (!parent) {
            throw new Error("Tooltip parent is not defined");
        }
        this.#element = document.createElement("div");
        this.#element.style.position = "absolute";
        this.#element.id = "Tooltip";
        this.#tooltipTextElement = document.createElement("div");
        this.#tooltipTextElement.id = "TooltipText";
        this.#tooltipTextElement.style.zIndex = "10";
        this.#tooltipTextElement.style.position = "relative";
        this.#tooltipTextElement.style.backgroundColor = "white";
        this.#tooltipTextElement.style.padding = "5px";
        this.#tooltipTextElement.style.borderRadius = "5px";
        this.#tip = document.createElement("div");
        this.#tip.id = "TooltipTip";
        this.#tip.style.position = "absolute";
        this.#tip.style.backgroundColor = "white";
        this.#tip.style.left = "50%";
        this.#tip.style.transform = "translateX(-50%) rotate(45deg)";
        this.#tip.style.zIndex = "20";
        this.#tipBorder = document.createElement("div");
        this.#tipBorder.style.position = "absolute";
        this.#tipBorder.style.backgroundColor = "black";
        this.#tipBorder.style.left = "50%";
        this.#tipBorder.style.transform = "translateX(-50%) rotate(45deg)";
        this.#tipBorder.style.zIndex = "5";
        this.#element.appendChild(this.#tip);
        this.#element.appendChild(this.#tipBorder);
        this.#updateTip();
        this.#element.appendChild(this.#tooltipTextElement);
        parent.appendChild(this.#element);
    }
    constructor(root) {
        this.init(root);
    }
    #updateTip() {
        if (!this.#tip) {
            return;
        }
        if (!this.#tipBorder) {
            return;
        }
        this.#tip.style.width = this.arrowSquareSize + "px";
        this.#tip.style.height = this.arrowSquareSize + "px";
        this.#tip.style.bottom = -this.arrowHeight + 4 + "px";
        this.#tipBorder.style.width = this.arrowSquareSize + 2 + "px";
        this.#tipBorder.style.height = this.arrowSquareSize + 2 + "px";
        this.#tipBorder.style.bottom = -this.arrowHeight + 3 + "px";
    }
    get arrowSquareSize() {
        return Math.sqrt(2 * Math.pow(this.arrowHeight, 2));
    }
    show(message, x, y) {
        if (!this.#element) {
            return;
        }
        if (!this.#tooltipTextElement) {
            return;
        }
        this.#tooltipTextElement.innerText = message;
        this.#element.classList.add("-visible");
        const { width, height } = this.#element.getBoundingClientRect();
        this.#element.style.left = `${x - width / 2}px`;
        this.#element.style.top = `${y - height - this.arrowHeight}px`;
        this.#updateTip();
    }
    hide() {
        this.#element?.classList.remove("-visible");
    }
}

const numberFormatter = new Intl.NumberFormat("en-US");
function debounce(func, wait, immediate) {
    let timeout;
    return function (...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        const later = function () {
            timeout = undefined;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        timeout && clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}
class DendrogramView {
    #el = null;
    #RelateViewer = null;
    #inner = document.createElementNS("http://www.w3.org/2000/svg", "g");
    #grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    #container = null;
    #gridN = 5;
    #gridLabelYMargin = 8;
    #x0 = null;
    static #instance = null;
    static get instance() {
        return this.#instance;
    }
    static initialise(root) {
        this.#instance = new DendrogramView(root);
        this.#instance.init();
        return this.#instance;
    }
    constructor(root) {
        this.#el = root.querySelector("#DendrogramView");
        this.#RelateViewer = root.querySelector("#RelateViewer");
        this.#container = this.#el?.closest("main") || null;
        Tooltip.initialise(this.#container);
    }
    /**
     * Initialize the DendrogramView.
     * Sets the initial transform attribute for the SVG element.
     */
    init() {
        if (!this.#el) {
            throw new Error("DendrogramView element not found");
        }
        if (!this.#container) {
            throw new Error("Container element not found");
        }
        this.#el.setAttributeNS(null, "transform", `translate(${Conf.instance.stagePadding.left}, ${Conf.instance.haplotypeViewWidth / 2})`);
        this.#el.appendChild(this.#inner);
        this.#grid.setAttribute("transform", `translate(0, ${Conf.instance.stagePadding.top - Conf.instance.haplotypeViewWidth / 2})`);
        this.#grid.style.pointerEvents = "none";
        this.#el.appendChild(this.#grid);
        this.#inner.addEventListener("click", this.#handleBranchClick);
        this.#inner.addEventListener("mouseover", this.#handleBranchHover);
        this.#inner.addEventListener("mouseout", this.#handleBranchUnhover);
        this.#container.addEventListener("scroll", debounce(this.#updateLabelsPositions, 300));
        this.#inner.addEventListener("mouseover", this.#handleMutationHover);
        this.#inner.addEventListener("mouseout", this.#handleMutationUnhover);
    }
    #handleBranchClick = (e) => {
        e.stopPropagation();
        if (e.target.tagName === "rect" &&
            e.target.dataset.type === "click-handle") {
            const leaves = Dataset.instance.getLeafBranches(e.target.branch);
            const branchIds = leaves.map((leaf) => leaf.branchId);
            this.#el?.dispatchEvent(new CustomEvent("select-haplotype", {
                detail: { shiftKey: e.shiftKey, indexes: branchIds },
                bubbles: true,
            }));
        }
    };
    #handleBranchHover = (e) => {
        if (e.target.tagName === "rect" &&
            e.target.dataset.type === "click-handle") {
            const decendants = Dataset.instance.getDescendantsBranches(e.target.branch);
            decendants.forEach((branch) => {
                branch.line?.classList.add("-hovered");
                if (branch.beam) {
                    branch.beam.classList.add("-hovered");
                }
            });
        }
    };
    #handleBranchUnhover = (e) => {
        if (e.target.tagName === "rect" &&
            e.target.dataset.type === "click-handle") {
            const decendants = Dataset.instance.getDescendantsBranches(e.target.branch);
            decendants.forEach((branch) => {
                branch.line?.classList.remove("-hovered");
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
        Tooltip.instance?.show(`Alleles: ${mutation.alleles.join(", ")}\nPosition: ${mutation.snp}`, x + Conf.instance.stagePadding.left, y + Conf.instance.haplotypeViewWidth / 2);
    };
    #handleMutationUnhover = (e) => {
        if (e.target.tagName !== "circle" || !e.target.mutation) {
            return;
        }
        Tooltip.instance?.hide();
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
            console.log("this.#RelateViewer", this.#RelateViewer);
            const selectedRegion = this.#RelateViewer.dataset.selectedRegion;
            let textX = 0;
            for (let i = 0; i < terminalBranches.length; i++) {
                const branch = terminalBranches[i];
                const g = this.#RelateViewer.querySelector(`#HaplotypesView > g[data-index="${branch.line?.dataset.branchId}"]`);
                if (i === 0) {
                    const bgRect = g.querySelector(`g[data-region="${selectedRegion}"] > rect.bg`);
                    //@ts-ignore
                    textX = bgRect.x.baseVal.value;
                }
                const checkbox = g?.querySelector("g.checkbox");
                checkbox?.setAttribute("transform", `translate(${textX - 4}, 0)`);
                if (branch.line?.dataset.index) {
                    g.setAttribute("transform", `translate(0 , ${+branch.line.dataset.index *
                        (Conf.instance.haplotypeViewWidth +
                            Conf.instance.haplotypeViewGap)})`);
                }
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
                const g = this.#RelateViewer.querySelector(`#HaplotypesView > g[data-index="${i}"]`);
                const checkbox = g.querySelector("g.checkbox");
                checkbox.setAttribute("transform", `translate(-4, 0)`);
                g.setAttribute("transform", `translate(0 , ${i *
                    (Conf.instance.haplotypeViewWidth + Conf.instance.haplotypeViewGap)})`);
            }
        });
    }
    /**
     * Draw the dendrogram based on the specified tree index.
     * @param  treeIndex - The index of the tree to draw.
     * @param  x0 - X coordinate of the dendrogram base
     */
    draw(treeIndex, x0) {
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
            const parentBranch = tree.find((parentBranch) => parentBranch.branchId === branch.parentBranchId);
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
        // const minGap = Conf.instance.innerWidth / Dataset.instance.haplotypes.length;
        const hRatio = Conf.instance.clusterWidth / overAllLength;
        this.addGridlines(hRatio, x0, overAllLength, (Conf.instance.haplotypeViewWidth + Conf.instance.haplotypeViewGap) *
            terminalBranches.length);
        const drawnBranches = [];
        const existingSiblingBranches = [];
        // Draw terminal branches
        for (let i = 0; i < terminalBranches.length; i++) {
            const branch = terminalBranches[i];
            const haplotype = Dataset.instance.haplotypes[branch.branchId];
            const ethnic = HaploEthnicities.instance.getSample(haplotype);
            const y = Conf.instance.stagePadding.top +
                (Conf.instance.haplotypeViewWidth + Conf.instance.haplotypeViewGap) * i;
            const line = createSVGElement("line", {
                x1: x0,
                y1: y,
                x2: x0 + branch.distance * hRatio,
                y2: y,
                "data-index": i,
                "data-branch-id": branch.branchId,
                "data-parent-branch-id": branch.parentBranchId,
                "data-ethnic": ethnic?.popname ?? "",
            });
            line.ethnic = ethnic;
            this.#inner.appendChild(line);
            branch.line = line;
            const siblingBranch = drawnBranches.find((drawnBranch) => drawnBranch.parentBranchId === branch.parentBranchId);
            if (siblingBranch) {
                existingSiblingBranches.push(siblingBranch);
            }
            drawnBranches.push(branch);
        }
        // Draw other branches
        const undrawnBranches = [...tree];
        // Remove terminal branches from undrawnBranches
        for (const terminalBranch of terminalBranches) {
            const index = undrawnBranches.findIndex((branch) => branch.branchId === terminalBranch.branchId);
            undrawnBranches.splice(index, 1);
        }
        while (true) {
            const childBranches = [existingSiblingBranches.shift()];
            if (!childBranches[0]) {
                break;
            }
            childBranches.push(drawnBranches.find((branch) => branch.parentBranchId === childBranches[0]?.parentBranchId &&
                branch.branchId !== childBranches[0].branchId));
            const ethnic = childBranches[0]?.line?.ethnic &&
                childBranches[0].line.ethnic.popname ===
                    childBranches[1]?.line?.ethnic?.popname
                ? childBranches[0].line.ethnic
                : undefined;
            const branch = tree.find((branch) => branch.branchId === childBranches[0]?.parentBranchId);
            // Draw branch
            const x = childBranches[0].line?.x2.baseVal.value ?? 0;
            const y = ((childBranches[0]?.line?.y2.baseVal.value ?? 0) +
                (childBranches[1]?.line?.y2.baseVal.value ?? 0)) /
                2;
            const beam = createSVGElement("line", {
                x1: childBranches[0].line?.x2.baseVal.value ?? 0,
                y1: childBranches[0].line?.y1.baseVal.value ?? 0,
                x2: childBranches[1]?.line?.x2.baseVal.value ?? 0,
                y2: childBranches[1]?.line?.y1.baseVal.value ?? 0,
            });
            this.#inner.appendChild(beam);
            const line = createSVGElement("line", {
                x1: x,
                y1: y,
                x2: x + (branch?.distance ?? 0) * hRatio,
                y2: y,
                "data-branch-id": branch?.branchId || "-",
                "data-parent-branch-id": branch?.parentBranchId || "-",
                "data-ethnic": ethnic?.popname || "-",
            });
            const clickHandle = createSVGElement("rect", {
                x,
                y: y - 1.5,
                width: (branch?.distance ?? 0) * hRatio,
                height: 3,
                fill: "transparent",
                "data-type": "click-handle",
                "data-branch-id": branch?.branchId || "-",
                "data-parent-branch-id": branch?.parentBranchId || "-",
                "data-ethnic": ethnic?.popname || "-",
            });
            clickHandle.branch = branch;
            line.ethnic = ethnic;
            this.#inner.appendChild(line);
            this.#inner.appendChild(clickHandle);
            if (!branch) {
                break;
            }
            branch.line = line;
            branch.beam = beam;
            const siblingBranche = drawnBranches.find((drawnBranche) => drawnBranche.parentBranchId === branch?.parentBranchId);
            if (siblingBranche) {
                existingSiblingBranches.push(siblingBranche);
            }
            drawnBranches.push(branch);
            // Remove from undrawnBranches and existingSiblingBranches
            const index = drawnBranches.findIndex((b) => b.branchId === childBranches[1]?.branchId);
            drawnBranches.splice(index, 1);
        }
        // Map mutations
        const mutationsOfThisTree = Dataset.instance.mutations.filter((mutation) => mutation.treeIndex === treeIndex);
        for (const mutation of mutationsOfThisTree) {
            if (mutation.isNotMapping) {
                continue;
            }
            const branch = tree.find((branch) => branch.branchId === mutation.branchIndices[0]);
            const x = ((branch?.line?.x1.baseVal.value ?? 0) +
                (branch?.line?.x2.baseVal.value ?? 0)) /
                2;
            const y = branch?.line?.y1.baseVal.value ?? 0;
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
    addGridlines(hRatio, x0, maxX, height) {
        this.#grid.innerHTML = "";
        function getNiceStep(range, N) {
            const uglyStep = range / N;
            const order = Math.floor(Math.log10(uglyStep));
            const base = Math.pow(10, order);
            const firstDigit = Math.floor(uglyStep / base);
            if (firstDigit === 1) {
                return base;
            }
            else if (firstDigit === 2) {
                return base * 2;
            }
            else {
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
        const scrollTop = this.#container?.scrollTop ?? 0;
        const labelsG = this.#grid.querySelector("g.labels");
        if (!labelsG) {
            return;
        }
        if (scrollTop < Conf.instance.stagePadding.top) {
            labelsG.setAttribute("transform", `translate(${this.#x0}, ${-this.#gridLabelYMargin})`);
            return;
        }
        labelsG.setAttribute("transform", `translate(${this.#x0}, ${scrollTop - Conf.instance.stagePadding.top})`);
    };
}

class CheckboxInSVG {
    static textPadding = { x: 2, y: 0 };
    #checked = false;
    #container = null;
    #rect = null;
    #parentEl = null;
    #labelEl = null;
    #handleClick = (e) => {
        e.stopPropagation();
        this.#dispatchEvent(e.shiftKey);
    };
    constructor(parentEl, labelEl) {
        this.#parentEl = parentEl;
        this.#labelEl = labelEl;
        this.#container = createSVGElement("g", {
            class: "checkbox",
            transform: `translate(-4, 0)`,
        });
        this.#container.addEventListener("click", this.#handleClick);
        this.#parentEl.appendChild(this.#container);
        this.#container.appendChild(labelEl);
        this.#rect = createSVGElement("rect", {
            class: "checkbox-bg",
        });
        this.#container.appendChild(this.#rect);
        requestAnimationFrame(() => {
            const { width: labelWidth } = labelEl.getBBox();
            let width = labelWidth + CheckboxInSVG.textPadding.x * 2;
            if (labelEl.childNodes.length === 0) {
                width = 10;
            }
            const height = Conf.instance.haplotypeViewWidth + Conf.instance.haplotypeViewGap;
            const x = -width + CheckboxInSVG.textPadding.x;
            const y = -Conf.instance.haplotypeViewGap / 2;
            this.#rect.setAttribute("width", `${width}`);
            this.#rect.setAttribute("height", `${height}`);
            this.#rect.setAttribute("x", `${x}`);
            this.#rect.setAttribute("y", `${y}`);
        });
        this.#container.removeChild(labelEl);
        this.#container.appendChild(labelEl);
        this.#update();
    }
    setAttribute(key, value) {
        this.#container.setAttribute(key, value);
    }
    set checked(value) {
        this.#checked = value;
        this.#update();
    }
    get checked() {
        return this.#checked;
    }
    #dispatchEvent(shiftKey) {
        this.#container?.dispatchEvent(new CustomEvent("change", {
            bubbles: true,
            detail: {
                shiftKey,
            },
        }));
    }
    #update() {
        if (this.#checked) {
            for (const tspan of this.#labelEl?.children || []) {
                tspan.style.fill = "white";
            }
        }
        else {
            for (const tspan of this.#labelEl?.children || []) {
                tspan.style.fill = "";
            }
        }
        this.#rect?.classList.toggle("-selected", this.#checked);
    }
}

class HaplotypeView {
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
    constructor({ unitHeight, haplotype, ethnic, index, regions, }) {
        // Create an SVG group element (<g>) and set its attributes
        this.#el.setAttribute("transform", `translate(0,${(Conf.instance.haplotypeViewWidth + Conf.instance.haplotypeViewGap) *
            index})`);
        this.#el.setAttribute("data-haplotype", haplotype);
        this.#el.setAttribute("data-index", `${index}`);
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
                height: Conf.instance.haplotypeViewWidth,
                class: "bg",
            });
            g.appendChild(bgPath);
            // Clone the path element and draw mutations for each region
            const path2 = path.cloneNode();
            let d = "";
            for (let i = region.start; i < region.end; i++) {
                if (Dataset.instance.mutationsByHaplotype[index][i] === 1) {
                    const originalX = i * unitHeight;
                    d += rectangle(originalX, 0, unitHeight, Conf.instance.haplotypeViewWidth);
                }
            }
            path2.setAttribute("d", d);
            const isMutationInRegion = Dataset.instance.mutationsByHaplotype[index][region.start] === 1 &&
                Dataset.instance.mutationsByHaplotype[index][region.end - 1] === 1;
            if (isMutationInRegion) {
                path2.setAttribute("data-region", `${regionIndex}`);
            }
            g.appendChild(path2);
            g.setAttribute("data-region", `${regionIndex}`);
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
        return this.#checkbox?.checked;
    }
    set selected(value) {
        if (value) {
            this.#el.dataset.selected = "true";
        }
        else {
            delete this.#el.dataset.selected;
        }
        this.#checkbox.checked = !!value;
    }
    get index() {
        return parseInt(this.#el.dataset.index || "-1");
    }
    #dispatchEvent(shiftKey) {
        this.#el.dispatchEvent(new CustomEvent("select-haplotype", {
            detail: {
                indexes: [parseInt(this.#el.dataset.index || "-1")],
                shiftKey,
            },
            bubbles: true,
        }));
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
    return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
}

class HaplotypesView {
    #el;
    #haplotypeViews = [];
    #selectedIndices = [];
    static #instance = null;
    static get instance() {
        if (!this.#instance) {
            throw new Error("HaplotypesView not initialised");
        }
        return this.#instance;
    }
    static initialise(root) {
        if (!root) {
            throw new Error("Root element not found");
        }
        this.#instance = new HaplotypesView(root);
        return this.#instance;
    }
    constructor(root) {
        this.#el = root.querySelector("#HaplotypesView");
    }
    clear() {
        this.#el.innerHTML = "";
        this.#haplotypeViews = [];
        this.#selectedIndices = [];
        this.#haplotypeViews = [];
    }
    draw() {
        // empty
        this.clear();
        const unitHeight = Conf.instance.mutationWidth / Dataset.instance.mutations.length;
        this.#el.setAttributeNS(null, "transform", `translate(${Conf.instance.stagePadding.left}, ${Conf.instance.stagePadding.top})`);
        // Draw mutations
        const regions = Conf.instance.regions;
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

class StageView {
    #el;
    static #instance = null;
    static get instance() {
        if (!this.#instance) {
            throw new Error("StageView not initialised");
        }
        return this.#instance;
    }
    static initialise(root) {
        if (!root) {
            throw new Error("Root element not found");
        }
        this.#instance = new StageView(root);
        this.#instance.init();
        return this.#instance;
    }
    constructor(root) {
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
        this.#el.style.width = Conf.instance.stageWidth + "px";
        this.#el.style.height = Conf.instance.stageHeight + "px";
    }
    #handleClickHaplotype = (e) => {
        if (e.detail.shiftKey) {
            HaplotypesView.instance.selectedIndices = [
                ...HaplotypesView.instance.selectedIndices,
                ...e.detail.indexes,
            ];
        }
        else {
            HaplotypesView.instance.selectedIndices = e.detail.indexes;
        }
    };
}

async function init({ root, folderURL, hapmapFileURL, id, }) {
    await Dataset.initialise({ id, folderURL });
    await HaploEthnicities.initialise(hapmapFileURL);
    makeStyleSheet(root);
    const stageView = StageView.initialise(root);
    const haplotypesView = HaplotypesView.initialise(root);
    const regionSelectorView = RegionSelectorView.initialise(root);
    const dendrogramView = DendrogramView.initialise(root);
    dendrogramView.clear();
    // Draw mutations
    haplotypesView.draw();
    regionSelectorView.draw();
    // Define tree options in selector
    stageView.update();
}
function makeStyleSheet(root) {
    const popnames = Array.from(HaploEthnicities.instance.data.values()).map((d) => d.popname);
    // Create style sheet
    const colors = Object.fromEntries(popnames.map((popname, index) => [
        popname,
        `hsl(${(index * 360) / popnames.length}, 50%, 50%)`,
    ]));
    const existingStyle = root.getRootNode().querySelector("style#relate");
    if (existingStyle) {
        existingStyle.remove();
    }
    const style = document.createElement("style");
    style.classList.add("ethnic");
    style.id = "relate";
    root.getRootNode()?.appendChild(style);
    const styleSheet = style.sheet;
    for (const popname in colors) {
        styleSheet?.insertRule(`path[data-ethnic="${popname}"] { fill: ${colors[popname]}; }`);
        styleSheet?.insertRule(`text > tspan[data-ethnic=${popname}] { fill: ${colors[popname]}; }`);
    }
}

function getMarginsFromCSSString(str) {
    const splitted = str.trim().split(/\W+/);
    const res = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    switch (splitted.length) {
        case 1:
            res.top = res.right = res.bottom = res.left = parseInt(splitted[0]) || 0;
            break;
        case 2:
            res.top = res.bottom = parseInt(splitted[0]) || 0;
            res.left = res.right = parseInt(splitted[1]) || 0;
            break;
        case 3:
            res.top = parseInt(splitted[0]) || 0;
            res.left = res.right = parseInt(splitted[1]) || 0;
            res.bottom = parseInt(splitted[2]) || 0;
            break;
        case 4:
            res.top = parseInt(splitted[0]) || 0;
            res.right = parseInt(splitted[1]) || 0;
            res.bottom = parseInt(splitted[2]) || 0;
            res.left = parseInt(splitted[3]) || 0;
            break;
    }
    return res;
}

class Relate extends Stanza {
    css(key) {
        return getComputedStyle(this.element).getPropertyValue(key);
    }
    async render() {
        this.renderTemplate({ template: "stanza.template.hbs", parameters: {} });
        appendCustomCss(this, this.params["--togostanza-custom-css"]);
        const root = this.element.shadowRoot?.querySelector("main");
        if (!root)
            return;
        const folderURL = this.params["data-folder-url"];
        const analysisID = this.params["data-id"];
        const hammapURL = this.params["data-url"];
        Promise.resolve().then(() => {
            Conf.initialise({
                padding: getMarginsFromCSSString(this.css("--togostanza-canvas-padding")),
                fontHeightPx: parseInt(this.css("--togostanza-fonts-font_size_primary")),
            });
            init({ root, folderURL, hapmapFileURL: hammapURL, id: analysisID });
        });
    }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Relate
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "relate",
	"stanza:label": "Relate",
	"stanza:definition": "Relate MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2024-10-11",
	"stanza:updated": "2024-10-11",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/refs/heads/main/samples/other/hapmap3204.pop.tsv",
		"stanza:description": "Hapmap data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:example": "tsv",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "data-folder-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/refs/heads/main/samples/other/",
		"stanza:description": "Data folder url",
		"stanza:required": true
	},
	{
		"stanza:key": "data-id",
		"stanza:example": "A2M_chr12_9062708_9120919",
		"stanza:description": "ID of the analysis data",
		"stanza:required": true
	},
	{
		"stanza:key": "togostanza-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-canvas-height",
		"stanza:type": "number",
		"stanza:default": 700,
		"stanza:description": "Metastanza height in px"
	},
	{
		"stanza:key": "--togostanza-canvas-padding",
		"stanza:type": "text",
		"stanza:default": "100px",
		"stanza:description": "Padding of a stanza. CSS padding-like text (10px 10px 10px 10px)"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "'Roboto Condensed', sans-serif",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color_primary",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color for value"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Font size for value"
	},
	{
		"stanza:key": "--togostanza-fonts-font_weight_primary",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Font weight for value"
	}
]
};

var templates = [
  ["stanza.template.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"container\">\n\n  <svg id=\"RelateViewer\" xmlns=\"http://www.w3.org/2000/\">\n    <g id=\"HaplotypesView\"></g>\n    <g id=\"RegionSelectorView\"></g>\n    <g id=\"DendrogramView\"></g>\n  </svg>\n\n  <script type=\"module\" src=\"main.js\"></script>\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=relate.js.map
