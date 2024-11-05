import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bio } from './schemes/bio.schema';
import { IUpdateBio } from './bio.interface';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { firstValueFrom } from 'rxjs';
import { isEmpty } from 'class-validator';

@Injectable()
export class BioService {
  constructor(
    @InjectModel(Bio.name) private bioModel: Model<Bio>,
    @Inject('JOB_SERVICE') private jobService: ClientProxy,
    @Inject('SEARCH_SERVICE') private searchService: ClientProxy,
    private readonly i18n: I18nService
  ) { }

  private async indexBioEntity(bio: Bio, operation: 'create' | 'update' | 'delete'): Promise<void> {
    const entityData = operation === 'delete' ? { id: bio._id } : {
      id: bio._id,
      name: bio.fullName,
      link: bio.bioLink,
      content: `${bio.fullName} ${bio.bioLink} ${bio.jobTitle || ''}`.toLowerCase().trim(),
      description: bio.description,
      tags: bio.tags,
      additionalInfor: {
        jobTitle: bio.jobTitle
      },
      imageUrl: bio.avatar?.url || `https://avatar.iran.liara.run/username?username=${bio.fullName}` || '', // Thêm URL hình ảnh vào dữ liệu
    };

    await firstValueFrom(this.searchService.send('index_entity', {
      entity: entityData,
      entityType: 'bio',
      operation
    }));
  }

  async findByUser(userId: string): Promise<Partial<Bio>> {
    const [resJobPrice, bio] = await Promise.all([
      firstValueFrom(this.jobService.send('get_job_price_by_bio', userId)),
      this.bioModel.findOne({ userId }).select("-__v -createdAt -updatedAt")
    ]);

    let payload = {
      ...bio.toObject(),
      jobId: "",
      jobTitle: "",
      minPrice: 0,
      maxPrice: 0
    };
    const jobPrice = resJobPrice?.data;

    if (!isEmpty(jobPrice)) {
      payload.jobId = jobPrice.jobId._id;
      payload.jobTitle = jobPrice.jobId.name;
      payload.minPrice = jobPrice.minPrice;
      payload.maxPrice = jobPrice.maxPrice;
    }

    return payload;
  }

  async existsBioLink(bioLink: string): Promise<Bio> {
    return await this.bioModel.findOne({ bioLink });
  }

  async findByBioLink(bioLink: string): Promise<Partial<Bio>> {
    console.log("Bio link:", bioLink)
    const bio = await this.bioModel.findOne({ bioLink });
    if (!bio) return null

    const [resRangePrice, resJobs] = await Promise.all([
      firstValueFrom(this.jobService.send('get_service_price_range', bio.userId)),
      firstValueFrom(this.jobService.send('job_seller', bio.userId))
    ]);

    let payload = {
      ...bio.toObject(),
      price: resRangePrice?.data,
      jobs: resJobs?.data || [],
    };

    return payload
  }

  async createBio(createBioDto: { userId: string; fullName: string; bioLink: string, avatar: any }): Promise<Bio> {
    const newBio = new this.bioModel(createBioDto);
    const savedBio = await newBio.save();
    await this.indexBioEntity(savedBio, 'create');
    return newBio.save();
  }

  async getBioSearchService(bioLink: string, page: number = 1, limit: number = 10) {

    const skip = (page - 1) * limit;
    const regex = new RegExp(bioLink, 'i');

    const [bios, total] = await Promise.all([
      this.bioModel.find({ bioLink: { $regex: regex } })
        .skip(skip)
        .limit(limit + 1),
      this.bioModel.countDocuments({ bioLink: { $regex: regex } })
    ]);

    const hasMore = bios.length > limit;
    const resBio = bios.slice(0, limit);

    return {
      result: {
        bios: resBio,
        pagination: {
          currentPage: page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          hasMore
        }
      }
    }
  }

  async updateBio(userId: string, bioData: IUpdateBio, lang: string) {
    const checkDuplicates = (arr: any[], key: string) => {
      const uniqueValues = new Set(arr.map(item => item[key]));
      return uniqueValues.size < arr.length;
    };

    if (bioData.socialMedias && checkDuplicates(bioData.socialMedias, 'platform')) {
      throw new RpcException({
        statusCode: 400,
        message: this.i18n.t('translation.exitsPlatform', { lang })
      });
    }

    if (bioData.mediaWidgets && checkDuplicates(bioData.mediaWidgets, 'type')) {
      throw new RpcException({
        statusCode: 400,
        message: this.i18n.t('translation.exitsGrid', { lang })
      });
    }

    const existingBio = await this.bioModel.findOne({ userId });
    if (!existingBio) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('translation.bioNotFound', { lang })
      });
    }

    const updatedFields = {
      fullName: bioData.fullName,
      avatar: bioData.avatar && bioData.avatar.url ? bioData.avatar : undefined,
      jobId: bioData.jobId,
      jobTitle: bioData.jobTitle,
      description: bioData.description,
      socialMedias: bioData.socialMedias && bioData.socialMedias.length > 0 ? bioData.socialMedias : undefined,
      infors: bioData.infors && bioData.infors.length > 0 ? bioData.infors : undefined,
      tags: bioData.tags && bioData.tags.length > 0 ? bioData.tags : undefined,
      instructionVideo: bioData.instructionVideo && bioData.instructionVideo.url ? bioData.instructionVideo : undefined,
      mediaWidgets: bioData.mediaWidgets && bioData.mediaWidgets.length > 0 ? bioData.mediaWidgets : undefined,
      tabs: bioData.tabs && bioData.tabs.length > 0 ? bioData.tabs : undefined,
    };

    Object.assign(existingBio, updatedFields);
    await existingBio.save()
    await this.indexBioEntity(existingBio, 'update');


    return { result: existingBio, message: this.i18n.t('translation.updateSuccess', { lang }) };
  }

  async deleteBio(userId: string, lang: string) {
    const existingBio = await this.bioModel.findOneAndDelete({ userId });
    if (!existingBio) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('translation.bioNotFound', { lang })
      });
    }

    await this.indexBioEntity(existingBio, 'delete');

    return { message: this.i18n.t('translation.bioDeleted', { lang }) };
  }
}