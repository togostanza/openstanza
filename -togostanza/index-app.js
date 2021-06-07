import { d as defineComponent, s as script$1, o as openBlock, c as createBlock, r as resolveComponent, w as withCtx, F as Fragment, a as renderList, b as createVNode, t as toDisplayString, e as createCommentVNode, f as createApp } from './Layout-ee150aa7.js';

var script = defineComponent({
  components: {
    Layout: script$1
  },

  props: ['allMetadata'],

  setup(props) {
    return props;
  }
});

const _hoisted_1 = /*#__PURE__*/createVNode("h1", { class: "display-4" }, "List of Stanzas", -1 /* HOISTED */);
const _hoisted_2 = {
  key: 0,
  class: "list-group mt-3"
};
const _hoisted_3 = {
  key: 0,
  class: "small text-muted text-truncate mt-1 mb-0"
};
const _hoisted_4 = { key: 1 };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Layout = resolveComponent("Layout");

  return (openBlock(), createBlock(_component_Layout, null, {
    default: withCtx(() => [
      _hoisted_1,
      (_ctx.allMetadata.length > 0)
        ? (openBlock(), createBlock("div", _hoisted_2, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.allMetadata, (metadata) => {
              return (openBlock(), createBlock("a", {
                key: metadata['@id'],
                href: `./${metadata['@id']}.html`,
                class: "list-group-item list-group-item-action py-3"
              }, [
                createVNode("div", null, toDisplayString(metadata['stanza:label']), 1 /* TEXT */),
                (metadata['stanza:definition'])
                  ? (openBlock(), createBlock("p", _hoisted_3, toDisplayString(metadata['stanza:definition']), 1 /* TEXT */))
                  : createCommentVNode("v-if", true)
              ], 8 /* PROPS */, ["href"]))
            }), 128 /* KEYED_FRAGMENT */))
          ]))
        : (openBlock(), createBlock("p", _hoisted_4, "No stanzas defined."))
    ]),
    _: 1 /* STABLE */
  }))
}

script.render = render;
script.__file = "node_modules/togostanza/src/components/Index.vue";

var allMetadata = [{"@context":{"stanza":"http://togostanza.org/resource/stanza#"},"@id":"manhattan-plot","stanza:label":"Manhattan plot","stanza:definition":"Manhattan plot MetaStanza (for GWAS)","stanza:type":"Stanza","stanza:display":"Chart","stanza:provider":"TogoStanza","stanza:license":"MIT","stanza:author":"c-nakashima","stanza:address":"nakashima@penqe.com","stanza:contributor":[],"stanza:created":"2021-01-13","stanza:updated":"2021-01-13","stanza:parameter":[{"stanza:key":"data-url","stanza:example":"","stanza:description":"Data source URL (json)","stanza:required":true},{"stanza:key":"chromosomeKey","stanza:example":"chr","stanza:description":"Key to a chromosome in data frame'","stanza:required":false},{"stanza:key":"positionKey","stanza:example":"stop","stanza:description":"Key to a position on chromosome in data frame","stanza:required":false},{"stanza:key":"pValueKey","stanza:example":"p-value","stanza:description":"Key to a p-value in data frame","stanza:required":false},{"stanza:key":"lowThresh","stanza:example":"4","stanza:description":"Filtering threshold (=log10(p-value))","stanza:required":false},{"stanza:key":"highThresh","stanza:example":"8","stanza:description":"Highlight threshold","stanza:required":false},{"stanza:key":"recordsPerPage","stanza:example":"20","stanza:description":"Records per a page to display on table","stanza:required":false}],"stanza:about-link-placement":"bottom-right","stanza:style":[{"stanza:key":"--togostanza-font-family","stanza:type":"text","stanza:default":"Arial","stanza:description":"Font family"},{"stanza:key":"--togostanza-discovery-color","stanza:type":"color","stanza:default":"#3D6589","stanza:description":"Plot color of discovery stage"},{"stanza:key":"--togostanza-replication-color","stanza:type":"color","stanza:default":"#ED707E","stanza:description":"Plot color of replication stage"},{"stanza:key":"--togostanza-combined-color","stanza:type":"color","stanza:default":"#EAB64E","stanza:description":"Plot color of combined stage"},{"stanza:key":"--togostanza-meta-analysis-color","stanza:type":"color","stanza:default":"#52B1C1","stanza:description":"Plot color of meta-analysis stage"},{"stanza:key":"--togostanza-not-provided-color","stanza:type":"color","stanza:default":"#62B28C","stanza:description":"Plot color of not-provided stage"},{"stanza:key":"--togostanza-slider-color","stanza:type":"color","stanza:default":"#C2E3F2","stanza:description":"Slider color"},{"stanza:key":"--togostanza-thead-font-size","stanza:type":"text","stanza:default":"14px","stanza:description":"Font size of table header"},{"stanza:key":"--togostanza-tbody-font-size","stanza:type":"text","stanza:default":"14px","stanza:description":"Font size of table body"},{"stanza:key":"--togostanza-thead-font-color","stanza:type":"color","stanza:default":"#002559","stanza:description":"Font color of table header"},{"stanza:key":"--togostanza-thead-font-weight","stanza:type":"text","stanza:default":"600","stanza:description":"Font weight of table header"},{"stanza:key":"--togostanza-thead-background-color","stanza:type":"color","stanza:default":"#C2E3F2","stanza:description":"Background color of table header"},{"stanza:key":"--togostanza-tbody-even-background-color","stanza:type":"color","stanza:default":"#F2F5F7","stanza:description":"Background color of table body (even row)"},{"stanza:key":"--togostanza-tbody-odd-background-color","stanza:type":"color","stanza:default":"#E6EBEF","stanza:description":"Background color of table body (odd row)"}]}];

createApp(script, {allMetadata}).mount('body');
//# sourceMappingURL=index-app.js.map
