import { AuditLogEntry } from '@core/common/audit/AuditLogTypes';

export interface AuditLogAsyncAppenderPort {
  append(entry: AuditLogEntry): Promise<void>;
}
