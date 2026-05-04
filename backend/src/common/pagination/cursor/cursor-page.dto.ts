import { CursorMetaDto } from './cursor-meta.dto';

export class CursorPageDto<T> {
  readonly data: T[];
  readonly meta: CursorMetaDto;

  constructor(data: T[], meta: CursorMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
