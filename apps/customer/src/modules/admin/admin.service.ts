import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import * as _ from 'lodash';
import { Customer } from '@app/common';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private readonly i18n: I18nService,
  ) {}

  async getAllCustomers(query: any, lang: string) {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const { search } = query;
    const skip = (page - 1) * pageSize;
    let filter: any = {};

    if (search) {
      filter = {
        $or: [
          { fullName: { $regex: _.escapeRegExp(search), $options: 'i' } },
          { email: { $regex: _.escapeRegExp(search), $options: 'i' } },
          { username: { $regex: _.escapeRegExp(search), $options: 'i' } },
        ],
      };
    }

    const [total, customers] = await Promise.all([
      this.customerModel.countDocuments(filter),
      this.customerModel.find(filter)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const pagination = {
      total,
      page,
      pageSize,
      totalPages,
    };

    return {
      result: { pagination, customers },
      message: this.i18n.t('admin.allCustomersRetrieved', { lang }),
    };
  }

  async getCustomerById(id: string, lang: string) {
    const customer = await this.customerModel.findById(id).select('-password');
    if (!customer) {
      throw new RpcException(this.i18n.t('error.customerNotFound', { lang }));
    }
    return {
      result: customer,
      message: this.i18n.t('admin.customerRetrieved', { lang }),
    };
  }

  async updateCustomer(id: string, updateData: Partial<Customer>, lang: string) {
    const customer = await this.customerModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!customer) {
      throw new RpcException(this.i18n.t('error.customerNotFound', { lang }));
    }
    return {
      result: customer,
      message: this.i18n.t('admin.customerUpdated', { lang }),
    };
  }

//   async deleteCustomer(id: string, lang: string) {
//     const customer = await this.customerModel.findByIdAndDelete(id);
//     if (!customer) {
//       throw new RpcException(this.i18n.t('error.customerNotFound', { lang }));
//     }
//     return {
//       result: null,
//       message: this.i18n.t('admin.customerDeleted', { lang }),
//     };
//   }

  async blockCustomer(id: string, lang: string) {
    const customer = await this.customerModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).select('-password');
    if (!customer) {
      throw new RpcException(this.i18n.t('error.customerNotFound', { lang }));
    }
    return {
      result: customer,
      message: this.i18n.t('admin.customerBlocked', { lang }),
    };
  }

  async unblockCustomer(id: string, lang: string) {
    const customer = await this.customerModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).select('-password');
    if (!customer) {
      throw new RpcException(this.i18n.t('error.customerNotFound', { lang }));
    }
    return {
      result: customer,
      message: this.i18n.t('admin.customerUnblocked', { lang }),
    };
  }
}