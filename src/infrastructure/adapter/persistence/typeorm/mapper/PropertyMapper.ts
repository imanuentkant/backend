import { Property } from '@core/domain/property/entity/Property';
import { PropertyLocation } from '@core/domain/property/entity/PropertyLocation';
import { TypeOrmProperty } from '../entity/property/TypeOrmProperty';
import { TypeOrmPropertyLocation } from '../entity/property/TypeOrmPropertyLocation';

export class PropertyMapper {
  
  static toDomain(ormProperty: TypeOrmProperty, ormLocation?: TypeOrmPropertyLocation): Property {
    const location = ormLocation ? new PropertyLocation({
      id: ormLocation.id,
      propertyId: ormLocation.propertyId,
      address: ormLocation.address,
      city: ormLocation.city,
      state: ormLocation.state,
      country: ormLocation.country,
      postalCode: ormLocation.postalCode,
      latitude: Number(ormLocation.latitude),
      longitude: Number(ormLocation.longitude),
      createdAt: ormLocation.createdAt,
      updatedAt: ormLocation.createdAt,
    }) : undefined;
    
    const property = new Property({
      id: ormProperty.id,
      hostId: ormProperty.hostId,
      title: ormProperty.title,
      description: ormProperty.description,
      propertyType: ormProperty.propertyType as any,
      maxGuests: ormProperty.maxGuests,
      bedrooms: ormProperty.bedrooms,
      beds: ormProperty.beds,
      bathrooms: Number(ormProperty.bathrooms),
      pricePerNight: Number(ormProperty.pricePerNight),
      currency: ormProperty.currency,
      cleaningFee: Number(ormProperty.cleaningFee),
      serviceFeePercentage: Number(ormProperty.serviceFeePercentage),
      minimumNights: ormProperty.minimumNights,
      maximumNights: ormProperty.maximumNights,
      instantBooking: ormProperty.instantBooking,
      status: ormProperty.status as any,
      createdAt: ormProperty.createdAt,
      updatedAt: ormProperty.updatedAt,
    });
    
    // Set additional properties after construction
    if (location) {
      (property as any).location = location;
    }
    if (ormProperty.coverPhotoId) {
      (property as any).coverPhotoId = ormProperty.coverPhotoId;
    }
    
    return property;
  }
  
  static toOrmProperty(property: Property): TypeOrmProperty {
    const orm = new TypeOrmProperty();
    orm.id = property.getId();
    orm.hostId = property.getHostId();
    orm.title = property.getTitle();
    orm.description = property.getDescription();
    orm.propertyType = property.getPropertyType();
    orm.maxGuests = property.getMaxGuests();
    orm.bedrooms = property.getBedrooms();
    orm.beds = property.getBeds();
    orm.bathrooms = property.getBathrooms();
    orm.pricePerNight = property.getPricePerNight();
    orm.currency = property.getCurrency();
    orm.cleaningFee = property.getCleaningFee();
    orm.serviceFeePercentage = property.getServiceFeePercentage();
    orm.minimumNights = property.getMinimumNights();
    orm.maximumNights = property.getMaximumNights();
    orm.instantBooking = property.isInstantBooking();
    orm.status = property.getStatus();
    orm.coverPhotoId = property.getCoverPhotoId() || null;
    orm.createdAt = property.getCreatedAt();
    orm.updatedAt = property.getCreatedAt();
    orm.removedAt = null;
    return orm;
  }
  
  static toOrmLocation(location: PropertyLocation): TypeOrmPropertyLocation {
    const orm = new TypeOrmPropertyLocation();
    orm.id = location.getId();
    orm.propertyId = location.getPropertyId();
    orm.address = location.getAddress();
    orm.city = location.getCity();
    orm.state = location.getState();
    orm.country = location.getCountry();
    orm.postalCode = location.getPostalCode();
    orm.latitude = location.getLatitude();
    orm.longitude = location.getLongitude();
    orm.createdAt = location.getCreatedAt();
    return orm;
  }
}

