import { BadRequestException, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { OnCityImageUploadService } from 'src/app/services/oncity/images/OnCityImageUploadService';

@ApiTags('oncity')
@Controller('oncity/images')
export class OnCityImageUploadController {
  constructor(private readonly service: OnCityImageUploadService) {}

  @ApiOperation({
    summary: 'Subir imagen a VTEX catalog-images',
    description:
      'Obtiene VtexIdclientAutCookie con el login de VTEX y sube el archivo a /vtex.catalog-images/v0/{account}/master/images/save/{fileName}.'
  })
  @ApiParam({
    name: 'fileName',
    example: 'TEST-001-01.jpg'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @Post('save/:fileName')
  @UseInterceptors(FileInterceptor('file'))
  async execute(@Param('fileName') fileName: string, @UploadedFile() file: any): Promise<unknown> {
    if (!file?.buffer) {
      throw new BadRequestException('Debe enviarse un archivo multipart en el campo file');
    }

    return this.service.execute({
      fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer
    });
  }
}
