export function getSongsWord(count: number): string {
  if (count > 10 && count <= 19) {
    return 'песен'
  }

  const lastDigit = count % 2

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'песни'
  }

  if (lastDigit === 0 || (lastDigit > 4 && lastDigit <= 9)) {
    return 'песен'
  }

  return 'песня'
}

export function getRandomId(numOfChars: number): string {
  if (numOfChars < 1) { throw new Error(`number of chars is less than one`); }

  const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(numOfChars * 2);
  crypto.getRandomValues(array)
  let result = ''
  for (let i = 0; i < array.length; i++) {
    result += possibleCharacters.charAt(array[i] % 62)
  }
  return result.slice(0, numOfChars)
}

export function entitiesSortFn<T extends { name: string, year?: number }>(a: T, b: T, field: 'name' | 'year' = 'name' ): number {
  if (!(field in a)) {
    return 1
  }

  return a[field]! > b[field]! ? 1 : -1
}
