import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelPostMediaItem {
  @ApiProperty({type: 'string'})
  public id: string;

  @ApiProperty({type: 'string'})
  public name: string;

  @ApiProperty({type: 'string'})
  public url: string;

  @ApiProperty({type: 'string'})
  public type: string;

  @ApiProperty({type: 'number'})
  public size: number;

  @ApiProperty({type: 'string'})
  public ext: string;

  @ApiProperty({type: 'string'})
  public mimetype: string;
}

export class HttpRestApiModelPostMedia {
  @ApiProperty({type: 'string'})
  public id: string;

  @ApiProperty({type: 'string'})
  public mediaId: string;

  @ApiProperty({enum: ['COVER', 'GALLERY']})
  public type: 'COVER' | 'GALLERY';

  @ApiProperty({type: 'number'})
  public sortOrder: number;

  @ApiProperty({type: HttpRestApiModelPostMediaItem})
  public media: HttpRestApiModelPostMediaItem;
}
