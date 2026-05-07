import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainEvent } from './domain-event.base';

export abstract class Entity<TProps> {
  public readonly props: TProps;
  private readonly _id: UniqueId;

  constructor(props: TProps, id: UniqueId) {
    this.props = props;
    this._id = id;
  }

  get id(): UniqueId {
    return this._id;
  }

  equals(other: Entity<TProps>): boolean {
    return this._id.equals(other._id);
  }
}

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}



