import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { UploadPhotoDto, ReorderPhotosDto, UpdatePhotoDto } from '@application/api/http-rest/dto/property/UploadPhotoDto';
import { UploadPropertyPhotoUseCase } from '@core/service/property/usecase/UploadPropertyPhotoUseCase';
import { ListPropertyPhotosUseCase } from '@core/service/property/usecase/ListPropertyPhotosUseCase';
import { DeletePropertyPhotoUseCase } from '@core/service/property/usecase/DeletePropertyPhotoUseCase';
import { SetCoverPhotoUseCase } from '@core/service/property/usecase/SetCoverPhotoUseCase';
import { UpdatePropertyPhotoUseCase } from '@core/service/property/usecase/UpdatePropertyPhotoUseCase';
import { ReorderPropertyPhotosUseCase } from '@core/service/property/usecase/ReorderPropertyPhotosUseCase';

/**
 * Property Photo Controller - Photo management for properties
 */
@Controller('api/properties/:propertyId/photos')
@ApiTags('Property Photos')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class PropertyPhotoController {
  
  constructor(
    private readonly uploadPropertyPhotoUseCase: UploadPropertyPhotoUseCase,
    private readonly listPropertyPhotosUseCase: ListPropertyPhotosUseCase,
    private readonly deletePropertyPhotoUseCase: DeletePropertyPhotoUseCase,
    private readonly setCoverPhotoUseCase: SetCoverPhotoUseCase,
    private readonly updatePropertyPhotoUseCase: UpdatePropertyPhotoUseCase,
    private readonly reorderPropertyPhotosUseCase: ReorderPropertyPhotosUseCase,
  ) {}
  
  /**
   * Upload photo to property
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload photo cho property' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        caption: {
          type: 'string',
        },
        isCover: {
          type: 'boolean',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Photo uploaded' })
  async uploadPhoto(
    @Param('propertyId') propertyId: string,
    @UploadedFile() file: any,
    @Body() dto: Partial<UploadPhotoDto>,
    @Req() request: Express.Request & { user: { id: string } },
  ) {
    const hostId = request.user.id;
    
    const photo = await this.uploadPropertyPhotoUseCase.execute({
      propertyId,
      hostId,
      file: file.buffer,
      filename: file.originalname,
      contentType: file.mimetype,
      caption: dto.caption,
      isCover: dto.isCover || false,
      orderIndex: dto.orderIndex,
    });
    
    return {
      id: photo.getId(),
      propertyId: photo.getPropertyId(),
      url: photo.getUrl(),
      isCover: photo.getIsCover(),
      caption: photo.getCaption(),
      orderIndex: photo.getOrderIndex(),
      uploadedAt: photo.getCreatedAt(),
      message: 'Photo uploaded successfully',
    };
  }
  
  /**
   * Get all photos of property
   */
  @Get()
  @ApiOperation({ summary: 'Lấy tất cả photos của property' })
  @ApiResponse({ status: 200, description: 'Property photos' })
  async getPhotos(@Param('propertyId') propertyId: string) {
    const photos = await this.listPropertyPhotosUseCase.execute({ propertyId });
    
    const coverPhoto = photos.find(p => p.getIsCover());
    const maxPhotos = 50;
    
    return {
      data: photos.map(photo => ({
        id: photo.getId(),
        url: photo.getUrl(),
        isCover: photo.getIsCover(),
        orderIndex: photo.getOrderIndex(),
        caption: photo.getCaption(),
        uploadedAt: photo.getCreatedAt(),
      })),
      meta: {
        total: photos.length,
        coverPhoto: !!coverPhoto,
        maxPhotos,
        remainingSlots: maxPhotos - photos.length,
      },
    };
  }
  
  /**
   * Update photo (caption, cover status)
   */
  @Put(':photoId')
  @ApiOperation({ summary: 'Cập nhật thông tin photo' })
  @ApiResponse({ status: 200, description: 'Photo updated' })
  async updatePhoto(
    @Param('propertyId') propertyId: string,
    @Param('photoId') photoId: string,
    @Body() dto: UpdatePhotoDto,
    @Req() request: Express.Request & { user: { id: string } },
  ) {
    const photo = await this.updatePropertyPhotoUseCase.execute({
      photoId,
      caption: dto.caption,
      isCover: dto.isCover,
    });
    
    return {
      id: photo.getId(),
      propertyId: photo.getPropertyId(),
      caption: photo.getCaption(),
      isCover: photo.getIsCover(),
      updatedAt: photo.getUpdatedAt(),
      message: 'Photo updated successfully',
    };
  }
  
  /**
   * Delete photo
   */
  @Delete(':photoId')
  @ApiOperation({ summary: 'Xóa photo' })
  @ApiResponse({ status: 200, description: 'Photo deleted' })
  async deletePhoto(
    @Param('propertyId') propertyId: string,
    @Param('photoId') photoId: string,
    @Req() request: Express.Request & { user: { id: string } },
  ) {
    await this.deletePropertyPhotoUseCase.execute({
      propertyId,
      photoId,
      hostId: request.user.id,
    });
    
    return {
      id: photoId,
      deleted: true,
      message: 'Photo deleted successfully',
    };
  }
  
  /**
   * Reorder photos
   */
  @Put('reorder')
  @ApiOperation({ summary: 'Sắp xếp lại thứ tự photos' })
  @ApiResponse({ status: 200, description: 'Photos reordered' })
  async reorderPhotos(
    @Param('propertyId') propertyId: string,
    @Body() dto: ReorderPhotosDto,
    @Req() request: Express.Request & { user: { id: string } },
  ) {
    await this.reorderPropertyPhotosUseCase.execute({
      propertyId,
      photoIds: dto.photoIds,
    });
    
    return {
      propertyId,
      photoCount: dto.photoIds.length,
      reorderedAt: new Date(),
      message: 'Photos reordered successfully',
    };
  }
  
  /**
   * Set cover photo
   */
  @Put(':photoId/set-cover')
  @ApiOperation({ summary: 'Đặt làm cover photo' })
  @ApiResponse({ status: 200, description: 'Cover photo set' })
  async setCoverPhoto(
    @Param('propertyId') propertyId: string,
    @Param('photoId') photoId: string,
    @Req() request: Express.Request & { user: { id: string } },
  ) {
    const photo = await this.setCoverPhotoUseCase.execute({
      propertyId,
      photoId,
      hostId: request.user.id,
    });
    
    return {
      photoId: photo.getId(),
      isCover: photo.getIsCover(),
      message: 'Cover photo updated successfully',
    };
  }
}

