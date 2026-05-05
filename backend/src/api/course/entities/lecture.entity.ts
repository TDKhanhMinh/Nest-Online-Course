import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export enum LectureType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
}

export interface LectureProps {
  sectionId: string;
  title: string;
  content: string;
  type: LectureType;
  order: number;
  videoUrl?: string;
  duration?: number;
  isPreview: boolean;
}

export class Lecture extends Entity<LectureProps> {
  get sectionId(): string {
    return this.props.sectionId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get type(): LectureType {
    return this.props.type;
  }

  get order(): number {
    return this.props.order;
  }

  get videoUrl(): string | undefined {
    return this.props.videoUrl;
  }

  get duration(): number | undefined {
    return this.props.duration;
  }

  get isPreview(): boolean {
    return this.props.isPreview;
  }

  public update(props: Partial<LectureProps>): void {
    if (props.title !== undefined) this.props.title = props.title;
    if (props.content !== undefined) this.props.content = props.content;
    if (props.type !== undefined) this.props.type = props.type;
    if (props.order !== undefined) this.props.order = props.order;
    if (props.videoUrl !== undefined) this.props.videoUrl = props.videoUrl;
    if (props.duration !== undefined) this.props.duration = props.duration;
    if (props.isPreview !== undefined) this.props.isPreview = props.isPreview;
  }

  public static create(props: Omit<LectureProps, 'isPreview'> & { isPreview?: boolean }, id?: string): Lecture {
    return new Lecture({
      ...props,
      isPreview: props.isPreview ?? false,
    }, id ? new UniqueId(id) : UniqueId.generate());
  }

  public static reconstitute(props: LectureProps, id: string): Lecture {
    return new Lecture(props, new UniqueId(id));
  }
}
