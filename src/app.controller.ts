import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App') // Grouping the endpoint under the "App" category in Swagger UI
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Hello Message',
    description: 'Returns a simple greeting message.',
  }) // Provides a summary and description for the method
  @ApiResponse({
    status: 200,
    description: 'The greeting message was successfully retrieved.',
    schema: { type: 'string', example: 'Hello World!' },
  }) // Describes the possible response for the endpoint
  getHello(): string {
    return this.appService.getHello();
  }
}
