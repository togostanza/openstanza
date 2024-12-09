import { d as defineComponent, s as script$1, c as createBlock, w as withCtx, r as resolveComponent, o as openBlock, a as createBaseVNode, b as createElementBlock, F as Fragment, e as renderList, t as toDisplayString, f as createCommentVNode, g as createApp } from './Layout-efd7b83e.js';

var script = defineComponent({
  components: {
    Layout: script$1
  },

  props: ['allMetadata'],

  setup(props) {
    return props;
  }
});

const _hoisted_1 = {
  key: 0,
  class: "list-group mt-3"
};
const _hoisted_2 = ["href"];
const _hoisted_3 = {
  key: 0,
  class: "small text-muted text-truncate mt-1 mb-0"
};
const _hoisted_4 = { key: 1 };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Layout = resolveComponent("Layout");

  return (openBlock(), createBlock(_component_Layout, null, {
    default: withCtx(() => [
      _cache[0] || (_cache[0] = createBaseVNode("h1", { class: "display-4" }, "List of Stanzas", -1 /* HOISTED */)),
      (_ctx.allMetadata.length > 0)
        ? (openBlock(), createElementBlock("div", _hoisted_1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.allMetadata, (metadata) => {
              return (openBlock(), createElementBlock("a", {
                key: metadata['@id'],
                href: `./${metadata['@id']}.html`,
                class: "list-group-item list-group-item-action py-3"
              }, [
                createBaseVNode("div", null, toDisplayString(metadata['stanza:label']), 1 /* TEXT */),
                (metadata['stanza:definition'])
                  ? (openBlock(), createElementBlock("p", _hoisted_3, toDisplayString(metadata['stanza:definition']), 1 /* TEXT */))
                  : createCommentVNode("v-if", true)
              ], 8 /* PROPS */, _hoisted_2))
            }), 128 /* KEYED_FRAGMENT */))
          ]))
        : (openBlock(), createElementBlock("p", _hoisted_4, "No stanzas defined."))
    ]),
    _: 1 /* STABLE */
  }))
}

script.render = render;
script.__file = "node_modules/togostanza/src/components/Index.vue";

var allMetadata = [{"@context":{"stanza":"http://togostanza.org/resource/stanza#"},"@id":"manhattan-plot","stanza:label":"Manhattan plot","stanza:definition":"Manhattan plot MetaStanza (for GWAS)","stanza:license":"MIT","stanza:author":"DBCLS","stanza:contributor":[],"stanza:created":"2021-01-13","stanza:updated":"2021-01-13","stanza:parameter":[{"stanza:key":"data-url","stanza:example":"https://raw.githubusercontent.com/togostanza/togostanza-data/refs/heads/main/samples/json/manhattan-plot.json","stanza:description":"Data source URL (json)","stanza:required":true},{"stanza:key":"chromosomeKey","stanza:example":"chr","stanza:description":"Key to a chromosome in data frame'","stanza:required":false},{"stanza:key":"positionKey","stanza:example":"stop","stanza:description":"Key to a position on chromosome in data frame","stanza:required":false},{"stanza:key":"pValueKey","stanza:example":"p-value","stanza:description":"Key to a p-value in data frame","stanza:required":false},{"stanza:key":"custom-css-url","stanza:example":"","stanza:description":"Stylesheet(css file) URL to override current style","stanza:required":false},{"stanza:key":"lowThresh","stanza:example":"4","stanza:description":"Filtering threshold (=log10(p-value))","stanza:required":false},{"stanza:key":"highThresh","stanza:example":"8","stanza:description":"Highlight threshold","stanza:required":false},{"stanza:key":"recordsPerPage","stanza:example":"20","stanza:description":"Records per a page to display on table","stanza:required":false}],"stanza:menu-placement":"bottom-right","stanza:style":[{"stanza:key":"--togostanza-font-family","stanza:type":"text","stanza:default":"Arial","stanza:description":"Font family"},{"stanza:key":"--togostanza-discovery-color","stanza:type":"color","stanza:default":"#3D6589","stanza:description":"Plot color of discovery stage"},{"stanza:key":"--togostanza-replication-color","stanza:type":"color","stanza:default":"#ED707E","stanza:description":"Plot color of replication stage"},{"stanza:key":"--togostanza-combined-color","stanza:type":"color","stanza:default":"#EAB64E","stanza:description":"Plot color of combined stage"},{"stanza:key":"--togostanza-meta-analysis-color","stanza:type":"color","stanza:default":"#52B1C1","stanza:description":"Plot color of meta-analysis stage"},{"stanza:key":"--togostanza-not-provided-color","stanza:type":"color","stanza:default":"#62B28C","stanza:description":"Plot color of not-provided stage"},{"stanza:key":"--togostanza-slider-color","stanza:type":"color","stanza:default":"#C2E3F2","stanza:description":"Slider color"},{"stanza:key":"--togostanza-thead-font-size","stanza:type":"text","stanza:default":"14px","stanza:description":"Font size of table header"},{"stanza:key":"--togostanza-tbody-font-size","stanza:type":"text","stanza:default":"14px","stanza:description":"Font size of table body"},{"stanza:key":"--togostanza-thead-font-color","stanza:type":"color","stanza:default":"#002559","stanza:description":"Font color of table header"},{"stanza:key":"--togostanza-thead-font-weight","stanza:type":"text","stanza:default":"600","stanza:description":"Font weight of table header"},{"stanza:key":"--togostanza-thead-background-color","stanza:type":"color","stanza:default":"#C2E3F2","stanza:description":"Background color of table header"},{"stanza:key":"--togostanza-tbody-even-background-color","stanza:type":"color","stanza:default":"#F2F5F7","stanza:description":"Background color of table body (even row)"},{"stanza:key":"--togostanza-tbody-odd-background-color","stanza:type":"color","stanza:default":"#E6EBEF","stanza:description":"Background color of table body (odd row)"}]},{"@context":{"stanza":"http://togostanza.org/resource/stanza#"},"@id":"relate","stanza:label":"Relate","stanza:definition":"Relate MetaStanza","stanza:license":"MIT","stanza:author":"DBCLS","stanza:address":"https://github.com/togostanza/metastanza","stanza:contributor":["PENQE","Enishi Tech"],"stanza:created":"2024-10-11","stanza:updated":"2024-10-11","stanza:parameter":[{"stanza:key":"data-url","stanza:example":"https://raw.githubusercontent.com/togostanza/togostanza-data/refs/heads/main/samples/other/hapmap3204.pop.tsv","stanza:description":"Hapmap data source URL","stanza:required":true},{"stanza:key":"data-type","stanza:example":"tsv","stanza:description":"Data type","stanza:required":true},{"stanza:key":"data-folder-url","stanza:example":"https://raw.githubusercontent.com/togostanza/togostanza-data/refs/heads/main/samples/other/","stanza:description":"Data folder url","stanza:required":true},{"stanza:key":"data-id","stanza:example":"A2M_chr12_9062708_9120919","stanza:description":"ID of the analysis data","stanza:required":true},{"stanza:key":"togostanza-custom_css_url","stanza:example":"","stanza:description":"Stylesheet(css file) URL to override current style"}],"stanza:menu-placement":"bottom-right","stanza:style":[{"stanza:key":"--togostanza-canvas-height","stanza:type":"number","stanza:default":700,"stanza:description":"Metastanza height in px"},{"stanza:key":"--togostanza-canvas-padding","stanza:type":"text","stanza:default":"100px","stanza:description":"Padding of a stanza. CSS padding-like text (10px 10px 10px 10px)"},{"stanza:key":"--togostanza-theme-background_color","stanza:type":"color","stanza:default":"rgba(255,255,255,0)","stanza:description":"Background color"},{"stanza:key":"--togostanza-fonts-font_family","stanza:type":"text","stanza:default":"'Roboto Condensed', sans-serif","stanza:description":"Font family"},{"stanza:key":"--togostanza-fonts-font_color_primary","stanza:type":"color","stanza:default":"#4E5059","stanza:description":"Font color for value"},{"stanza:key":"--togostanza-fonts-font_size_primary","stanza:type":"number","stanza:default":10,"stanza:description":"Font size for value"},{"stanza:key":"--togostanza-fonts-font_weight_primary","stanza:type":"number","stanza:default":400,"stanza:description":"Font weight for value"}]}];

createApp(script, {allMetadata}).mount('body');
//# sourceMappingURL=index-app.js.map
