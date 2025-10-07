import { HttpRestApiModelPostImage } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelPostImage';
import { HttpRestApiModelPostOwner } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelPostOwner';
import { PostStatus } from '@core/common/enums/PostEnums';
import { HttpRestApiModelPostMedia } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelPostMedia';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelPost {
  
  @ApiProperty({type: 'string'})
  public id: string;
  
  @ApiProperty({type: HttpRestApiModelPostOwner})
  public owner: HttpRestApiModelPostOwner;
  
  @ApiProperty({type: HttpRestApiModelPostImage, required: false})
  public image?: HttpRestApiModelPostImage;

  @ApiProperty({type: HttpRestApiModelPostImage, required: false})
  public coverImage?: HttpRestApiModelPostImage;

  @ApiProperty({type: HttpRestApiModelPostImage, isArray: true})
  public galleryImages: HttpRestApiModelPostImage[];

  @ApiProperty({type: HttpRestApiModelPostMedia, isArray: true})
  public mediaCollection: HttpRestApiModelPostMedia[];
  
  @ApiProperty({type: 'string'})
  public title: string;
  
  @ApiProperty({type: 'string'})
  public content: string;
  
  @ApiProperty({enum: PostStatus})
  public status: PostStatus;
  
  @ApiProperty({type: 'number'})
  public createdAt: number;
  
  @ApiProperty({type: 'number', required: false})
  public editedAt: number;
  
  @ApiProperty({type: 'number', required: false})
  public publishedAt: number;
  
}
