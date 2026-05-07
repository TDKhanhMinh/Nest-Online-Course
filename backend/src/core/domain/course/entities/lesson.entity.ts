import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { LessonType } from '@shared/types/lesson-type.enum';

export interface LessonProps {
  sectionId: UniqueId;
  title: string;
  type: LessonType;
  contentUrl?: string;
  textContent?: string;
  duration?: number;
  orderIndex: number;
  isFreePreview: boolean;
}

export class Lesson extends Entity<LessonProps> {
  get sectionId(): UniqueId {
    return this.props.sectionId;
  }

  get title(): string {
    return this.props.title;
  }

  get type(): LessonType {
    return this.props.type;
  }

  get contentUrl(): string | undefined {
    return this.props.contentUrl;
  }

  get textContent(): string | undefined {
    return this.props.textContent;
  }

  get duration(): number | undefined {
    return this.props.duration;
  }

  get orderIndex(): number {
    return this.props.orderIndex;
  }

  get isFreePreview(): boolean {
    return this.props.isFreePreview;
  }

  public update(props: Partial<LessonProps>): void {
    if (props.title !== undefined) this.props.title = props.title;
    if (props.type !== undefined) this.props.type = props.type;
    if (props.contentUrl !== undefined) this.props.contentUrl = props.contentUrl;
    if (props.textContent !== undefined) this.props.textContent = props.textContent;
    if (props.duration !== undefined) this.props.duration = props.duration;
    if (props.orderIndex !== undefined) this.props.orderIndex = props.orderIndex;
    if (props.isFreePreview !== undefined) this.props.isFreePreview = props.isFreePreview;
  }

  public static create(
    props: Omit<LessonProps, 'isFreePreview'> & { isFreePreview?: boolean },
    id?: UniqueId,
  ): Lesson {
    return new Lesson(
      {
        ...props,
        isFreePreview: props.isFreePreview ?? false,
      },
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: LessonProps, id: UniqueId): Lesson {
    return new Lesson(props, id);
  }
}



