import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bio } from '../bio/schemes/bio.schema';
import { I18nService } from 'nestjs-i18n';
import { RpcException } from '@nestjs/microservices';
import * as _ from 'lodash';

@Injectable()
export class AdminBioService {
  constructor(
    @InjectModel(Bio.name) private bioModel: Model<Bio>,
    private readonly i18n: I18nService
  ) {}

  async getAllBios(query: any, lang: string) {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const { search } = query;
    const skip = (page - 1) * pageSize;
    let filter: any = {};

    if (search) {
      filter = {
        $or: [
          { fullName: { $regex: _.escapeRegExp(search), $options: 'i' } },
          { bioLink: { $regex: _.escapeRegExp(search), $options: 'i' } }
        ]
      };
    }

    const [total, bios] = await Promise.all([
      this.bioModel.countDocuments(filter),
      this.bioModel.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const pagination = {
      total,
      page,
      pageSize,
      totalPage: totalPages,
    };

    return { pagination, bios };
  }

  async getBioById(id: string, lang: string) {
    const bio = await this.bioModel.findById(id).select('-__v');
    if (!bio) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('translation.bioNotFound', { lang })
      });
    }
    return bio;
  }

  async blockBio(id: string, lang: string) {
    const bio = await this.bioModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    if (!bio) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('translation.bioNotFound', { lang })
      });
    }
    return bio;
  }

  async unblockBio(id: string, lang: string) {
    const bio = await this.bioModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    if (!bio) {
      throw new RpcException({
        statusCode: 404,
        message: this.i18n.t('translation.bioNotFound', { lang })
      });
    }
    return bio;
  }
}