import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandaccountController } from './brandaccount.controller';
import { BrandaccountService } from './brandaccount.service';
import { BrandaccountSchema } from './brandaccount.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Brandaccount', schema: BrandaccountSchema }])],
  controllers: [BrandaccountController],
  providers: [BrandaccountService]
})
export class BrandaccountModule {}
