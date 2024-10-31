import CONF from "../conf.js";
import { createSVGElement } from "../util.js";

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

      const height = CONF.haplotypeViewWidth + CONF.haplotypeViewGap;
      const x = -width + CheckboxInSVG.textPadding.x;
      const y = -CONF.haplotypeViewGap / 2;

      this.#rect.setAttribute("width", width);
      this.#rect.setAttribute("height", height);
      this.#rect.setAttribute("x", x);
      this.#rect.setAttribute("y", y);
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
    this.#container.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        detail: {
          shiftKey,
        },
      })
    );
  }

  #update() {
    if (this.#checked) {
      for (const tspan of this.#labelEl.children) {
        tspan.style.fill = "white";
      }
    } else {
      for (const tspan of this.#labelEl.children) {
        tspan.style.fill = "";
      }
    }

    this.#rect.classList.toggle("-selected", this.#checked);
  }
}

export { CheckboxInSVG };
