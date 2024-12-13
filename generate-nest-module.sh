#!/bin/bash

# Check if the module name is provided
if [ -z "$1" ]; then
  echo "Error: Module name is required."
  echo "Usage: ./generate-nest-module.sh <module-name>"
  exit 1
fi

# Get the module name from the argument and convert to lowercase for consistency
module_name=$(echo "$1" | tr '[:upper:]' '[:lower:]')

# Convert module name to PascalCase for class naming
class_name=$(echo "$module_name" | sed -r 's/(^|-)([a-z])/\U\2/g')

# Generate the module, service, controller, and class without *.spec.ts files
echo "Generating NestJS module, service, controller, and class for '$module_name'..."

# Generate the module, service, and controller
nest g module $module_name --no-spec
if [ $? -ne 0 ]; then
  echo "Error generating module for '$module_name'."
  exit 1
fi

nest g controller $module_name --no-spec
if [ $? -ne 0 ]; then
  echo "Error generating controller for '$module_name'."
  exit 1
fi

nest g service $module_name --no-spec
if [ $? -ne 0 ]; then
  echo "Error generating service for '$module_name'."
  exit 1
fi

# Optional: Create a schema class manually (without the test file)
schema_path="src/$module_name/${module_name}.schema.ts"
mkdir -p "src/$module_name"
echo "import { Schema, Document } from 'mongoose';" > $schema_path
echo "" >> $schema_path
echo "export const ${class_name}Schema = new Schema({" >> $schema_path
echo "  name: { type: String, required: true }," >> $schema_path
echo "  description: { type: String }," >> $schema_path
echo "  status: { type: Number, default: 0 }," >> $schema_path
echo "  createdAt: { type: Date, default: Date.now }," >> $schema_path
echo "});" >> $schema_path
echo "" >> $schema_path
echo "export interface ${class_name} extends Document {" >> $schema_path
echo "  name: string;" >> $schema_path
echo "  description?: string;" >> $schema_path
echo "  status: number;" >> $schema_path
echo "  createdAt: Date;" >> $schema_path
echo "}" >> $schema_path

# Create DTO files for Create and Update
dto_create_path="src/$module_name/dto/create-${module_name}.dto.ts"
dto_update_path="src/$module_name/dto/update-${module_name}.dto.ts"

mkdir -p "src/$module_name/dto"

# Create Interface for Create DTO
echo "export class Create${class_name}DTO {" > $dto_create_path
echo "  readonly name: string;" >> $dto_create_path
echo "  readonly description?: string;" >> $dto_create_path
echo "}" >> $dto_create_path

# Create Interface for Update DTO
echo "export class Update${class_name}DTO {" > $dto_update_path
echo "  readonly name?: string;" >> $dto_update_path
echo "  readonly description?: string;" >> $dto_update_path
echo "}" >> $dto_update_path

# Define CRUD methods for the controller
crud_controller="
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ${class_name}Service } from './${module_name}.service';
import { Create${class_name}DTO } from './dto/create-${module_name}.dto';
import { Update${class_name}DTO } from './dto/update-${module_name}.dto';
import { ${class_name}Interceptor } from './interceptors/${module_name}.interceptor'; 

@Controller('${module_name}')
@UseInterceptors(${class_name}Interceptor)
export class ${class_name}Controller {
  constructor(private readonly ${module_name}Service: ${class_name}Service) {}

  @Post()
  async create(@Body() createDto: Create${class_name}DTO) {
    return this.${module_name}Service.create(createDto);
  }

  @Get()
  async findAll() {
    return this.${module_name}Service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.${module_name}Service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: Update${class_name}DTO) {
    return this.${module_name}Service.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.${module_name}Service.remove(id);
  }
}
"

# Define CRUD methods for the service
crud_service="
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Create${class_name}DTO } from './dto/create-${module_name}.dto';
import { Update${class_name}DTO } from './dto/update-${module_name}.dto';
import { ${class_name} } from './${module_name}.schema';

@Injectable()
export class ${class_name}Service {
  constructor(@InjectModel('${class_name}') private readonly model: Model<${class_name}>) {}

  async create(createDto: Create${class_name}DTO): Promise<${class_name}> {
    const created = new this.model(createDto);
    return created.save();
  }

  async findAll(): Promise<${class_name}[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<${class_name}> {
    const result = await this.model.findById(id).exec();
    if (!result) {
      throw new NotFoundException(\`${class_name} with ID \${id} not found.\`);
    }
    return result;
  }

  async update(id: string, updateDto: Update${class_name}DTO): Promise<${class_name}> {
    const result = await this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!result) {
      throw new NotFoundException(\`${class_name} with ID \${id} not found.\`);
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(\`${class_name} with ID \${id} not found.\`);
    }

  }
}
"

# Write CRUD methods to the controller and service files
controller_path="src/$module_name/${module_name}.controller.ts"
echo "$crud_controller" > $controller_path

service_path="src/$module_name/${module_name}.service.ts"
echo "$crud_service" > $service_path

# Generate the module file with MongooseModule integration
module_path="src/$module_name/${module_name}.module.ts"
echo "import { Module } from '@nestjs/common';" > $module_path
echo "import { MongooseModule } from '@nestjs/mongoose';" >> $module_path
echo "import { ${class_name}Controller } from './${module_name}.controller';" >> $module_path
echo "import { ${class_name}Service } from './${module_name}.service';" >> $module_path
echo "import { ${class_name}Schema } from './${module_name}.schema';" >> $module_path
echo "" >> $module_path
echo "@Module({" >> $module_path
echo "  imports: [MongooseModule.forFeature([{ name: '${class_name}', schema: ${class_name}Schema }])]," >> $module_path
echo "  controllers: [${class_name}Controller]," >> $module_path
echo "  providers: [${class_name}Service]" >> $module_path
echo "})" >> $module_path
echo "export class ${class_name}Module {}" >> $module_path

# Generate the interceptor_path file for response
interceptor_path="src/$module_name/interceptors/${module_name}.interceptor.ts"
mkdir -p "src/$module_name/interceptors"
echo "import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';" > $interceptor_path
echo "import { Observable, of } from 'rxjs';" >> $interceptor_path 
echo "import { map, catchError } from 'rxjs/operators';" >> $interceptor_path
echo "" >> $interceptor_path
echo "@Injectable()" >> $interceptor_path
echo "export class ${class_name}Interceptor implements NestInterceptor {" >> $interceptor_path
echo "  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {" >> $interceptor_path
echo "    return next.handle().pipe(" >> $interceptor_path
echo "      map((response) => {" >> $interceptor_path
echo "        context.switchToHttp().getResponse().status(200);" >> $interceptor_path
echo "        return { statusCode: 200, message: 'Success', data: response };" >> $interceptor_path
echo "      })," >> $interceptor_path 
echo "      catchError((error) => {" >> $interceptor_path
echo "        context.switchToHttp().getResponse().status(500);" >> $interceptor_path
echo "        return of({" >> $interceptor_path
echo "          statusCode: 500," >> $interceptor_path
echo "          message: error.message || 'Internal Server Error'," >> $interceptor_path
echo "          error: error," >> $interceptor_path
echo "        });" >> $interceptor_path
echo "      })" >> $interceptor_path
echo "    );" >> $interceptor_path
echo "  }" >> $interceptor_path
echo "}" >> $interceptor_path



# Final message
echo "Successfully generated module, service, controller, schema, and DTOs for '$module_name' with MongoDB integration."
