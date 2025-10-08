import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { CreateDatingProfileUseCase } from '@core/service/dating/usecase/CreateDatingProfileUseCase';
import { SwipeProfileUseCase } from '@core/service/dating/usecase/SwipeProfileUseCase';
import { GetMatchesUseCase } from '@core/service/dating/usecase/GetMatchesUseCase';
import { ProposeDateUseCase } from '@core/service/dating/usecase/ProposeDateUseCase';
import { RespondToDateProposalUseCase } from '@core/service/dating/usecase/RespondToDateProposalUseCase';
import { GetRecommendedProfilesUseCase } from '@core/service/dating/usecase/GetRecommendedProfilesUseCase';
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
    private readonly getRecommendedProfilesUseCase: GetRecommendedProfilesUseCase,
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
  async getDateProposals(@Req() request: Request) {
    const customerId = (request as any).user.id;

    // TODO: Implement GetDateProposalsUseCase
    return {
      data: [],
      message: 'GetDateProposalsUseCase - TODO',
    };
  }
}
