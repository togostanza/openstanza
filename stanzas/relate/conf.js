import { Dataset } from "./classes/Dataset";
import { RegionSelectorView } from "./classes/RegionSelectorView";

// Height (width after rotating) of the dendrogram
const CLUSTER_WIDTH = 300;
const MUTATION_WIDTH = 1.5;

const CONF = {
  // get sectionSize() {
  //   return {
  //     cluster: 0.5,
  //     mutation: 0.5,
  //   };
  // },
  get haplotypeViewWidth() {
    return 8;
  },
  get haplotypeViewGap() {
    return 4;
  },
  get stagePadding() {
    return {
      top: 100,
      right: 10,
      bottom: 100,
      left: 100,
    };
  },
  get clusterWidth() {
    return CLUSTER_WIDTH;
  },
  get mutationWidth() {
    return MUTATION_WIDTH * Dataset.instance.mutations.length;
  },
  get mutationTop() {
    return this.stagePadding.top;
  },
  get innerHeight() {
    return (
      this.haplotypeViewWidth * Dataset.instance.haplotypes.length +
      this.haplotypeViewGap * (Dataset.instance.haplotypes.length - 1)
    );
  },
  get stageHeight() {
    return this.stagePadding.top + this.innerHeight + this.stagePadding.bottom;
  },
  get stageWidth() {
    return (
      this.stagePadding.left +
      Math.max(this.mutationWidth, RegionSelectorView.instance.width) +
      this.clusterWidth +
      this.stagePadding.right
    );
  },
  // get stageRect() {
  //   if (!this._stageRect) {
  //     // Calculate and store the dimensions of the SVG element, considering padding
  //     this._stageRect = document.getElementById("svg").getBoundingClientRect();
  //   }
  //   return {
  //     width:
  //       this._stageRect.width -
  //       this.stagePadding.left -
  //       this.stagePadding.right,
  //     height:
  //       this._stageRect.height -
  //       this.stagePadding.top -
  //       this.stagePadding.bottom,
  //   };
  // },
  get regions() {
    return Dataset.instance.ancestors.map((ancestor) => ancestor.region);
  },
};

export default CONF;
