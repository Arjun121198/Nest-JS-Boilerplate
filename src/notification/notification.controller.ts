
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { NotificationInterceptor } from './interceptors/notification.interceptor'; 

@Controller('notification')
@UseInterceptors(NotificationInterceptor)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createDto: CreateNotificationDTO) {
    return this.notificationService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateNotificationDTO) {
    return this.notificationService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}

