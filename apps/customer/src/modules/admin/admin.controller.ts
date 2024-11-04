import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminService } from './admin.service';
import { Customer } from '@app/common';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @MessagePattern('admin_get_all_customers')
  async getAllCustomers(@Payload() { query, lang }: { query: any; lang: string }) {
    return this.adminService.getAllCustomers(query, lang);
  }

  @MessagePattern('admin_get_customer_by_id')
  async getCustomerById(@Payload() { id, lang }: { id: string; lang: string }) {
    return this.adminService.getCustomerById(id, lang);
  }

  @MessagePattern('admin_update_customer')
  async updateCustomer(@Payload() { id, updateData, lang }: { id: string; updateData: Partial<Customer>; lang: string }) {
    return this.adminService.updateCustomer(id, updateData, lang);
  }

//   @MessagePattern('admin_delete_customer')
//   async deleteCustomer(@Payload() { id, lang }: { id: string; lang: string }) {
//     return this.adminService.deleteCustomer(id, lang);
//   }

  @MessagePattern('admin_block_customer')
  async blockCustomer(@Payload() { id, lang }: { id: string; lang: string }) {
    return this.adminService.blockCustomer(id, lang);
  }

  @MessagePattern('admin_unblock_customer')
  async unblockCustomer(@Payload() { id, lang }: { id: string; lang: string }) {
    return this.adminService.unblockCustomer(id, lang);
  }
}