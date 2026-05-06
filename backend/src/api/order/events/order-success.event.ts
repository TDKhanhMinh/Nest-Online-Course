export class OrderSuccessEvent {
  constructor(
    public readonly orderId: string,
    public readonly studentId: string,
    public readonly courseIds: string[],
    public readonly studentEmail: string,
  ) {}
}
