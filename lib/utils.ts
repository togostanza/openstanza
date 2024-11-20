export function getMarginsFromCSSString(str: string) {
  const splitted = str.trim().split(/\W+/);

  const res = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  switch (splitted.length) {
    case 1:
      res.top = res.right = res.bottom = res.left = parseInt(splitted[0]) || 0;
      break;
    case 2:
      res.top = res.bottom = parseInt(splitted[0]) || 0;
      res.left = res.right = parseInt(splitted[1]) || 0;
      break;
    case 3:
      res.top = parseInt(splitted[0]) || 0;
      res.left = res.right = parseInt(splitted[1]) || 0;
      res.bottom = parseInt(splitted[2]) || 0;
      break;
    case 4:
      res.top = parseInt(splitted[0]) || 0;
      res.right = parseInt(splitted[1]) || 0;
      res.bottom = parseInt(splitted[2]) || 0;
      res.left = parseInt(splitted[3]) || 0;
      break;
    default:
      break;
  }

  return res;
}

export interface Margins {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
