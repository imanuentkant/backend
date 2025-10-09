import { Vehicle } from '@core/domain/vehicle/entity/Vehicle';
import { TypeOrmVehicle } from '@infrastructure/adapter/persistence/typeorm/entity/vehicle/TypeOrmVehicle';

export class VehicleMapper {
  
  public static toDomain(ormVehicle: TypeOrmVehicle): Vehicle {
    return new Vehicle({
      id: ormVehicle.id,
      ownerId: ormVehicle.ownerId,
      title: ormVehicle.title,
      description: ormVehicle.description,
      vehicleType: ormVehicle.vehicleType,
      brand: ormVehicle.brand,
      model: ormVehicle.model,
      year: ormVehicle.year,
      licensePlate: ormVehicle.licensePlate,
      color: ormVehicle.color,
      seats: ormVehicle.seats,
      transmissionType: ormVehicle.transmissionType,
      fuelType: ormVehicle.fuelType,
      condition: ormVehicle.condition,
      mileage: ormVehicle.mileage,
      pricePerDay: Number(ormVehicle.pricePerDay),
      pricePerHour: ormVehicle.pricePerHour ? Number(ormVehicle.pricePerHour) : undefined,
      currency: ormVehicle.currency,
      securityDeposit: Number(ormVehicle.securityDeposit),
      insuranceFee: Number(ormVehicle.insuranceFee),
      location: ormVehicle.location,
      latitude: ormVehicle.latitude ? Number(ormVehicle.latitude) : undefined,
      longitude: ormVehicle.longitude ? Number(ormVehicle.longitude) : undefined,
      status: ormVehicle.status,
      isInstantBooking: ormVehicle.instantBooking,
      features: ormVehicle.features ? ormVehicle.features.split(',').filter(f => f) : [],
      coverPhotoId: ormVehicle.coverPhotoId || undefined,
      createdAt: ormVehicle.createdAt,
      updatedAt: ormVehicle.updatedAt,
    });
  }
  
  public static toOrm(vehicle: Vehicle): TypeOrmVehicle {
    const ormVehicle = new TypeOrmVehicle();
    
    ormVehicle.id = vehicle.getId();
    ormVehicle.ownerId = vehicle.getOwnerId();
    ormVehicle.title = vehicle.getTitle();
    ormVehicle.description = vehicle.getDescription();
    ormVehicle.vehicleType = vehicle.getVehicleType();
    ormVehicle.brand = vehicle.getBrand();
    ormVehicle.model = vehicle.getModel();
    ormVehicle.year = vehicle.getYear();
    ormVehicle.licensePlate = vehicle.getLicensePlate();
    ormVehicle.color = vehicle.getColor();
    ormVehicle.seats = vehicle.getSeats();
    ormVehicle.transmissionType = vehicle.getTransmissionType();
    ormVehicle.fuelType = vehicle.getFuelType();
    ormVehicle.condition = vehicle.getCondition();
    ormVehicle.mileage = vehicle.getMileage();
    ormVehicle.pricePerDay = vehicle.getPricePerDay();
    ormVehicle.pricePerHour = vehicle.getPricePerHour() || null;
    ormVehicle.currency = vehicle.getCurrency();
    ormVehicle.securityDeposit = vehicle.getSecurityDeposit();
    ormVehicle.insuranceFee = vehicle.getInsuranceFee();
    ormVehicle.location = vehicle.getLocation();
    ormVehicle.latitude = vehicle.getLatitude() || null;
    ormVehicle.longitude = vehicle.getLongitude() || null;
    ormVehicle.status = vehicle.getStatus();
    ormVehicle.instantBooking = vehicle.isInstantBookingEnabled();
    ormVehicle.features = vehicle.getFeatures().join(',');
    ormVehicle.coverPhotoId = vehicle.getCoverPhotoId() || null;
    ormVehicle.createdAt = vehicle.getCreatedAt();
    ormVehicle.updatedAt = vehicle.getUpdatedAt();
    
    return ormVehicle;
  }
}

