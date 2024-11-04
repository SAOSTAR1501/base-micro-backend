import { ParseFilePipe, FileValidator, Injectable } from '@nestjs/common';
import { getLangFromRequest } from '../helper';
import { I18nService } from 'nestjs-i18n';

interface I18nValidatorOptions {
    i18nKey: string;
}

function createI18nValidator<T extends FileValidator>(
    ValidatorClass: new (options: any) => T,
    i18nService: I18nService,
    options: I18nValidatorOptions & ConstructorParameters<typeof ValidatorClass>[0]
) {
    return new ValidatorClass({
        ...options,
        errorMessage: (file: Express.Multer.File, req: Request) => {
            const lang = getLangFromRequest(req);
            return i18nService.t(options.i18nKey, { lang });
        },
    });
}

@Injectable()
export class I18nParseFilePipeFactory {
    constructor(private readonly i18nService: I18nService) { }

    create(options: {
        validators: Array<{
            validator: new (options: any) => FileValidator,
            options: I18nValidatorOptions & Record<string, any>
        }>
    }) {
        return new ParseFilePipe({
            validators: options.validators.map(({ validator, options }) =>
                createI18nValidator(validator, this.i18nService, options)
            ),
        });
    }
}