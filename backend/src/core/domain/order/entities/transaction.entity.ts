import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { TransactionStatus } from '@shared/types/transaction-status.enum';

export interface TransactionProps {
  userId: UniqueId;
  courseId?: UniqueId;
  amount: number;
  provider: string;
  transactionId: string;
  status: TransactionStatus;
}

export class Transaction extends Entity<TransactionProps> {
  get userId(): UniqueId {
    return this.props.userId;
  }

  get courseId(): UniqueId | undefined {
    return this.props.courseId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get provider(): string {
    return this.props.provider;
  }

  get transactionId(): string {
    return this.props.transactionId;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  public updateStatus(status: TransactionStatus): void {
    this.props.status = status;
  }

  public static create(props: Omit<TransactionProps, 'status'>): Transaction {
    return new Transaction(
      {
        ...props,
        status: TransactionStatus.PENDING,
      },
      UniqueId.generate(),
    );
  }

  public static reconstitute(props: TransactionProps, id: UniqueId): Transaction {
    return new Transaction(props, id);
  }
}



