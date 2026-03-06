export function setDeep<T>(
  obj: Record<string, any>,
  path: string,
  value: T,
): void {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Target must be a non-null object");
  }

  if (typeof path !== "string") {
    throw new Error("Path must be a string");
  }

  const keys = path.split(".");
  let current: Record<string, any> = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }
  }
}
