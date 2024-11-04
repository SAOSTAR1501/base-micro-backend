import { FileValidator } from "@nestjs/common";

export class CustomFileTypeValidator extends FileValidator {
    constructor(validationOptions: any) {
        super(validationOptions);
    }

    isValid(file: Express.Multer.File) {
        const validTypes = this.validationOptions.fileType;
        return validTypes.test(file.mimetype);
    }

    buildErrorMessage(file: Express.Multer.File) {
        return this.validationOptions.errorMessage || 'Định dạng tệp không hợp lệ.';
    }
}

export class CustomFileSizeValidator extends FileValidator {
    constructor(validationOptions: any) {
        super(validationOptions);
    }

    isValid(file: Express.Multer.File) {
        const maxSizeInBytes = this.validationOptions.maxSize;
        return file.size <= maxSizeInBytes;
    }

    buildErrorMessage(file: Express.Multer.File) {
        return this.validationOptions.errorMessage || 'Kích thước tệp vượt quá giới hạn.';
    }
}

export class CustomRequiredFileValidator extends FileValidator {
    isValid(file?: Express.Multer.File) {
        return !!file;
    }
    buildErrorMessage() {
        return this.validationOptions.errorMessage || 'Vui lòng tải lên một tệp.';
    }
}
