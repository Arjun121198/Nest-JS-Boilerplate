
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBrandAccountDTO } from './dto/create-brandaccount.dto';
import { UpdateBrandaccountDTO } from './dto/update-brandaccount.dto';
import { Brandaccount } from './brandaccount.schema';

@Injectable()
export class BrandaccountService {
  constructor(@InjectModel('Brandaccount') private readonly model: Model<Brandaccount>) {}

  async create(createDto: CreateBrandAccountDTO): Promise<Brandaccount> {
    const created = new this.model(createDto);
    return created.save();
  }

  async findAll(): Promise<Brandaccount[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Brandaccount> {
    const result = await this.model.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Brandaccount with ID ${id} not found.`);
    }
    return result;
  }

  async update(id: string, updateDto: UpdateBrandaccountDTO): Promise<Brandaccount> {
    const result = await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(`Brandaccount with ID ${id} not found.`);
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Brandaccount with ID ${id} not found.`);
    }

  }
}

