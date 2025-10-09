import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { CreateDatingProfileUseCase } from '@core/service/dating/usecase/CreateDatingProfileUseCase';
import { SwipeProfileUseCase } from '@core/service/dating/usecase/SwipeProfileUseCase';
import { GetMatchesUseCase } from '@core/service/dating/usecase/GetMatchesUseCase';
import { ProposeDateUseCase } from '@core/service/dating/usecase/ProposeDateUseCase';
import { RespondToDateProposalUseCase } from '@core/service/dating/usecase/RespondToDateProposalUseCase';
import { GetRecommendedProfilesUseCase } from '@core/service/dating/usecase/GetRecommendedProfilesUseCase';
import { BlockUserUseCase } from '@core/service/dating/usecase/BlockUserUseCase';
import { UnblockUserUseCase } from '@core/service/dating/usecase/UnblockUserUseCase';
import { GetBlockedUsersUseCase } from '@core/service/dating/usecase/GetBlockedUsersUseCase';
import { ReportUserUseCase } from '@core/service/dating/usecase/ReportUserUseCase';
import { UpdateDatingSettingsUseCase } from '@core/service/dating/usecase/UpdateDatingSettingsUseCase';
import { GetDatingSettingsUseCase } from '@core/service/dating/usecase/GetDatingSettingsUseCase';
import { GetDateProposalsUseCase } from '@core/service/dating/usecase/GetDateProposalsUseCase';
import { TrackProfileViewUseCase } from '@core/service/dating/usecase/TrackProfileViewUseCase';
import { GetProfileViewStatsUseCase } from '@core/service/dating/usecase/GetProfileViewStatsUseCase';
import { GetReceivedLikesUseCase } from '@core/service/dating/usecase/GetReceivedLikesUseCase';
import { UndoLastSwipeUseCase } from '@core/service/dating/usecase/UndoLastSwipeUseCase';
import { ActivateBoostUseCase } from '@core/service/dating/usecase/ActivateBoostUseCase';
import { GetBoostStatusUseCase } from '@core/service/dating/usecase/GetBoostStatusUseCase';
import { CreateSubscriptionUseCase } from '@core/service/dating/usecase/CreateSubscriptionUseCase';
import { GetSubscriptionStatusUseCase } from '@core/service/dating/usecase/GetSubscriptionStatusUseCase';
import { CancelSubscriptionUseCase } from '@core/service/dating/usecase/CancelSubscriptionUseCase';
import { UpgradeSubscriptionUseCase } from '@core/service/dating/usecase/UpgradeSubscriptionUseCase';
import { CheckSwipeLimitUseCase } from '@core/service/dating/usecase/CheckSwipeLimitUseCase';
import { Request } from 'express';

/**
 * Dating Controller - Tinder-like dating system
 */
@Controller('api/dating')
@ApiTags('Dating')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class DatingController {
  constructor(
    private readonly createProfileUseCase: CreateDatingProfileUseCase,
    private readonly swipeProfileUseCase: SwipeProfileUseCase,
    private readonly getMatchesUseCase: GetMatchesUseCase,
    private readonly proposeDateUseCase: ProposeDateUseCase,
    private readonly respondToProposalUseCase: RespondToDateProposalUseCase,
    private readonly getDateProposalsUseCase: GetDateProposalsUseCase,
    private readonly getRecommendedProfilesUseCase: GetRecommendedProfilesUseCase,
    private readonly blockUserUseCase: BlockUserUseCase,
    private readonly unblockUserUseCase: UnblockUserUseCase,
    private readonly getBlockedUsersUseCase: GetBlockedUsersUseCase,
    private readonly reportUserUseCase: ReportUserUseCase,
    private readonly updateSettingsUseCase: UpdateDatingSettingsUseCase,
    private readonly getSettingsUseCase: GetDatingSettingsUseCase,
    private readonly trackProfileViewUseCase: TrackProfileViewUseCase,
    private readonly getProfileViewStatsUseCase: GetProfileViewStatsUseCase,
    private readonly getReceivedLikesUseCase: GetReceivedLikesUseCase,
    private readonly undoLastSwipeUseCase: UndoLastSwipeUseCase,
    private readonly activateBoostUseCase: ActivateBoostUseCase,
    private readonly getBoostStatusUseCase: GetBoostStatusUseCase,
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly getSubscriptionStatusUseCase: GetSubscriptionStatusUseCase,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private readonly upgradeSubscriptionUseCase: UpgradeSubscriptionUseCase,
    private readonly checkSwipeLimitUseCase: CheckSwipeLimitUseCase,
  ) {}

  /**
   * Create dating profile
   */
  @Post('profile')
  @ApiOperation({ summary: 'Tạo dating profile' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  async createProfile(@Body() body: any, @Req() request: Request) {
    const customerId = (request as any).user.id;

    const profile = await this.createProfileUseCase.execute({
      customerId,
      ...body,
    });

    return {
      id: profile.getId(),
      customerId: profile.getCustomerId(),
      displayName: profile.getDisplayName(),
      age: profile.getAge(),
      bio: profile.getBio(),
      location: profile.getLocation(),
      createdAt: profile.getCreatedAt(),
      message: 'Dating profile created successfully!',
    };
  }

  /**
   * Get recommended profiles (discover)
   */
  @Get('discover')
  @ApiOperation({ summary: 'Lấy profiles được recommend' })
  @ApiResponse({ status: 200, description: 'Recommended profiles' })
  async getRecommendedProfiles(@Req() request: Request, @Query('limit') limit?: number) {
    const customerId = (request as any).user.id;

    const profiles = await this.getRecommendedProfilesUseCase.execute({
      customerId,
      limit: limit || 10,
    });

    return {
      data: profiles.map(p => ({
        id: p.getId(),
        displayName: p.getDisplayName(),
        age: p.getAge(),
        bio: p.getBio(),
        photos: p.getPhotos(),
        location: p.getLocation(),
        interests: p.getInterests(),
        occupation: p.getOccupation(),
        education: p.getEducation(),
        height: p.getHeight(),
        isVerified: p.isProfileVerified(),
      })),
      total: profiles.length,
    };
  }

  /**
   * Swipe on profile (like/pass)
   */
  @Post('swipe')
  @ApiOperation({ summary: 'Swipe profile (like/pass/super_like)' })
  @ApiResponse({ status: 200, description: 'Swipe recorded' })
  async swipeProfile(
    @Body() body: { profileId: string; action: string; isSuperLike?: boolean },
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;

    const result = await this.swipeProfileUseCase.execute({
      customerId,
      targetProfileId: body.profileId,
      action: body.action as any,
      isSuperLike: body.isSuperLike,
    });

    return {
      swipe: {
        id: result.swipe.getId(),
        action: result.swipe.getAction(),
        createdAt: result.swipe.getCreatedAt(),
      },
      isMatch: result.isMatch,
      match: result.match ? {
        id: result.match.getId(),
        matchedAt: result.match.getMatchedAt(),
        message: "It's a Match! 🎉",
      } : undefined,
    };
  }

  /**
   * Get matches
   */
  @Get('matches')
  @ApiOperation({ summary: 'Lấy danh sách matches' })
  @ApiResponse({ status: 200, description: 'List of matches' })
  async getMatches(@Req() request: Request) {
    const customerId = (request as any).user.id;

    const matches = await this.getMatchesUseCase.execute({ customerId });

    return {
      data: matches.map(m => ({
        id: m.getId(),
        otherCustomerId: m.getOtherCustomerId(customerId),
        matchedAt: m.getMatchedAt(),
        conversationId: m.getConversationId(),
        lastInteractionAt: m.getLastInteractionAt(),
        isActive: m.getIsActive(),
      })),
      total: matches.length,
    };
  }

  /**
   * Propose a date
   */
  @Post('dates/propose')
  @ApiOperation({ summary: 'Đề xuất hẹn hò' })
  @ApiResponse({ status: 201, description: 'Date proposed' })
  async proposeDate(@Body() body: any, @Req() request: Request) {
    const customerId = (request as any).user.id;

    const proposal = await this.proposeDateUseCase.execute({
      matchId: body.matchId,
      customerId,
      proposedDate: new Date(body.proposedDate),
      location: body.location,
      activity: body.activity,
      notes: body.notes,
    });

    return {
      id: proposal.getId(),
      proposedDate: proposal.getProposedDate(),
      location: proposal.getLocation(),
      activity: proposal.getActivity(),
      status: proposal.getStatus(),
      message: 'Date proposal sent!',
    };
  }

  /**
   * Respond to date proposal
   */
  @Put('dates/:id/respond')
  @ApiOperation({ summary: 'Accept/Decline date proposal' })
  @ApiResponse({ status: 200, description: 'Response recorded' })
  async respondToProposal(
    @Param('id') id: string,
    @Body() body: { accept: boolean; message?: string },
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;

    const proposal = await this.respondToProposalUseCase.execute({
      proposalId: id,
      customerId,
      accept: body.accept,
      message: body.message,
    });

    return {
      id: proposal.getId(),
      status: proposal.getStatus(),
      respondedAt: proposal.getRespondedAt(),
      message: body.accept ? 'Date accepted! 🎉' : 'Date declined',
    };
  }

  /**
   * Get date proposals
   */
  @Get('dates/proposals')
  @ApiOperation({ summary: 'Lấy date proposals' })
  @ApiResponse({ status: 200, description: 'Date proposals' })
  async getDateProposals(
    @Req() request: Request,
    @Query('type') type?: 'sent' | 'received' | 'all',
  ) {
    const customerId = (request as any).user.id;

    const proposals = await this.getDateProposalsUseCase.execute({
      customerId,
      type: type || 'all',
    });

    return {
      data: proposals.map(p => ({
        id: p.getId(),
        matchId: p.getMatchId(),
        proposedBy: p.getProposedBy(),
        proposedTo: p.getProposedTo(),
        proposedDate: p.getProposedDate(),
        location: p.getLocation(),
        activity: p.getActivity(),
        notes: p.getNotes(),
        status: p.getStatus(),
        respondedAt: p.getRespondedAt(),
        responseMessage: p.getResponseMessage(),
        createdAt: p.getCreatedAt(),
      })),
      total: proposals.length,
    };
  }

  /**
   * Block user
   */
  @Post('block/:userId')
  @ApiOperation({ summary: 'Block user' })
  @ApiResponse({ status: 201, description: 'User blocked successfully' })
  async blockUser(
    @Param('userId') userId: string,
    @Body() body: { reason: string },
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;

    const blocked = await this.blockUserUseCase.execute({
      blockerId: customerId,
      blockedId: userId,
      reason: body.reason || 'No reason provided',
    });

    return {
      id: blocked.getId(),
      blockedUserId: blocked.getBlockedId(),
      message: 'User blocked successfully. You will no longer see them.',
    };
  }

  /**
   * Unblock user
   */
  @Delete('unblock/:userId')
  @ApiOperation({ summary: 'Unblock user' })
  @ApiResponse({ status: 200, description: 'User unblocked' })
  async unblockUser(@Param('userId') userId: string, @Req() request: Request) {
    const customerId = (request as any).user.id;

    await this.unblockUserUseCase.execute({
      blockerId: customerId,
      blockedId: userId,
    });

    return {
      message: 'User unblocked successfully',
    };
  }

  /**
   * Get blocked users
   */
  @Get('blocked-users')
  @ApiOperation({ summary: 'Lấy danh sách users đã block' })
  @ApiResponse({ status: 200, description: 'Blocked users list' })
  async getBlockedUsers(@Req() request: Request) {
    const customerId = (request as any).user.id;

    const blockedUsers = await this.getBlockedUsersUseCase.execute({
      userId: customerId,
    });

    return {
      data: blockedUsers.map(b => ({
        id: b.getId(),
        blockedUserId: b.getBlockedId(),
        reason: b.getReason(),
        blockedAt: b.getCreatedAt(),
      })),
      total: blockedUsers.length,
    };
  }

  /**
   * Report user
   */
  @Post('report/:userId')
  @ApiOperation({ summary: 'Report user for violations' })
  @ApiResponse({ status: 201, description: 'Report submitted' })
  async reportUser(
    @Param('userId') userId: string,
    @Body() body: { reason: string; description?: string },
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;

    const report = await this.reportUserUseCase.execute({
      reporterId: customerId,
      reportedId: userId,
      reason: body.reason as any,
      description: body.description,
    });

    return {
      id: report.getId(),
      status: report.getStatus(),
      message: 'Report submitted successfully. Our team will review it.',
    };
  }

  /**
   * Get dating settings
   */
  @Get('settings')
  @ApiOperation({ summary: 'Lấy dating settings' })
  @ApiResponse({ status: 200, description: 'Settings retrieved' })
  async getSettings(@Req() request: Request) {
    const customerId = (request as any).user.id;

    const settings = await this.getSettingsUseCase.execute({ customerId });

    return {
      maxDistance: settings.getMaxDistance(),
      ageMin: settings.getAgeMin(),
      ageMax: settings.getAgeMax(),
      showDistance: settings.getShowDistance(),
      showAge: settings.getShowAge(),
      onlyShowVerified: settings.getOnlyShowVerified(),
    };
  }

  /**
   * Update dating settings
   */
  @Put('settings')
  @ApiOperation({ summary: 'Cập nhật dating settings' })
  @ApiResponse({ status: 200, description: 'Settings updated' })
  async updateSettings(
    @Body() body: {
      maxDistance?: number;
      ageMin?: number;
      ageMax?: number;
      showDistance?: boolean;
      showAge?: boolean;
      onlyShowVerified?: boolean;
    },
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;

    const settings = await this.updateSettingsUseCase.execute({
      customerId,
      ...body,
    });

    return {
      maxDistance: settings.getMaxDistance(),
      ageMin: settings.getAgeMin(),
      ageMax: settings.getAgeMax(),
      showDistance: settings.getShowDistance(),
      showAge: settings.getShowAge(),
      onlyShowVerified: settings.getOnlyShowVerified(),
      message: 'Settings updated successfully',
    };
  }

  /**
   * Track profile view (client calls when viewing profile detail)
   */
  @Post('profile/:profileId/view')
  @ApiOperation({ summary: 'Track profile view' })
  @ApiResponse({ status: 201, description: 'Profile view tracked' })
  async trackProfileView(
    @Param('profileId') profileId: string,
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;
    
    try {
      await this.trackProfileViewUseCase.execute({
        profileId,
        viewerId: customerId,
      });

      return {
        success: true,
        message: 'Profile view tracked',
      };
    } catch (error) {
      // Don't fail if tracking fails (e.g., self-view)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to track view',
      };
    }
  }

  /**
   * Get profile view stats
   */
  @Get('stats/profile-views')
  @ApiOperation({ summary: 'Lấy thống kê lượt xem profile' })
  @ApiResponse({ status: 200, description: 'Profile view stats' })
  async getProfileViewStats(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    // Check if user is premium
    const subscription = await this.getSubscriptionStatusUseCase.execute({ customerId });
    
    const stats = await this.getProfileViewStatsUseCase.execute({
      customerId,
      isPremium: subscription.isPremium,
    });

    return stats;
  }

  /**
   * Get received likes
   */
  @Get('likes/received')
  @ApiOperation({ summary: 'Xem ai đã like bạn (Premium feature)' })
  @ApiResponse({ status: 200, description: 'Received likes' })
  async getReceivedLikes(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    // Check if user is premium
    const subscription = await this.getSubscriptionStatusUseCase.execute({ customerId });
    
    const result = await this.getReceivedLikesUseCase.execute({
      customerId,
      isPremium: subscription.isPremium,
    });

    if (subscription.isPremium) {
      return {
        count: result.count,
        profiles: result.profiles?.map(p => ({
          id: p.getId(),
          displayName: p.getDisplayName(),
          age: p.getAge(),
          bio: p.getBio(),
          photos: p.getPhotos(),
          location: p.getLocation(),
        })),
      };
    } else {
      return {
        count: result.count,
        message: 'Upgrade to Premium to see who likes you!',
      };
    }
  }

  /**
   * Undo last swipe
   */
  @Post('swipe/undo')
  @ApiOperation({ summary: 'Hoàn tác swipe cuối cùng (Premium)' })
  @ApiResponse({ status: 200, description: 'Swipe undone' })
  async undoLastSwipe(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    const subscription = await this.getSubscriptionStatusUseCase.execute({ customerId });
    
    const result = await this.undoLastSwipeUseCase.execute({
      customerId,
      isPremium: subscription.isPremium,
    });

    return result;
  }

  /**
   * Activate boost
   */
  @Post('boost/activate')
  @ApiOperation({ summary: 'Kích hoạt Boost - Top profile 30 phút' })
  @ApiResponse({ status: 201, description: 'Boost activated' })
  async activateBoost(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    const subscription = await this.getSubscriptionStatusUseCase.execute({ customerId });
    
    const boost = await this.activateBoostUseCase.execute({
      customerId,
      isPremium: subscription.isPremium,
    });

    return {
      id: boost.getId(),
      startedAt: boost.getStartedAt(),
      expiresAt: boost.getExpiresAt(),
      remainingMinutes: boost.getRemainingMinutes(),
      message: 'Boost activated! You are now a top profile for 30 minutes.',
    };
  }

  /**
   * Get boost status
   */
  @Get('boost/status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái Boost' })
  @ApiResponse({ status: 200, description: 'Boost status' })
  async getBoostStatus(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    const status = await this.getBoostStatusUseCase.execute({ customerId });
    
    return status;
  }

  /**
   * Get subscription status
   */
  @Get('subscription/status')
  @ApiOperation({ summary: 'Kiểm tra trạng thái Premium subscription' })
  @ApiResponse({ status: 200, description: 'Subscription status' })
  async getSubscriptionStatus(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    const status = await this.getSubscriptionStatusUseCase.execute({ customerId });
    
    return status;
  }

  /**
   * Create subscription
   */
  @Post('subscription/create')
  @ApiOperation({ summary: 'Tạo Premium subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created' })
  async createSubscription(
    @Body() body: { plan: string; stripeSubscriptionId?: string; stripeCustomerId?: string },
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;
    
    const subscription = await this.createSubscriptionUseCase.execute({
      customerId,
      plan: body.plan as any,
      stripeSubscriptionId: body.stripeSubscriptionId,
      stripeCustomerId: body.stripeCustomerId,
    });

    return {
      id: subscription.getId(),
      plan: subscription.getPlan(),
      status: subscription.getStatus(),
      features: subscription.getFeatures(),
      endDate: subscription.getEndDate(),
      message: 'Premium subscription activated! 🎉',
    };
  }

  /**
   * Upgrade subscription
   */
  @Put('subscription/upgrade')
  @ApiOperation({ summary: 'Nâng cấp Premium subscription' })
  @ApiResponse({ status: 200, description: 'Subscription upgraded' })
  async upgradeSubscription(
    @Body() body: { newPlan: string },
    @Req() request: Request,
  ) {
    const customerId = (request as any).user.id;
    
    const subscription = await this.upgradeSubscriptionUseCase.execute({
      customerId,
      newPlan: body.newPlan as any,
    });

    return {
      id: subscription.getId(),
      plan: subscription.getPlan(),
      features: subscription.getFeatures(),
      message: 'Subscription upgraded successfully!',
    };
  }

  /**
   * Cancel subscription
   */
  @Delete('subscription/cancel')
  @ApiOperation({ summary: 'Hủy Premium subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancelSubscription(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    const subscription = await this.cancelSubscriptionUseCase.execute({ customerId });

    return {
      message: 'Subscription cancelled. Premium features will remain active until end date.',
      endDate: subscription.getEndDate(),
    };
  }

  /**
   * Check swipe limit
   */
  @Get('swipe/limit')
  @ApiOperation({ summary: 'Kiểm tra giới hạn swipe hàng ngày' })
  @ApiResponse({ status: 200, description: 'Swipe limit status' })
  async checkSwipeLimit(@Req() request: Request) {
    const customerId = (request as any).user.id;
    
    const limit = await this.checkSwipeLimitUseCase.execute({ customerId });

    return {
      ...limit,
      message: limit.canSwipe 
        ? `You have ${limit.remainingSwipes === -1 ? 'unlimited' : limit.remainingSwipes} swipes remaining` 
        : 'Daily swipe limit reached. Upgrade to Premium for unlimited swipes!',
    };
  }
}
