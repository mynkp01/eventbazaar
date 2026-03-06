export type EncodingMap = {
  [key: string]: string;
};

const defaultEncodingMap: EncodingMap = {
  _: "__",
  "-": "_",
  " ": "-",

  // "?": "-q-",
  // "/": "-or-",
  // "&": "-and-",
  // "+": "-plus-",
  // "@": "-at-",
  // "%": "-percent-",
};

export const customEncodeURIComponent = (str?: string): string => {
  let urlString = str?.trim()?.toLowerCase();

  Object.keys(defaultEncodingMap).forEach((key) => {
    if (urlString?.includes(key)) {
      urlString = urlString?.replaceAll(key, defaultEncodingMap[key]);
    }
  });

  return encodeURIComponent(urlString);
};

export const customDecodeURIComponent = (str?: string): string => {
  let decodedString = decodeURIComponent(str);

  Object.keys(defaultEncodingMap)
    ?.reverse()
    ?.forEach((key) => {
      decodedString = decodedString?.replaceAll(defaultEncodingMap[key], key);
    });

  return decodedString;
};
