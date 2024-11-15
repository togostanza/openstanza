class Tooltip {
  arrowHeight = 5;
  #tip: HTMLDivElement | null = null;
  #tooltipTextElement: HTMLDivElement | null = null;
  #tipBorder: HTMLDivElement | null = null;
  #element: HTMLElement | null = null;

  static #instance: Tooltip | null = null;

  static get instance() {
    return Tooltip.#instance;
  }

  static initialise(root: HTMLElement | null) {
    if (!root) {
      throw new Error("Root element not found");
    }

    if (this.#instance) {
      return this.#instance;
    } else {
      this.#instance = new Tooltip(root);
      return this.#instance;
    }
  }

  private init(parent: Element | null) {
    if (!parent) {
      throw new Error("Tooltip parent is not defined");
    }

    this.#element = document.createElement("div");
    this.#element.style.position = "absolute";

    this.#element.id = "Tooltip";

    this.#tooltipTextElement = document.createElement("div");
    this.#tooltipTextElement.id = "TooltipText";

    this.#tooltipTextElement.style.zIndex = "10";
    this.#tooltipTextElement.style.position = "relative";
    this.#tooltipTextElement.style.backgroundColor = "white";
    this.#tooltipTextElement.style.padding = "5px";
    this.#tooltipTextElement.style.borderRadius = "5px";

    this.#tip = document.createElement("div");
    this.#tip.id = "TooltipTip";
    this.#tip.style.position = "absolute";
    this.#tip.style.backgroundColor = "white";
    this.#tip.style.left = "50%";
    this.#tip.style.transform = "translateX(-50%) rotate(45deg)";
    this.#tip.style.zIndex = "20";

    this.#tipBorder = document.createElement("div");
    this.#tipBorder.style.position = "absolute";
    this.#tipBorder.style.backgroundColor = "black";
    this.#tipBorder.style.left = "50%";
    this.#tipBorder.style.transform = "translateX(-50%) rotate(45deg)";
    this.#tipBorder.style.zIndex = "5";

    this.#element.appendChild(this.#tip);
    this.#element.appendChild(this.#tipBorder);

    this.#updateTip();

    this.#element.appendChild(this.#tooltipTextElement);

    parent.appendChild(this.#element);
  }

  private constructor(root: HTMLElement) {
    this.init(root);
  }

  #updateTip() {
    if (!this.#tip) {
      return;
    }

    if (!this.#tipBorder) {
      return;
    }

    this.#tip.style.width = this.arrowSquareSize + "px";
    this.#tip.style.height = this.arrowSquareSize + "px";
    this.#tip.style.bottom = -this.arrowHeight + 4 + "px";
    this.#tipBorder.style.width = this.arrowSquareSize + 2 + "px";
    this.#tipBorder.style.height = this.arrowSquareSize + 2 + "px";
    this.#tipBorder.style.bottom = -this.arrowHeight + 3 + "px";
  }

  get arrowSquareSize() {
    return Math.sqrt(2 * Math.pow(this.arrowHeight, 2));
  }

  show(message: string, x: number, y: number) {
    if (!this.#element) {
      return;
    }

    if (!this.#tooltipTextElement) {
      return;
    }

    this.#tooltipTextElement.innerText = message;
    this.#element.classList.add("-visible");
    const { width, height } = this.#element.getBoundingClientRect();
    this.#element.style.left = `${x - width / 2}px`;
    this.#element.style.top = `${y - height - this.arrowHeight}px`;
    this.#updateTip();
  }

  hide() {
    this.#element?.classList.remove("-visible");
  }
}

export { Tooltip };
