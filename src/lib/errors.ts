/** Typed failures. Catch `LeetflixError` for anything this package threw on purpose. */

export class LeetflixError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class CatalogError extends LeetflixError {}

export class MarkerError extends LeetflixError {}

export class InputParseError extends LeetflixError {
  constructor(
    public readonly field: string,
    message: string,
  ) {
    super(message);
  }
}
