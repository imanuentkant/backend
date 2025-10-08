import { HttpAuth } from '@application/api/http-rest/auth/decorator/HttpAuth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/HttpUser';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { UserRole } from '@core/common/enums/UserEnums';
import { AlbumDITokens } from '@core/domain/album/di/AlbumDITokens';
import { CreateAlbumUseCase } from '@core/domain/album/usecase/CreateAlbumUseCase';
import { GetAlbumUseCase } from '@core/domain/album/usecase/GetAlbumUseCase';
import { GetAlbumListUseCase } from '@core/domain/album/usecase/GetAlbumListUseCase';
import { AddAlbumMediaUseCase } from '@core/domain/album/usecase/AddAlbumMediaUseCase';
import { RemoveAlbumMediaUseCase } from '@core/domain/album/usecase/RemoveAlbumMediaUseCase';
import { RemoveAlbumUseCase } from '@core/domain/album/usecase/RemoveAlbumUseCase';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('albums')
@ApiTags('albums')
export class AlbumController {
  constructor(
    @Inject(AlbumDITokens.CreateAlbumUseCase)
    private readonly createAlbum: CreateAlbumUseCase,
    @Inject(AlbumDITokens.GetAlbumUseCase)
    private readonly getAlbum: GetAlbumUseCase,
    @Inject(AlbumDITokens.GetAlbumListUseCase)
    private readonly getAlbumList: GetAlbumListUseCase,
    @Inject(AlbumDITokens.AddAlbumMediaUseCase)
    private readonly addMedia: AddAlbumMediaUseCase,
    @Inject(AlbumDITokens.RemoveAlbumMediaUseCase)
    private readonly removeMedia: RemoveAlbumMediaUseCase,
    @Inject(AlbumDITokens.RemoveAlbumUseCase)
    private readonly removeAlbum: RemoveAlbumUseCase,
  ) {}

  @Post('post/:postId')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PARTNER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({ schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } }, required: ['title'] } })
  @ApiResponse({ status: HttpStatus.OK })
  async create(@HttpUser() user: HttpUserPayload, @Param('postId') postId: string, @Body() body: { title: string; description?: string }): Promise<CoreApiResponse<{ id: string; title: string }>> {
    const result = await this.createAlbum.execute({ executorId: user.id, postId, title: body.title, description: body.description });
    return CoreApiResponse.success(result);
  }

  @Get('post/:postId')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MOD, UserRole.PARTNER, UserRole.USER, UserRole.GUEST)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  async listByPost(@Param('postId') postId: string): Promise<CoreApiResponse<Array<{ id: string; title: string; description: string | null; mediaCount: number; createdAt: number }>>> {
    const list = await this.getAlbumList.execute({ postId });
    return CoreApiResponse.success(list);
  }

  @Get(':albumId')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MOD, UserRole.PARTNER, UserRole.USER, UserRole.GUEST)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  async get(@Param('albumId') albumId: string): Promise<CoreApiResponse<{ id: string; postId: string; ownerId: string; title: string; description: string | null; mediaIds: string[]; createdAt: number }>> {
    const album = await this.getAlbum.execute({ albumId });
    return CoreApiResponse.success(album);
  }

  @Post(':albumId/media')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PARTNER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({ schema: { type: 'object', properties: { mediaId: { type: 'string', format: 'uuid' } }, required: ['mediaId'] } })
  @ApiResponse({ status: HttpStatus.OK })
  async addMediaToAlbum(@HttpUser() user: HttpUserPayload, @Param('albumId') albumId: string, @Body() body: { mediaId: string }): Promise<CoreApiResponse<void>> {
    await this.addMedia.execute({ executorId: user.id, albumId, mediaId: body.mediaId });
    return CoreApiResponse.success();
  }

  @Delete(':albumId/media/:mediaId')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PARTNER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  async removeMediaFromAlbum(@HttpUser() user: HttpUserPayload, @Param('albumId') albumId: string, @Param('mediaId') mediaId: string): Promise<CoreApiResponse<void>> {
    await this.removeMedia.execute({ executorId: user.id, albumId, mediaId });
    return CoreApiResponse.success();
  }

  @Delete(':albumId')
  @HttpAuth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.PARTNER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  async remove(@HttpUser() user: HttpUserPayload, @Param('albumId') albumId: string): Promise<CoreApiResponse<void>> {
    await this.removeAlbum.execute({ executorId: user.id, albumId });
    return CoreApiResponse.success();
  }
}

