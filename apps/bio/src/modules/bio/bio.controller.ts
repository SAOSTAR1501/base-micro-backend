import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BioService } from './bio.service';
import { I18nService } from 'nestjs-i18n';
import { IUpdateBio } from './bio.interface';

@Controller()
export class BioController {
  constructor(private readonly bioService: BioService, private readonly i18n: I18nService) { }

  @MessagePattern('get_all_bio')
  async getAllBio(@Payload() payload: any) {
    const { lang, ...query } = payload;
    const message = this.i18n.t('translation.getBioSuccess', { lang });
    // const bios = await this.bioService.getAllBio(query);
    return { message };
  }

  @MessagePattern('find_by_user')
  async findByUser(@Payload() userId: string) {
    console.log({ userId })
    const res = await this.bioService.findByUser(userId);
    return { result: res }
  }

  @MessagePattern('exists_bio_link')
  async existsBioLink(@Payload() bioLink: string) {
    const res = await this.bioService.existsBioLink(bioLink);
    return { result: res }
  }

  @MessagePattern('find_by_bio_link')
  async findByBioLink(@Payload() bioLink: string) {
    const res = await this.bioService.findByBioLink(bioLink);
    return { result: res }
  }

  @MessagePattern('create_bio')
  async createBio(@Payload() data: { userId: string; fullName: string; bioLink: string; lang: string, avatar: any }) {
    const { userId, fullName, bioLink, lang, avatar } = data;
    const newBio = await this.bioService.createBio({ userId, fullName, bioLink, avatar });
    return {
      message: this.i18n.t('translation.createBioSuccess', { lang }),
      result: newBio
    };
  }

  @MessagePattern('update_bio')
  async updateBio(@Payload() data: { userId: string; bioData: IUpdateBio; lang: string }) {
    const { userId, bioData, lang } = data;
    return await this.bioService.updateBio(userId, bioData, lang);
  }

  @MessagePattern('search_bio')
  async getBioSearch(@Payload() { bioLink, page, limit }: { bioLink: string, page: number, limit: number }) {
    return await this.bioService.getBioSearchService(bioLink, page, limit)
  }
}