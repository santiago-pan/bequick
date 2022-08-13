/**
 * Helper function for the type system to assert that the value is empty.
 *
 * @example
 *
 * ```
 * declare const type = 'one' | 'two';
 *
 * switch (type) {
 *   case 'one':
 *     return;
 *   default:
 *     assertNever(type); // Error: 'two' was not handled.
 * }
 * ```
 */
 export function assertNever(x: never): never {
  throw new TypeError('Unexpected object: ' + x);
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val == null) {
    throw new TypeError(`Expected 'val' to be defined, but received ${val}`);
  }
}
