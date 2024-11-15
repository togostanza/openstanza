export async function loadFiles(filePaths: string[]): Promise<string[]> {
  const filePromises = filePaths.map(async (filePath) => {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.text();
  });
  return Promise.all(filePromises);
}

export function createSVGElement<T extends keyof SVGElementTagNameMap>(
  type: T,
  attributes: Record<string, { toString: () => string }> = {},
) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value.toString());
  }
  return element as SVGElementTagNameMap[T] & Record<string, any>;
}
