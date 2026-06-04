import { Entity } from '@shared/abstractions/aggregate-root.base';
import { UniqueId } from '@shared/types/unique-id.vo';
import { TransactionStatus } from '@shared/types/transaction-status.enum';
import { PaymentMethod } from '@shared/types/payment-method.enum';

export interface TransactionProps {
  userId: UniqueId;
  orderId: UniqueId;
  courseId?: UniqueId;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  amountVnd: number;
  currency: 'VND' | 'USD';
  amount: number;
  exchangeRate?: number;
  gatewayOrderId?: string;
  gatewayTransactionNo?: string;
  gatewayResponseCode?: string;
  gatewayMessage?: string;
  paymentUrl?: string;
  rawRequest?: unknown;
  rawResponse?: unknown;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

export class Transaction extends Entity<TransactionProps> {
  get userId(): UniqueId { return this.props.userId; }
  get orderId(): UniqueId { return this.props.orderId; }
  get courseId(): UniqueId | undefined { return this.props.courseId; }
  get paymentMethod(): PaymentMethod { return this.props.paymentMethod; }
  get status(): TransactionStatus { return this.props.status; }
  get amountVnd(): number { return this.props.amountVnd; }
  get currency(): 'VND' | 'USD' { return this.props.currency; }
  get amount(): number { return this.props.amount; }
  get exchangeRate(): number | undefined { return this.props.exchangeRate; }
  get gatewayOrderId(): string | undefined { return this.props.gatewayOrderId; }
  get gatewayTransactionNo(): string | undefined { return this.props.gatewayTransactionNo; }
  get gatewayResponseCode(): string | undefined { return this.props.gatewayResponseCode; }
  get gatewayMessage(): string | undefined { return this.props.gatewayMessage; }
  get paymentUrl(): string | undefined { return this.props.paymentUrl; }
  get rawRequest(): unknown | undefined { return this.props.rawRequest; }
  get rawResponse(): unknown | undefined { return this.props.rawResponse; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get paidAt(): Date | undefined { return this.props.paidAt; }

  public updateStatus(status: TransactionStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  public setPaymentUrl(url: string): void {
    this.props.paymentUrl = url;
    this.props.updatedAt = new Date();
  }

  public setGatewayOrderId(id: string): void {
    this.props.gatewayOrderId = id;
    this.props.updatedAt = new Date();
  }

  public setRawResponse(response: unknown): void {
    this.props.rawResponse = response;
    this.props.updatedAt = new Date();
  }

  public markAsSuccess(gatewayTransactionNo: string, rawResponse?: unknown): void {
    this.props.status = TransactionStatus.SUCCESS;
    this.props.gatewayTransactionNo = gatewayTransactionNo;
    this.props.rawResponse = rawResponse;
    this.props.paidAt = new Date();
    this.props.updatedAt = new Date();
  }

  public markAsFailed(code?: string, message?: string, rawResponse?: unknown): void {
    this.props.status = TransactionStatus.FAILED;
    this.props.gatewayResponseCode = code;
    this.props.gatewayMessage = message;
    this.props.rawResponse = rawResponse;
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<TransactionProps, 'status' | 'createdAt' | 'updatedAt' | 'paidAt'>,
    id?: UniqueId,
  ): Transaction {
    const now = new Date();
    return new Transaction(
      {
        ...props,
        status: TransactionStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      },
      id ?? UniqueId.generate(),
    );
  }

  public static reconstitute(props: TransactionProps, id: UniqueId): Transaction {
    return new Transaction(props, id);
  }
}
