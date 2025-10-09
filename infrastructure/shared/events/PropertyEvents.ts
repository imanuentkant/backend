/**
 * Property Service Events
 * 
 * Events published by Property/Airbnb Service to Kafka
 */

export interface BaseEvent {
  eventType: string;
  eventId: string;
  timestamp: string;
  sourceService: 'property-service';
}

// Property Events
export interface PropertyCreatedEvent extends BaseEvent {
  eventType: 'property.created';
  data: {
    propertyId: string;
    hostId: string;
    title: string;
    propertyType: 'APARTMENT' | 'HOUSE' | 'VILLA' | 'CONDO' | 'HOTEL';
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    pricePerNight: number;
    currency: string;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
}

export interface PropertyUpdatedEvent extends BaseEvent {
  eventType: 'property.updated';
  data: {
    propertyId: string;
    hostId: string;
    updatedFields: string[];
  };
}

export interface PropertyDeletedEvent extends BaseEvent {
  eventType: 'property.deleted';
  data: {
    propertyId: string;
    hostId: string;
    reason?: string;
  };
}

export interface PropertyPublishedEvent extends BaseEvent {
  eventType: 'property.published';
  data: {
    propertyId: string;
    hostId: string;
    publishedAt: string;
  };
}

export interface PropertyUnpublishedEvent extends BaseEvent {
  eventType: 'property.unpublished';
  data: {
    propertyId: string;
    hostId: string;
    reason?: string;
  };
}

// Availability Events
export interface PropertyAvailabilityChangedEvent extends BaseEvent {
  eventType: 'property.availability.changed';
  data: {
    propertyId: string;
    hostId: string;
    dates: {
      date: string;
      available: boolean;
      price?: number;
    }[];
  };
}

// Booking Events
export interface PropertyBookingRequestedEvent extends BaseEvent {
  eventType: 'property.booking.requested';
  data: {
    bookingId: string;
    propertyId: string;
    hostId: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalPrice: number;
    currency: string;
  };
}

export interface PropertyBookingConfirmedEvent extends BaseEvent {
  eventType: 'property.booking.confirmed';
  data: {
    bookingId: string;
    propertyId: string;
    hostId: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
  };
}

export interface PropertyBookingCancelledEvent extends BaseEvent {
  eventType: 'property.booking.cancelled';
  data: {
    bookingId: string;
    propertyId: string;
    cancelledBy: 'HOST' | 'GUEST' | 'SYSTEM';
    reason?: string;
  };
}

// Photo Events
export interface PropertyPhotoAddedEvent extends BaseEvent {
  eventType: 'property.photo.added';
  data: {
    propertyId: string;
    photoId: string;
    photoUrl: string;
    isCover: boolean;
  };
}

export interface PropertyPhotoRemovedEvent extends BaseEvent {
  eventType: 'property.photo.removed';
  data: {
    propertyId: string;
    photoId: string;
  };
}

// Review Events
export interface PropertyReviewCreatedEvent extends BaseEvent {
  eventType: 'property.review.created';
  data: {
    reviewId: string;
    propertyId: string;
    guestId: string;
    bookingId: string;
    rating: number;
    comment: string;
  };
}

export interface PropertyRatingUpdatedEvent extends BaseEvent {
  eventType: 'property.rating.updated';
  data: {
    propertyId: string;
    averageRating: number;
    totalReviews: number;
  };
}

// Wishlist Events
export interface PropertyAddedToWishlistEvent extends BaseEvent {
  eventType: 'property.wishlist.added';
  data: {
    propertyId: string;
    userId: string;
  };
}

export interface PropertyRemovedFromWishlistEvent extends BaseEvent {
  eventType: 'property.wishlist.removed';
  data: {
    propertyId: string;
    userId: string;
  };
}

// Search Events
export interface PropertySearchPerformedEvent extends BaseEvent {
  eventType: 'property.search.performed';
  data: {
    userId?: string;
    location: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    minPrice?: number;
    maxPrice?: number;
    resultsCount: number;
  };
}

// Union type for all property events
export type PropertyEvent =
  | PropertyCreatedEvent
  | PropertyUpdatedEvent
  | PropertyDeletedEvent
  | PropertyPublishedEvent
  | PropertyUnpublishedEvent
  | PropertyAvailabilityChangedEvent
  | PropertyBookingRequestedEvent
  | PropertyBookingConfirmedEvent
  | PropertyBookingCancelledEvent
  | PropertyPhotoAddedEvent
  | PropertyPhotoRemovedEvent
  | PropertyReviewCreatedEvent
  | PropertyRatingUpdatedEvent
  | PropertyAddedToWishlistEvent
  | PropertyRemovedFromWishlistEvent
  | PropertySearchPerformedEvent;

