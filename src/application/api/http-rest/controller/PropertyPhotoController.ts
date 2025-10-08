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
import { v4 as uuid } from 'uuid';

/**
 * Property Photo Controller - Photo management for properties
 */
@Controller('api/properties/:propertyId/photos')
@ApiTags('Property Photos')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class PropertyPhotoController {
  
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
    @Req() request: any,
  ) {
    // Real implementation:
    // 1. Upload file to S3/MinIO
    // 2. Get URL
    // 3. Create PropertyPhoto entity
    // 4. Save to database
    
    // Mock response
    const photoId = uuid();
    const photoUrl = `https://cdn.yourdomain.com/properties/${propertyId}/${photoId}.jpg`;
    
    return {
      id: photoId,
      propertyId,
      url: photoUrl,
      isCover: dto.isCover || false,
      caption: dto.caption,
      orderIndex: 0,
      size: file?.size || 0,
      filename: file?.originalname || 'photo.jpg',
      uploadedAt: new Date(),
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
    // Mock data
    return {
      data: [
        {
          id: uuid(),
          url: 'https://via.placeholder.com/800x600/FF5A5F/FFFFFF?text=Cover+Photo',
          isCover: true,
          orderIndex: 0,
          caption: 'Beautiful living room with city view',
          uploadedAt: '2025-10-01T10:00:00Z',
        },
        {
          id: uuid(),
          url: 'https://via.placeholder.com/800x600/008489/FFFFFF?text=Bedroom',
          isCover: false,
          orderIndex: 1,
          caption: 'Spacious master bedroom',
          uploadedAt: '2025-10-01T10:05:00Z',
        },
        {
          id: uuid(),
          url: 'https://via.placeholder.com/800x600/00A699/FFFFFF?text=Kitchen',
          isCover: false,
          orderIndex: 2,
          caption: 'Fully equipped kitchen',
          uploadedAt: '2025-10-01T10:10:00Z',
        },
        {
          id: uuid(),
          url: 'https://via.placeholder.com/800x600/FC642D/FFFFFF?text=Bathroom',
          isCover: false,
          orderIndex: 3,
          caption: 'Modern bathroom',
          uploadedAt: '2025-10-01T10:15:00Z',
        },
        {
          id: uuid(),
          url: 'https://via.placeholder.com/800x600/484848/FFFFFF?text=View',
          isCover: false,
          orderIndex: 4,
          caption: 'Amazing city view from balcony',
          uploadedAt: '2025-10-01T10:20:00Z',
        },
      ],
      meta: {
        total: 5,
        coverPhoto: true,
        maxPhotos: 50,
        remainingSlots: 45,
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
    @Req() request: any,
  ) {
    return {
      id: photoId,
      propertyId,
      caption: dto.caption,
      isCover: dto.isCover,
      updatedAt: new Date(),
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
    @Req() request: any,
  ) {
    // Delete from S3/MinIO
    // Delete from database
    
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
    @Req() request: any,
  ) {
    // Update order_index trong database
    
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
    @Req() request: any,
  ) {
    // Unset current cover
    // Set new cover
    
    return {
      photoId,
      isCover: true,
      message: 'Cover photo updated successfully',
    };
  }
}

