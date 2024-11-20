declare module "togostanza-utils" {
  import type Stanza from "togostanza/stanza";
  export function appendCustomCss(stanza: Stanza, url: string): void;
}
