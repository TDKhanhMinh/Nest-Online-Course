import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';

export interface SectionProps {
  courseId: string;
  title: string;
  orderIndex: number;
}

export class Section extends Entity<SectionProps> {
  get courseId(): string {
    return this.props.courseId;
  }

  get title(): string {
    return this.props.title;
  }

  get orderIndex(): number {
    return this.props.orderIndex;
  }

  public update(props: Partial<SectionProps>): void {
    if (props.title !== undefined) this.props.title = props.title;
    if (props.orderIndex !== undefined) this.props.orderIndex = props.orderIndex;
  }

  public static create(props: SectionProps, id?: string): Section {
    return new Section(props, id ? new UniqueId(id) : UniqueId.generate());
  }

  public static reconstitute(props: SectionProps, id: string): Section {
    return new Section(props, new UniqueId(id));
  }
}
