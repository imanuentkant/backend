export type AuditLogEntry = {
  actorId: string | null;
  method: string;
  path: string;
  statusCode: number;
  ip: string | null;
  userAgent: string | null;
  body: any;
  params: any;
  query: any;
  createdAt: Date;
};
