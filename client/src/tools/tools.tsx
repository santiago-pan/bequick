export function assertNever(x: never): never {
  throw new TypeError('Unexpected object: ' + x);
}