
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseInterceptors } from '@nestjs/common';
import { BrandaccountService } from './brandaccount.service';
import { CreateBrandAccountDTO } from './dto/create-brandaccount.dto';
import { UpdateBrandaccountDTO } from './dto/update-brandaccount.dto';
import { BrandaccountInterceptor } from './interceptors/brandaccount.interceptor'; 

@Controller('brandaccount')
@UseInterceptors(BrandaccountInterceptor)
export class BrandaccountController {
  constructor(private readonly brandaccountService: BrandaccountService) {}

  @Post()
  async create(@Body() createDto: CreateBrandAccountDTO) {
    return this.brandaccountService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.brandaccountService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandaccountService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateBrandaccountDTO) {
    return this.brandaccountService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.brandaccountService.remove(id);
  }
}

