import { SwipeProfileUseCase } from '@core/service/dating/usecase/SwipeProfileUseCase';
import { CheckSwipeLimitUseCase } from '@core/service/dating/usecase/CheckSwipeLimitUseCase';
import { GetRecommendedProfilesUseCase } from '@core/service/dating/usecase/GetRecommendedProfilesUseCase';
import { CreateSubscriptionUseCase } from '@core/service/dating/usecase/CreateSubscriptionUseCase';
import { ActivateBoostUseCase } from '@core/service/dating/usecase/ActivateBoostUseCase';
import { SwipeAction } from '@core/domain/dating/entity/Swipe';
import { SubscriptionPlan } from '@core/domain/dating/entity/Subscription';

describe('Dating Use Cases - Unit Tests', () => {
  let mockSwipeRepo: any;
  let mockMatchRepo: any;
  let mockProfileRepo: any;
  let mockSubscriptionRepo: any;
  let mockBlockedRepo: any;
  let mockBoostRepo: any;
  let mockSettingsRepo: any;

  beforeEach(() => {
    // Mock repositories
    mockSwipeRepo = {
      save: jest.fn(),
      findByCustomers: jest.fn(),
      findLikedProfiles: jest.fn(),
      findByTargetProfileId: jest.fn(),
      checkMutualLike: jest.fn(),
      findLastSwipeByCustomer: jest.fn(),
      delete: jest.fn(),
    };

    mockMatchRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByCustomers: jest.fn(),
      findByCustomerId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockProfileRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByCustomerId: jest.fn(),
      findNearbyProfiles: jest.fn(),
    };

    mockSubscriptionRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByCustomerId: jest.fn(),
      findActiveByCustomerId: jest.fn(),
      update: jest.fn(),
    };

    mockBlockedRepo = {
      findByBlockerId: jest.fn(),
      findByBlockedId: jest.fn(),
      save: jest.fn(),
    };

    mockBoostRepo = {
      save: jest.fn(),
      findActiveBoostByCustomerId: jest.fn(),
      findAllActiveBoostedCustomers: jest.fn(),
    };

    mockSettingsRepo = {
      findByCustomerId: jest.fn(),
      save: jest.fn(),
    };
  });

  describe('SwipeProfileUseCase', () => {
    it('should enforce swipe limit for free users', async () => {
      const useCase = new SwipeProfileUseCase(
        mockSwipeRepo,
        mockMatchRepo,
        mockProfileRepo,
        mockSubscriptionRepo,
      );

      // Mock free user
      mockSubscriptionRepo.findActiveByCustomerId.mockResolvedValue(null);
      
      // Mock 50 swipes today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const swipes = Array(50).fill(null).map(() => ({
        getCreatedAt: () => new Date(),
      }));
      mockSwipeRepo.findLikedProfiles.mockResolvedValue(swipes);

      // Mock profile exists
      mockProfileRepo.findById.mockResolvedValue({
        getId: () => 'profile-1',
        getCustomerId: () => 'user-2',
      });

      // Should throw limit error
      await expect(
        useCase.execute({
          customerId: 'user-1',
          targetProfileId: 'profile-1',
          action: SwipeAction.LIKE,
        })
      ).rejects.toThrow('Daily swipe limit reached');
    });

    it('should allow unlimited swipes for premium users', async () => {
      const useCase = new SwipeProfileUseCase(
        mockSwipeRepo,
        mockMatchRepo,
        mockProfileRepo,
        mockSubscriptionRepo,
      );

      // Mock premium subscription
      mockSubscriptionRepo.findActiveByCustomerId.mockResolvedValue({
        isPremium: () => true,
      });

      mockProfileRepo.findById.mockResolvedValue({
        getId: () => 'profile-1',
        getCustomerId: () => 'user-2',
      });

      mockSwipeRepo.findByCustomers.mockResolvedValue(null);
      mockSwipeRepo.save.mockResolvedValue({
        getId: () => 'swipe-1',
        getAction: () => SwipeAction.LIKE,
        getCreatedAt: () => new Date(),
        isLike: () => true,
      });

      mockSwipeRepo.checkMutualLike.mockResolvedValue(false);

      // Should succeed
      const result = await useCase.execute({
        customerId: 'user-1',
        targetProfileId: 'profile-1',
        action: SwipeAction.LIKE,
      });

      expect(result).toHaveProperty('swipe');
      expect(mockSubscriptionRepo.findActiveByCustomerId).toHaveBeenCalled();
    });

    it('should create match on mutual like', async () => {
      const useCase = new SwipeProfileUseCase(
        mockSwipeRepo,
        mockMatchRepo,
        mockProfileRepo,
        mockSubscriptionRepo,
      );

      mockSubscriptionRepo.findActiveByCustomerId.mockResolvedValue({
        isPremium: () => true,
      });

      mockProfileRepo.findById.mockResolvedValue({
        getId: () => 'profile-1',
        getCustomerId: () => 'user-2',
      });

      mockSwipeRepo.findByCustomers.mockResolvedValue(null);
      mockSwipeRepo.save.mockResolvedValue({
        getId: () => 'swipe-1',
        getAction: () => SwipeAction.LIKE,
        getCreatedAt: () => new Date(),
        isLike: () => true,
      });

      // Mock mutual like
      mockSwipeRepo.checkMutualLike.mockResolvedValue(true);
      mockMatchRepo.save.mockResolvedValue({
        getId: () => 'match-1',
        getMatchedAt: () => new Date(),
      });

      const result = await useCase.execute({
        customerId: 'user-1',
        targetProfileId: 'profile-1',
        action: SwipeAction.LIKE,
      });

      expect(result.isMatch).toBe(true);
      expect(result.match).toBeDefined();
      expect(mockMatchRepo.save).toHaveBeenCalled();
    });
  });

  describe('CheckSwipeLimitUseCase', () => {
    it('should return correct limit for free users', async () => {
      const useCase = new CheckSwipeLimitUseCase(
        mockProfileRepo,
        mockSwipeRepo,
        mockSubscriptionRepo,
      );

      mockProfileRepo.findByCustomerId.mockResolvedValue({
        getId: () => 'profile-1',
      });

      mockSubscriptionRepo.findActiveByCustomerId.mockResolvedValue(null);

      // Mock 15 swipes today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const swipes = Array(15).fill(null).map(() => ({
        getCreatedAt: () => new Date(),
      }));
      mockSwipeRepo.findLikedProfiles.mockResolvedValue(swipes);

      const result = await useCase.execute({ customerId: 'user-1' });

      expect(result.isPremium).toBe(false);
      expect(result.dailyLimit).toBe(50);
      expect(result.swipesUsedToday).toBe(15);
      expect(result.remainingSwipes).toBe(35);
      expect(result.canSwipe).toBe(true);
    });

    it('should return unlimited for premium users', async () => {
      const useCase = new CheckSwipeLimitUseCase(
        mockProfileRepo,
        mockSwipeRepo,
        mockSubscriptionRepo,
      );

      mockProfileRepo.findByCustomerId.mockResolvedValue({
        getId: () => 'profile-1',
      });

      mockSubscriptionRepo.findActiveByCustomerId.mockResolvedValue({
        isPremium: () => true,
      });

      const result = await useCase.execute({ customerId: 'user-1' });

      expect(result.isPremium).toBe(true);
      expect(result.dailyLimit).toBe(-1);
      expect(result.remainingSwipes).toBe(-1);
      expect(result.canSwipe).toBe(true);
    });
  });

  describe('GetRecommendedProfilesUseCase', () => {
    it('should filter blocked users from recommendations', async () => {
      const useCase = new GetRecommendedProfilesUseCase(
        mockProfileRepo,
        mockSwipeRepo,
        mockBlockedRepo,
        mockBoostRepo,
        mockSettingsRepo,
      );

      mockProfileRepo.findByCustomerId.mockResolvedValue({
        getId: () => 'profile-1',
        isProfileActive: () => true,
        getLocation: () => ({ latitude: 10, longitude: 106 }),
        getInterestedIn: () => ['female'],
      });

      mockSettingsRepo.findByCustomerId.mockResolvedValue(null);

      mockProfileRepo.findNearbyProfiles.mockResolvedValue([
        { getId: () => 'p1', getCustomerId: () => 'u1', getAge: () => 25, isProfileVerified: () => true },
        { getId: () => 'p2', getCustomerId: () => 'u2', getAge: () => 28, isProfileVerified: () => true },
        { getId: () => 'p3', getCustomerId: () => 'u3', getAge: () => 30, isProfileVerified: () => true },
      ]);

      // Mock blocked users
      mockBlockedRepo.findByBlockerId.mockResolvedValue([
        { getBlockedId: () => 'u2' },
      ]);
      mockBlockedRepo.findByBlockedId.mockResolvedValue([]);

      mockSwipeRepo.findLikedProfiles.mockResolvedValue([]);
      mockBoostRepo.findAllActiveBoostedCustomers.mockResolvedValue([]);

      const result = await useCase.execute({ customerId: 'user-1', limit: 10 });

      // Should not include blocked user u2
      expect(result.length).toBeLessThan(3);
      expect(result.find((p: any) => p.getCustomerId() === 'u2')).toBeUndefined();
    });

    it('should prioritize boosted profiles', async () => {
      const useCase = new GetRecommendedProfilesUseCase(
        mockProfileRepo,
        mockSwipeRepo,
        mockBlockedRepo,
        mockBoostRepo,
        mockSettingsRepo,
      );

      mockProfileRepo.findByCustomerId.mockResolvedValue({
        getId: () => 'profile-1',
        isProfileActive: () => true,
        getLocation: () => ({ latitude: 10, longitude: 106 }),
        getInterestedIn: () => ['female'],
      });

      mockSettingsRepo.findByCustomerId.mockResolvedValue(null);

      mockProfileRepo.findNearbyProfiles.mockResolvedValue([
        { getId: () => 'p1', getCustomerId: () => 'u1', getAge: () => 25, isProfileVerified: () => true },
        { getId: () => 'p2', getCustomerId: () => 'u2', getAge: () => 28, isProfileVerified: () => true },
      ]);

      mockBlockedRepo.findByBlockerId.mockResolvedValue([]);
      mockBlockedRepo.findByBlockedId.mockResolvedValue([]);
      mockSwipeRepo.findLikedProfiles.mockResolvedValue([]);

      // Mock u2 is boosted
      mockBoostRepo.findAllActiveBoostedCustomers.mockResolvedValue(['u2']);

      const result = await useCase.execute({ customerId: 'user-1', limit: 10 });

      // Boosted profile should be first
      expect(result[0].getCustomerId()).toBe('u2');
    });
  });

  describe('CreateSubscriptionUseCase', () => {
    it('should create subscription for free user', async () => {
      const useCase = new CreateSubscriptionUseCase(mockSubscriptionRepo);

      mockSubscriptionRepo.findActiveByCustomerId.mockResolvedValue(null);
      mockSubscriptionRepo.save.mockResolvedValue({
        getId: () => 'sub-1',
        getPlan: () => SubscriptionPlan.PLUS,
        getStatus: () => 'active',
      });

      const result = await useCase.execute({
        customerId: 'user-1',
        plan: SubscriptionPlan.PLUS,
      });

      expect(result.getPlan()).toBe(SubscriptionPlan.PLUS);
      expect(mockSubscriptionRepo.save).toHaveBeenCalled();
    });

    it('should prevent duplicate active subscription', async () => {
      const useCase = new CreateSubscriptionUseCase(mockSubscriptionRepo);

      mockSubscriptionRepo.findActiveByCustomerId.mockResolvedValue({
        isPremium: () => true,
      });

      await expect(
        useCase.execute({
          customerId: 'user-1',
          plan: SubscriptionPlan.PLUS,
        })
      ).rejects.toThrow('already have an active subscription');
    });
  });

  describe('ActivateBoostUseCase', () => {
    it('should activate boost for user', async () => {
      const useCase = new ActivateBoostUseCase(
        mockBoostRepo,
        mockProfileRepo,
      );

      mockProfileRepo.findByCustomerId.mockResolvedValue({
        getId: () => 'profile-1',
      });

      mockBoostRepo.findActiveBoostByCustomerId.mockResolvedValue(null);
      mockBoostRepo.save.mockResolvedValue({
        getId: () => 'boost-1',
        getStartedAt: () => new Date(),
        getExpiresAt: () => new Date(Date.now() + 30 * 60 * 1000),
        getRemainingMinutes: () => 30,
      });

      const result = await useCase.execute({ customerId: 'user-1' });

      expect(result.getRemainingMinutes()).toBe(30);
      expect(mockBoostRepo.save).toHaveBeenCalled();
    });

    it('should prevent double boost', async () => {
      const useCase = new ActivateBoostUseCase(
        mockBoostRepo,
        mockProfileRepo,
      );

      mockProfileRepo.findByCustomerId.mockResolvedValue({
        getId: () => 'profile-1',
      });

      mockBoostRepo.findActiveBoostByCustomerId.mockResolvedValue({
        isCurrentlyActive: () => true,
        getRemainingMinutes: () => 15,
      });

      await expect(
        useCase.execute({ customerId: 'user-1' })
      ).rejects.toThrow('already have an active boost');
    });
  });
});

