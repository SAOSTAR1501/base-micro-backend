import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminBioService } from './admin.service';
import { I18nService } from 'nestjs-i18n';

@Controller()
export class AdminBioController {
  constructor(
    private readonly adminBioService: AdminBioService,
    private readonly i18n: I18nService
  ) {}

  @MessagePattern('admin_get_all_bios')
  async getAllBios(@Payload() data: { query: any; lang: string }) {
    const { query, lang } = data;
    const result = await this.adminBioService.getAllBios(query, lang);
    return {
      message: this.i18n.t('translation.getAllBiosSuccess', { lang }),
      result
    };
  }

  @MessagePattern('admin_get_bio_by_id')
  async getBioById(@Payload() data: { id: string; lang: string }) {
    const { id, lang } = data;
    const result = await this.adminBioService.getBioById(id, lang);
    return {
      message: this.i18n.t('translation.getBioSuccess', { lang }),
      result
    };
  }

  @MessagePattern('admin_block_bio')
  async blockBio(@Payload() data: { id: string; lang: string }) {
    const { id, lang } = data;
    const result = await this.adminBioService.blockBio(id, lang);
    return {
      message: this.i18n.t('translation.blockBioSuccess', { lang }),
      result
    };
  }

  @MessagePattern('admin_unblock_bio')
  async unblockBio(@Payload() data: { id: string; lang: string }) {
    const { id, lang } = data;
    const result = await this.adminBioService.unblockBio(id, lang);
    return {
      message: this.i18n.t('translation.unblockBioSuccess', { lang }),
      result
    };
  }
}