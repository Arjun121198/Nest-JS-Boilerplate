import { Injectable , HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.schema/admin.schema'; // Adjust the path as needed
import { LoginDto } from './dto/login-dto/login-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>
  ) {}

  /**
   * Creates a default admin if it doesn't already exist, or returns the existing one.
   * @returns The admin document (without Mongoose metadata)
   */
  async createDefaultAdmin() {
    try {
      const existingAdmin = await this.adminModel.findOne({ email: 'admin@sparkouttech.com' });
      
      if (existingAdmin) {
        return existingAdmin.toObject();
      }
  
      const adminData = {
        name: 'Admin',
        email: 'admin@sparkouttech.com',
        password: 'SparkBlock@123', 
        is_primary: true,
        authorisation: 'admin-authorization-key',
      };
  
      const savedAdmin = await this.adminModel.create(adminData);
      return savedAdmin.toObject(); 
    } catch (error) {
      throw new Error('Error checking or creating admin: ' + error.message);
    }
  }

  /** 
   * Get Admin Detail
   * @return The admin document (without Mongoose metadata)
   **/
  async getAdminDetail(){
    try {
      const existingAdmin = await this.adminModel.findOne({ email: 'admin@sparkouttech.com' });
      return existingAdmin.toObject(); 
    } catch (error) {
      throw new Error('Error checking or creating admin: ' + error.message);
    }
  }
  
  /** 
   * Admin Login
   **/
  async login(logindto: LoginDto) {
    try {
      const admin = await this.adminModel.findOne({ email: logindto.email });
  
      if (!admin) {
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
      }

      if (!await bcrypt.compare(logindto.password, admin.password)) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      
      return { name: admin.name, email: admin.email };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error during login',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
