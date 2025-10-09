import { Entity } from '@core/common/entity/Entity';

/**
 * BookableItemType - Các loại có thể booking
 */
export enum BookableItemType {
  PROPERTY = 'property',      // Nhà, căn hộ
  VEHICLE = 'vehicle',         // Xe, phương tiện
  SERVICE = 'service',         // Dịch vụ, tour
  ACTIVITY = 'activity',       // Hoạt động, trải nghiệm
  EQUIPMENT = 'equipment',     // Thiết bị, dụng cụ
}

/**
 * Interface cho các item có thể booking
 */
export interface IBookableItem {
  getId(): string;
  getTitle(): string;
  getDescription(): string;
  getPricePerUnit(): number;
  getCurrency(): string;
  getBookableType(): BookableItemType;
  isAvailable(startDate: Date, endDate: Date): Promise<boolean>;
  calculatePrice(startDate: Date, endDate: Date, quantity: number): PricingDetails;
}

/**
 * Chi tiết pricing
 */
export type PricingDetails = {
  basePrice: number;
  unitPrice: number;
  units: number;
  subtotal: number;
  additionalFees: AdditionalFee[];
  taxAmount: number;
  totalAmount: number;
  currency: string;
};

export type AdditionalFee = {
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  description?: string;
};

/**
 * Abstract base class cho BookableItem
 */
export abstract class BookableItem extends Entity<string> implements IBookableItem {
  
  protected title: string;
  protected description: string;
  protected pricePerUnit: number;
  protected currency: string;
  protected bookableType: BookableItemType;
  
  constructor(
    id: string | undefined,
    title: string,
    description: string,
    pricePerUnit: number,
    currency: string,
    bookableType: BookableItemType,
  ) {
    super();
    if (id) {
      this.id = id;
    }
    this.title = title;
    this.description = description;
    this.pricePerUnit = pricePerUnit;
    this.currency = currency;
    this.bookableType = bookableType;
  }
  
  public getTitle(): string {
    return this.title;
  }
  
  public getDescription(): string {
    return this.description;
  }
  
  public getPricePerUnit(): number {
    return this.pricePerUnit;
  }
  
  public getCurrency(): string {
    return this.currency;
  }
  
  public getBookableType(): BookableItemType {
    return this.bookableType;
  }
  
  /**
   * Kiểm tra tính khả dụng - phải implement bởi subclass
   */
  public abstract isAvailable(startDate: Date, endDate: Date): Promise<boolean>;
  
  /**
   * Tính toán giá - phải implement bởi subclass
   */
  public abstract calculatePrice(startDate: Date, endDate: Date, quantity: number): PricingDetails;
}

