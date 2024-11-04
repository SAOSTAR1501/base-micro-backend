import { Service } from "../models/service.schema";

export interface ICreateService {
    jobId: string;
    sellerId: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    tags?: string[];
  }
  
  export interface IUpdateService {
    id: string;
    sellerId?: string;
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    tags?: string[];
  }

  export interface IDeleteService {
    id: string;
    userId: string;
  }

  export interface Seller {
    sellerId: string;
    fullname: string;
    username: string;
    avatarUrl: string;
  }
  
  export interface ServiceWithSeller extends Service {
    sellerInfo?: {
      seller: Seller;
    };
  }
  