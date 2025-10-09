import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('vehicles')
@ApiTags('Vehicles')
export class VehicleController {
  
  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'List of vehicles' })
  async getVehicles(@Query('city') city?: string) {
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Toyota Camry 2024',
          type: 'CAR',
          pricePerDay: 50,
          location: city || 'Hanoi',
          available: true,
        },
      ],
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  async getVehicle(@Param('id') id: string) {
    return {
      success: true,
      data: {
        id,
        name: 'Toyota Camry 2024',
        type: 'CAR',
        pricePerDay: 50,
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create vehicle' })
  async createVehicle(@Body() body: any, @Req() request: Request) {
    const ownerId = (request as any).user?.id || 'mock-user-id';
    return {
      success: true,
      data: {
        id: 'new-vehicle-id',
        ...body,
        ownerId,
      },
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  async updateVehicle(@Param('id') id: string, @Body() body: any) {
    return {
      success: true,
      data: { id, ...body },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  async deleteVehicle(@Param('id') id: string) {
    return {
      success: true,
      message: 'Vehicle deleted',
    };
  }

  @Post(':id/book')
  @ApiOperation({ summary: 'Book vehicle' })
  async bookVehicle(
    @Param('id') id: string,
    @Body() body: { startDate: string; endDate: string },
  ) {
    return {
      success: true,
      data: {
        bookingId: 'new-booking-id',
        vehicleId: id,
        ...body,
      },
    };
  }
}

