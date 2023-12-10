
/**
 * Generates an array of numbers within a specified range.
 * @param start - The starting number of the range.
 * @param stop - The ending number of the range.
 * @returns An array of numbers within the specified range.
 */
export const range = (start: number, stop: number) => {
    return [...Array(stop - start + 1).keys()]
      .map(v => start + v)
}