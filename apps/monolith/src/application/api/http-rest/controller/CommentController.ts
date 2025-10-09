import { HttpAuth } from '@application/api/http-rest/auth/decorator/HttpAuth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/HttpUser';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { UserRole } from '@core/common/enums/UserEnums';
import { CommentDITokens } from '@core/domain/comment/di/CommentDITokens';
import { CreateCommentUseCase } from '@core/domain/comment/usecase/CreateCommentUseCase';
import { GetPostCommentsUseCase } from '@core/domain/comment/usecase/GetPostCommentsUseCase';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('comments')
export class CommentController {
  constructor(
    @Inject(CommentDITokens.CreateCommentUseCase)
    private readonly createComment: CreateCommentUseCase,
    @Inject(CommentDITokens.GetPostCommentsUseCase)
    private readonly getComments: GetPostCommentsUseCase,
  ) {}

  @Post(':postId')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MOD, UserRole.PARTNER, UserRole.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({ schema: { type: 'object', properties: { content: { type: 'string' }, rating: { type: 'number', minimum: 1, maximum: 5 } }, required: ['content'] } })
  @ApiResponse({ status: HttpStatus.OK })
  async create(@HttpUser() user: HttpUserPayload, @Param('postId') postId: string, @Body() body: { content: string; rating?: number }): Promise<CoreApiResponse<{ id: string }>> {
    const result = await this.createComment.execute({ executorId: user.id, postId, content: body.content, rating: body.rating });
    return CoreApiResponse.success(result);
  }

  @Get(':postId')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MOD, UserRole.USER, UserRole.GUEST)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  async list(@Param('postId') postId: string): Promise<CoreApiResponse<Array<{ id: string; authorId: string; content: string; rating?: number; createdAt: number }>>> {
    const list = await this.getComments.execute({ postId });
    return CoreApiResponse.success(list);
  }
}


