import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

/**
 * Decorator để define cache key cho endpoint
 * @param keyPrefix - Prefix cho cache key
 * @param ttl - Time to live in seconds (optional)
 */
export const CacheKey = (keyPrefix: string, ttl?: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, keyPrefix)(target, propertyKey, descriptor);
    if (ttl) {
      SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    }
    return descriptor;
  };
};

