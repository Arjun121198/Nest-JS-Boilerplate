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
echo "// Schema for $module_name" > $schema_path
echo "export class ${class_name}Schema {}" >> $schema_path

# Create DTO files for Create and Update
dto_create_path="src/$module_name/dto/create-${module_name}.dto.ts"
dto_update_path="src/$module_name/dto/update-${module_name}.dto.ts"

mkdir -p "src/$module_name/dto"

# Create Create DTO
echo "export class Create${class_name}Dto {" >> $dto_create_path
echo "}" >> $dto_create_path

# Create Update DTO
echo "export class Update${class_name}Dto {" >> $dto_update_path
echo "}" >> $dto_update_path

# Define CRUD methods for the controller
crud_controller="
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ${class_name}Service } from './${module_name}.service';
import { Create${class_name}Dto } from './dto/create-${module_name}.dto';
import { Update${class_name}Dto } from './dto/update-${module_name}.dto';

@Controller('${module_name}')
export class ${class_name}Controller {
  constructor(private readonly ${module_name}Service: ${class_name}Service) {}

  @Post()
  create(@Body() createDto: Create${class_name}Dto) {
    return this.${module_name}Service.create(createDto);
  }

  @Get()
  findAll() {
    return this.${module_name}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${module_name}Service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: Update${class_name}Dto) {
    return this.${module_name}Service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${module_name}Service.remove(id);
  }
}
"

# Define CRUD methods for the service
crud_service="
import { Injectable } from '@nestjs/common';
import { Create${class_name}Dto } from './dto/create-${module_name}.dto';
import { Update${class_name}Dto } from './dto/update-${module_name}.dto';

@Injectable()
export class ${class_name}Service {
  create(createDto: Create${class_name}Dto) {
    return 'This action adds a new ${module_name}';
  }

  findAll() {
    return 'This action returns all ${module_name}';
  }

  findOne(id: string) {
    return \`This action returns a #\${id} ${module_name}\`;
  }

  update(id: string, updateDto: Update${class_name}Dto) {
    return \`This action updates a #\${id} ${module_name}\`;
  }

  remove(id: string) {
    return \`This action removes a #\${id} ${module_name}\`;
  }
}
"

# Write CRUD methods to the controller and service files
controller_path="src/$module_name/${module_name}.controller.ts"
echo "$crud_controller" > $controller_path

service_path="src/$module_name/${module_name}.service.ts"
echo "$crud_service" > $service_path

# Check if all commands were successful
echo "Successfully generated module, service, controller, DTOs, and schema with CRUD methods for '$module_name'."
