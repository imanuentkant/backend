import { BookableItem, BookableItemType, PricingDetails, AdditionalFee } from '@core/common/entity/BookableItem';
import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';
import { VehicleType, VehicleStatus, TransmissionType, FuelType, VehicleCondition } from '@core/common/enums/VehicleEnums';

export class Vehicle extends TimestampedEntity<string> {
  
  private ownerId: string;
  private title: string;
  private description: string;
  private vehicleType: VehicleType;
  private brand: string;
  private model: string;
  private year: number;
  private licensePlate: string;
  private color: string;
  private seats: number;
  private transmissionType: TransmissionType;
  private fuelType: FuelType;
  private condition: VehicleCondition;
  private mileage: number; // in kilometers
  
  // Pricing
  private pricePerDay: number;
  private pricePerHour?: number;
  private currency: string;
  private securityDeposit: number;
  private insuranceFee: number;
  
  // Location
  private location: string;
  private latitude?: number;
  private longitude?: number;
  
  // Status
  private status: VehicleStatus;
  private isInstantBooking: boolean;
  
  // Features
  private features: string[]; // ['GPS', 'Bluetooth', 'AC', etc.]
  private coverPhotoId?: string;
  
  constructor(payload: {
    id?: string,
    ownerId: string,
    title: string,
    description: string,
    vehicleType: VehicleType,
    brand: string,
    model: string,
    year: number,
    licensePlate: string,
    color: string,
    seats: number,
    transmissionType: TransmissionType,
    fuelType: FuelType,
    condition: VehicleCondition,
    mileage: number,
    pricePerDay: number,
    pricePerHour?: number,
    currency?: string,
    securityDeposit?: number,
    insuranceFee?: number,
    location: string,
    latitude?: number,
    longitude?: number,
    status?: VehicleStatus,
    isInstantBooking?: boolean,
    features?: string[],
    coverPhotoId?: string,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.ownerId = payload.ownerId;
    this.title = payload.title;
    this.description = payload.description;
    this.vehicleType = payload.vehicleType;
    this.brand = payload.brand;
    this.model = payload.model;
    this.year = payload.year;
    this.licensePlate = payload.licensePlate;
    this.color = payload.color;
    this.seats = payload.seats;
    this.transmissionType = payload.transmissionType;
    this.fuelType = payload.fuelType;
    this.condition = payload.condition;
    this.mileage = payload.mileage;
    this.pricePerDay = payload.pricePerDay;
    this.pricePerHour = payload.pricePerHour;
    this.currency = payload.currency || 'USD';
    this.securityDeposit = payload.securityDeposit || 0;
    this.insuranceFee = payload.insuranceFee || 0;
    this.location = payload.location;
    this.latitude = payload.latitude;
    this.longitude = payload.longitude;
    this.status = payload.status || VehicleStatus.AVAILABLE;
    this.isInstantBooking = payload.isInstantBooking || false;
    this.features = payload.features || [];
    this.coverPhotoId = payload.coverPhotoId;
  }
  
  public static async new(payload: {
    ownerId: string,
    title: string,
    description: string,
    vehicleType: VehicleType,
    brand: string,
    model: string,
    year: number,
    licensePlate: string,
    color: string,
    seats: number,
    transmissionType: TransmissionType,
    fuelType: FuelType,
    condition: VehicleCondition,
    mileage: number,
    pricePerDay: number,
    pricePerHour?: number,
    currency?: string,
    securityDeposit?: number,
    insuranceFee?: number,
    location: string,
    latitude?: number,
    longitude?: number,
    features?: string[],
  }): Promise<Vehicle> {
    const vehicle = new Vehicle(payload);
    await vehicle.validate();
    return vehicle;
  }
  
  public async validate(): Promise<void> {
    if (!this.title || this.title.length < 5) {
      throw new Error('Title must be at least 5 characters');
    }
    
    if (!this.description || this.description.length < 20) {
      throw new Error('Description must be at least 20 characters');
    }
    
    if (this.pricePerDay <= 0) {
      throw new Error('Price per day must be greater than 0');
    }
    
    if (this.year < 1900 || this.year > new Date().getFullYear() + 1) {
      throw new Error('Invalid year');
    }
    
    if (this.seats < 1 || this.seats > 50) {
      throw new Error('Seats must be between 1 and 50');
    }
  }
  
  /**
   * Calculate pricing for vehicle rental
   */
  public calculatePrice(startDate: Date, endDate: Date, useHourly: boolean = false): PricingDetails {
    const diffMs = endDate.getTime() - startDate.getTime();
    
    let units: number;
    let unitPrice: number;
    let unitName: string;
    
    if (useHourly && this.pricePerHour) {
      units = Math.ceil(diffMs / (1000 * 60 * 60)); // hours
      unitPrice = this.pricePerHour;
      unitName = 'hour';
    } else {
      units = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // days
      unitPrice = this.pricePerDay;
      unitName = 'day';
    }
    
    const subtotal = unitPrice * units;
    
    const additionalFees: AdditionalFee[] = [];
    
    if (this.insuranceFee > 0) {
      additionalFees.push({
        name: 'Insurance',
        amount: this.insuranceFee * units,
        type: 'fixed',
        description: `Insurance coverage for ${units} ${unitName}(s)`,
      });
    }
    
    if (this.securityDeposit > 0) {
      additionalFees.push({
        name: 'Security Deposit',
        amount: this.securityDeposit,
        type: 'fixed',
        description: 'Refundable security deposit',
      });
    }
    
    // Service fee 10%
    const serviceFee = subtotal * 0.10;
    additionalFees.push({
      name: 'Service Fee',
      amount: serviceFee,
      type: 'percentage',
      description: '10% platform service fee',
    });
    
    const totalFees = additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
    const taxAmount = (subtotal + totalFees - this.securityDeposit) * 0.08; // 8% tax
    const totalAmount = subtotal + totalFees + taxAmount;
    
    return {
      basePrice: unitPrice,
      unitPrice,
      units,
      subtotal,
      additionalFees,
      taxAmount,
      totalAmount,
      currency: this.currency,
    };
  }
  
  // Getters
  public getOwnerId(): string { return this.ownerId; }
  public getTitle(): string { return this.title; }
  public getDescription(): string { return this.description; }
  public getVehicleType(): VehicleType { return this.vehicleType; }
  public getBrand(): string { return this.brand; }
  public getModel(): string { return this.model; }
  public getYear(): number { return this.year; }
  public getLicensePlate(): string { return this.licensePlate; }
  public getColor(): string { return this.color; }
  public getSeats(): number { return this.seats; }
  public getTransmissionType(): TransmissionType { return this.transmissionType; }
  public getFuelType(): FuelType { return this.fuelType; }
  public getCondition(): VehicleCondition { return this.condition; }
  public getMileage(): number { return this.mileage; }
  public getPricePerDay(): number { return this.pricePerDay; }
  public getPricePerHour(): number | undefined { return this.pricePerHour; }
  public getCurrency(): string { return this.currency; }
  public getSecurityDeposit(): number { return this.securityDeposit; }
  public getInsuranceFee(): number { return this.insuranceFee; }
  public getLocation(): string { return this.location; }
  public getLatitude(): number | undefined { return this.latitude; }
  public getLongitude(): number | undefined { return this.longitude; }
  public getStatus(): VehicleStatus { return this.status; }
  public isInstantBookingEnabled(): boolean { return this.isInstantBooking; }
  public getFeatures(): string[] { return this.features; }
  public getCoverPhotoId(): string | undefined { return this.coverPhotoId; }
  
  // Setters
  public setStatus(status: VehicleStatus): void {
    this.status = status;
    this.updateUpdatedAt();
  }
  
  public updateMileage(mileage: number): void {
    if (mileage < this.mileage) {
      throw new Error('Mileage cannot decrease');
    }
    this.mileage = mileage;
    this.updateUpdatedAt();
  }
  
  public setCoverPhoto(photoId: string): void {
    this.coverPhotoId = photoId;
    this.updateUpdatedAt();
  }
}

