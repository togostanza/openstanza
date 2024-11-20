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
      // this.#instance = new HaploEthnicities();
      throw new Error("HaploEthnicities not initialised");
    }
    return this.#instance;
  }

  static async initialise(hapmapFileURL: string) {
    this.#instance = new HaploEthnicities();
    await this.#instance.init(hapmapFileURL);

    return this.#instance;
  }

  private constructor() {}

  private async init(hapmapFileURL: string) {
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
    } catch (error) {
      throw new Error("Error fetching hapmap file:" + error);
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
