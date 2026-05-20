import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  readonly data: T[];
  readonly pagination: PageMetaDto;

  constructor(data: T[], pagination: PageMetaDto) {
    this.data = data;
    this.pagination = pagination;
  }
}



