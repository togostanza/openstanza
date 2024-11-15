import { Dataset } from "./classes/Dataset";
import { DendrogramView } from "./classes/DendrogramView";
import { HaploEthnicities } from "./classes/HaploEthnicities";
import { HaplotypesView } from "./classes/HaplotypesView";
import { RegionSelectorView } from "./classes/RegionSelectorView";
import { StageView } from "./classes/StageView";

export async function init(root: HTMLElement) {
  await HaploEthnicities.initialise();
  makeStyleSheet(root);
  const stageView = StageView.initialise(root);
  const haplotypesView = HaplotypesView.initialise(root);
  const regionSelectorView = RegionSelectorView.initialise(root);
  const dendrogramView = DendrogramView.initialise(root);

  console.log("dataset el", root.querySelector("#dataset"));

  // Change dataset
  root
    .querySelector("#dataset")
    ?.addEventListener("change", async function (e: Event) {
      dendrogramView.clear();

      const dataset = (e.target as HTMLSelectElement)?.value;

      if (dataset === "") {
        return;
      }
      // Load some data
      await Dataset.instance.define(dataset);
      // Draw mutations
      haplotypesView.draw();
      regionSelectorView.draw();
      // Define tree options in selector
      stageView.update();
    });
}

// document.addEventListener("DOMContentLoaded", async () => init());

function makeStyleSheet(root: Element) {
  const popnames = Array.from(HaploEthnicities.instance.data.values()).map(
    (d) => d.popname,
  );
  // Create style sheet
  const colors = Object.fromEntries(
    popnames.map((popname, index) => [
      popname,
      `hsl(${(index * 360) / popnames.length}, 50%, 50%)`,
    ]),
  );
  const style = document.createElement("style");
  style.classList.add("ethnic");
  root.appendChild(style);
  const styleSheet = style.sheet;
  for (const popname in colors) {
    styleSheet?.insertRule(
      `path[data-ethnic="${popname}"] { fill: ${colors[popname]}; }`,
    );
    styleSheet?.insertRule(
      `text > tspan[data-ethnic=${popname}] { fill: ${colors[popname]}; }`,
    );
  }
}
