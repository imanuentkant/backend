import { v7 as uuidv7 } from 'uuid';

/**
 * UUID Generator - Centralized UUID generation
 * 
 * Sử dụng UUID v7 (time-based, sortable) thay vì v4 (random)
 * 
 * Benefits của v7:
 * - Sortable by creation time
 * - Better database index performance
 * - Easy to debug (sort by ID = sort by time)
 * - Still globally unique
 */
export class UuidGenerator {
  
  /**
   * Generate UUID v7 (time-based, sortable)
   * Recommend: Dùng method này cho tất cả entities
   */
  static generate(): string {
    return uuidv7();
  }
  
  /**
   * Generate UUID v7 từ timestamp cụ thể (for testing)
   */
  static generateFromTimestamp(timestamp: number): string {
    return uuidv7({ msecs: timestamp });
  }
  
  /**
   * Validate UUID format (v4 hoặc v7 đều OK)
   */
  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[47][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
  
  /**
   * Extract timestamp từ UUID v7
   * Only works với v7, v4 sẽ return invalid date
   */
  static extractTimestamp(uuid: string): Date | null {
    try {
      // UUID v7: First 48 bits = Unix timestamp milliseconds
      const hex = uuid.replace(/-/g, '').substring(0, 12);
      const timestamp = parseInt(hex, 16);
      
      // Validate timestamp reasonable (after 2020, before 2100)
      if (timestamp < 1577836800000 || timestamp > 4102444800000) {
        return null; // Likely not v7
      }
      
      return new Date(timestamp);
    } catch {
      return null;
    }
  }
  
  /**
   * Check if UUID is v7 (time-based)
   */
  static isV7(uuid: string): boolean {
    const version = uuid.charAt(14);
    return version === '7';
  }
  
  /**
   * Check if UUID is v4 (random)
   */
  static isV4(uuid: string): boolean {
    const version = uuid.charAt(14);
    return version === '4';
  }
  
  /**
   * Generate với custom prefix (for testing/debugging)
   * Example: "user_018b6e38-1234-7000-8000-000000000001"
   */
  static generateWithPrefix(prefix: string): string {
    return `${prefix}_${uuidv7()}`;
  }
  
  /**
   * Batch generate UUIDs
   */
  static generateBatch(count: number): string[] {
    return Array.from({ length: count }, () => uuidv7());
  }
}

