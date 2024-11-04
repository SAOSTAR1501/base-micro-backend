import { CustomFileSizeValidator, CustomFileTypeValidator, CustomRequiredFileValidator, getLangFromRequest, PROVIDERS } from '@app/common';
import { Body, Controller, Delete, Get, Inject, Param, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FrontendAuthGuard } from '../guards/frontend-auth.guard';

@ApiTags('Customer Media upload')
@Controller('frontend-api/media-upload')
export class MediaUploadController {
    constructor(
        @Inject(PROVIDERS.MEDIA_UPLOAD_SERVICE) private readonly mediaUploadService: ClientProxy,
    ) { }

    @UseGuards(FrontendAuthGuard)
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageTemp(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const validators = [
            new CustomRequiredFileValidator({
                errorMessage: 'Please upload an image',
            }),
            new CustomFileSizeValidator({
                maxSize: 10 * 1024 * 1024,
                errorMessage: 'Image size must be less than 10MB',
            }),
            new CustomFileTypeValidator({
                fileType: /^(image\/jpeg|image\/png|image\/gif|image\/webp)$/,
                errorMessage: 'Please upload correct image types',
            }),
        ]
        const parseFilePipe = new ParseFilePipe({ validators });
        await parseFilePipe.transform(file);
        console.log(file);
        return this.mediaUploadService.send('upload_media_image', { file });
    }

    @UseGuards(FrontendAuthGuard)
    @Post('video')
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideoTemp(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const validators = [
            new CustomRequiredFileValidator({
                errorMessage: 'Please upload a video',
            }),
            new CustomFileSizeValidator({
                maxSize: 100 * 1024 * 1024,
                errorMessage: 'Video size must be less than 100MB',
            }),
            new CustomFileTypeValidator({
                fileType: /^video\/mp4$/,
                errorMessage: 'Please upload correct video types',
            }),
        ]
        const parseFilePipe = new ParseFilePipe({ validators });
        await parseFilePipe.transform(file);

        return this.mediaUploadService.send('upload_media_video', { file });
    }

    // Get list of media from Cloudinary
    @UseGuards(FrontendAuthGuard)
    @Get('list/:folder')
    async getMediaList(@Param('folder') folder: string, @Req() req: Request) {
        return this.mediaUploadService.send('get_media', { folder, resourceType: 'image' });
    }

    // Move media in Cloudinary
    @UseGuards(FrontendAuthGuard)
    @Post('move')
    async moveMedia(
        @Body() body: { publicId: string, sourceFolder: string, destinationFolder: string },
        @Req() req: Request,
    ) {
        const { publicId, sourceFolder, destinationFolder } = body;
        return this.mediaUploadService.send('move_media', { publicId, sourceFolder, destinationFolder, resourceType: 'image' });
    }

    // Delete media in Cloudinary
    @UseGuards(FrontendAuthGuard)
    @Post('delete')
    async deleteMedia(@Body() body: { publicId: string,  resourceType: string}, @Req() req: Request) {
        const { publicId, resourceType } = body;
        return this.mediaUploadService.send('delete_media', { publicId, resourceType});
    }

    @UseGuards(FrontendAuthGuard)
    @Post('upload-s3')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImageToS3(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const validators = [
            new CustomRequiredFileValidator({
                errorMessage: 'Please upload an image',
            }),
            new CustomFileSizeValidator({
                maxSize: 10 * 1024 * 1024,
                errorMessage: 'Image size must be less than 10MB',
            }),
            new CustomFileTypeValidator({
                fileType: /^(image\/jpeg|image\/png|image\/gif|image\/webp)$/,
                errorMessage: 'Please upload correct image types',
            }),
        ];
        const parseFilePipe = new ParseFilePipe({ validators });
        await parseFilePipe.transform(file);

        return this.mediaUploadService.send('upload_image_s3', { fileBuffer: file.buffer, fileName: file.originalname, mimetype: file.mimetype });
    }
          
    @UseGuards(FrontendAuthGuard)
    @Get('s3/list/:prefix')
    async getS3ObjectList(@Param('prefix') prefix: string, @Req() req: Request) {
        return this.mediaUploadService.send('get_list_objects_s3', { prefix });
    }

    // Clean temporary files in S3
    @UseGuards(FrontendAuthGuard)
    @Delete('s3/clean')
    async cleanTempFiles(@Body() body: { prefix: string }, @Req() req: Request) {
        const { prefix } = body;
        return this.mediaUploadService.send('clean_temp_s3', { prefix });
    }

    // Move media in AWS S3
    @UseGuards(FrontendAuthGuard)
    @Post('s3/move')
    async moveS3Media(
        @Body() body: { sourcePath: string, destinationPath: string },
        @Req() req: Request,
    ) {
        const { sourcePath, destinationPath } = body;
        return this.mediaUploadService.send('move_media_aws', { sourcePath, destinationPath });
    }
}
