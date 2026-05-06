import { Entity } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { TransactionStatus } from '@/common/types/transaction-status.enum';

export interface TransactionProps {
  userId: string;
  courseId?: string;
  amount: number;
  provider: string;
  transactionId: string;
  status: TransactionStatus;
}

export class Transaction extends Entity<TransactionProps> {
  get userId(): string {
    return this.props.userId;
  }

  get courseId(): string | undefined {
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

  public static reconstitute(props: TransactionProps, id: string): Transaction {
    return new Transaction(props, new UniqueId(id));
  }
}
