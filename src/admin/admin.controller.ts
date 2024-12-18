import { Controller, Body, Post, Get, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminMessages } from './message/message';
import { successResponse, errorResponse } from '../util/response.helper';
import { LoginDto } from './dto/login-dto/login-dto';

@Controller('admin')
  export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // Create admin
    @Post('/')
      async createAdmin() {
        try {
          const admin = await this.adminService.createDefaultAdmin();
          return successResponse(AdminMessages.ACCOUNT_CREATED, admin, HttpStatus.OK);
        } catch (error) {
          return errorResponse(AdminMessages.BAD_REQUEST, error.message, HttpStatus.OK);
        }
      }

    // Get Admin Detail
    @Get('/')
      async getAdmin() {
        try {
          const admin =  await this.adminService.getAdminDetail();
          return successResponse(AdminMessages.OK, admin, HttpStatus.CREATED);
        } catch (error) {
          return errorResponse(AdminMessages.BAD_REQUEST, error.message, HttpStatus.BAD_REQUEST);
        }
      }
      
    // Login 
    @Post('/login')
    async login(@Body() logindto: LoginDto) {
      try {
        const admin = await this.adminService.login(logindto);
        return successResponse(AdminMessages.LOGIN_SUCCESS, admin, HttpStatus.OK);
      } catch (error) {
        return errorResponse(error.message || AdminMessages.BAD_REQUEST, null, error.getStatus ? error.getStatus() : HttpStatus.BAD_REQUEST );
      }
    }
    
}
