import { Type } from '@nestjs/common';

export interface SwaggerConfigInterface {
  title: string;
  description: string;
  version: string;
  tags: string[];
}

export interface SwaggerDocumentOptions {
  include?: Type<any>[];
}