export interface CursorMetaDtoParameters {
  hasNextPage: boolean;
  nextCursor?: string | null;
}

export class CursorMetaDto {
  readonly hasNextPage: boolean;
  readonly nextCursor: string | null;

  constructor({ hasNextPage, nextCursor }: CursorMetaDtoParameters) {
    this.hasNextPage = hasNextPage;
    this.nextCursor = nextCursor ?? null;
  }
}
