import Stanza from "togostanza/stanza";
import { loadFiles } from "./util";
import { init } from "./main";

export default class Relate extends Stanza {
  async render() {
    this.renderTemplate({ template: "stanza.template.hbs", parameters: {} });

    const root = this.element.shadowRoot?.querySelector("main");

    this;

    if (!root) return;

    const folderURL = this.params["data-folder-url"] as string;
    const analysisID = this.params["data-id"] as string;
    const hammapURL = this.params["data-url"] as string;

    await init({ root, folderURL, hapmapFileURL: hammapURL, id: analysisID });
  }

  // async getData(id: string) {
  //   const folderURL = this.params["data-folder-url"] as string;
  //   const analysisID = this.params["data-id"] as string;
  //   const hammapURL = this.params["data-url"] as string;

  //   const path = `${folderURL}${analysisID}`;
  //   const [ancData, mutData, hapData] = await loadFiles(
  //     [".anc", ".mut", ".haploidid.fullassembled.BOTH.txt"].map(
  //       (ext) => path + ext
  //     )
  //   );
  //   return { ancData, mutData, hapData };
  // }
}
