// Import JSDoc typedef from types.js for reference

import { loadFiles } from "../util.js";

export type EthnicityDatum = {
  sampleid: string;
  popname: string;
  gpopname: string;
};

class HaploEthnicities {
  #data: Map<string, EthnicityDatum> = new Map();

  static #instance: HaploEthnicities | null = null;

  static get instance() {
    if (!this.#instance) {
      this.#instance = new HaploEthnicities();
    }
    return this.#instance;
  }

  static async initialise() {
    await this.instance.init();

    return this.instance;
  }

  private constructor() {
    this.init();
  }

  private async init() {
    // Load ethnicities data file
    const filePath = "/relate/assets/data/hapmap3204.pop.tsv";
    try {
      const [text] = await loadFiles([filePath]);
      // Parse and return ethnicities associated with haplotypes

      text
        .split("\n")
        .splice(1)
        .filter((line) => line.length > 0)
        .forEach((eth) => {
          const [sampleid, popname, gpopname] = eth.split("\t");
          this.#data.set(sampleid, { sampleid, popname, gpopname });
        });
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  }

  get data() {
    return this.#data;
  }

  getSample(sampleid: string) {
    if (!this.#data.has(sampleid)) {
      return {
        sampleid,
        popname: "",
        gpopname: "",
      };
    }

    return this.#data.get(sampleid);
  }

  getPopname(sampleid: string) {
    const sample = this.getSample(sampleid);
    return sample ? sample.popname : undefined;
  }
}

export { HaploEthnicities };
