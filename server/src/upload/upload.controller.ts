import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { UploadImageFileOutput } from './dtos/upload-image-file.dto';

@Controller('upload')
export class UploadController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadImageFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/png' })],
      }),
    )
    file: Express.Multer.File,
  ): UploadImageFileOutput {
    try {
      // how to encode filename to utf-8
      // console.log(Buffer.from(file.originalname, 'latin1').toString('utf8'));
      const filePath = '/src/media/image/' + Date.now() + file.originalname;
      fs.writeFile(process.cwd() + filePath, file.buffer, (e) => {
        if (e) console.log(e);
      });
      return { ok: true, path: filePath };
    } catch {
      return { ok: false, error: "Couldn't upload imageFile" };
    }
  }
}
