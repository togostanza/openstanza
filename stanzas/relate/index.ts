import Stanza from "togostanza/stanza";
import { loadFiles } from "./util";
import { init } from "./main";

export default class Relate extends Stanza {
  async render() {
    this.renderTemplate({ template: "stanza.template.hbs", parameters: {} });

    await init(this.element.shadowRoot?.querySelector("main"));
  }

  async getData(id: string) {
    const path = "./assets/data/" + id;
    const [ancData, mutData, hapData] = await loadFiles(
      [".anc", ".mut", ".haploidid.fullassembled.BOTH.txt"].map(
        (ext) => path + ext,
      ),
    );
    return { ancData, mutData, hapData };
  }
}
