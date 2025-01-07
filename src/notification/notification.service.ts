
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(@InjectModel('Notification') private readonly model: Model<Notification>) {}

  async create(createDto: CreateNotificationDTO): Promise<Notification> {
    const created = new this.model(createDto);
    return created.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<Notification> {
    const result = await this.model.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Notification with ID ${id} not found.`);
    }
    return result;
  }

  async update(id: string, updateDto: UpdateNotificationDTO): Promise<Notification> {
    const result = await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(`Notification with ID ${id} not found.`);
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Notification with ID ${id} not found.`);
    }

  }
}

