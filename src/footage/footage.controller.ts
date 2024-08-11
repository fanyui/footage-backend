import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
} from '@nestjs/common';
import { FootageService } from './footage.service';
import { CreateFootageDto, Stats } from './dto/create-footage.dto';
import { UpdateFootageDto } from './dto/update-footage.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/http-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@ApiTags('conversation')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('footage')
export class FootageController {
  constructor(private readonly footageService: FootageService) { }
  // @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFootageDto: CreateFootageDto) {
    return this.footageService.create(createFootageDto);
  }

  @Get()
  findAll() {
    return this.footageService.findAll();
  }

  @Get(':id')
  getFootage(@Param('id') id: string) {
    return this.footageService.getFootage(id);
  }
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully.', type: Stats })

  @Get('/statistics/count')
  @ApiCreatedResponse({ type: Stats })
  getAllStatistics() {
    return this.footageService.statistics();
  }
  @Get('files/ai')
  listfiles() {
    return this.footageService.listFiles();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFootageDto: UpdateFootageDto) {
    return this.footageService.update(id, updateFootageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.footageService.remove(id);
  }


  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully.' })

  @UseInterceptors(FilesInterceptor('files', 10,

    {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }
  ))
  async uploadFile(@UploadedFiles(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 10000 }),
        // new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
    }),
  ) file: Array<Express.Multer.File>) {
    console.log(file);
    return await this.footageService.uploadFile(file);
  }
}
