import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateVehicleDto } from '@application/api/http-rest/dto/vehicle/CreateVehicleDto';
import { SearchVehicleDto } from '@application/api/http-rest/dto/vehicle/SearchVehicleDto';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { CreateVehicleUseCase } from '@core/service/vehicle/usecase/CreateVehicleUseCase';
import { GetVehicleUseCase } from '@core/service/vehicle/usecase/GetVehicleUseCase';
import { SearchVehiclesUseCase } from '@core/service/vehicle/usecase/SearchVehiclesUseCase';
import {
  CreateVehicleResponseDto,
  ListVehiclesResponseDto,
  VehicleDetailResponseDto,
} from '@application/api/http-rest/dto/vehicle/VehicleResponseDto';

/**
 * Vehicle Controller - Quản lý xe cho thuê
 */
@Controller('api/vehicles')
@ApiTags('Vehicles')
export class VehicleController {
  
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly getVehicleUseCase: GetVehicleUseCase,
    private readonly searchVehiclesUseCase: SearchVehiclesUseCase,
  ) {}
  
  /**
   * Tạo vehicle listing mới (Owner only)
   */
  @Post()
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo vehicle listing mới' })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully', type: CreateVehicleResponseDto })
  async createVehicle(
    @Body() dto: CreateVehicleDto, 
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<CreateVehicleResponseDto> {
    const ownerId = request.user.id;
    
    const vehicle = await this.createVehicleUseCase.execute({
      ownerId,
      ...dto,
    });
    
    return {
      id: vehicle.getId(),
      ownerId: vehicle.getOwnerId(),
      title: vehicle.getTitle(),
      description: vehicle.getDescription(),
      vehicleType: vehicle.getVehicleType(),
      brand: vehicle.getBrand(),
      model: vehicle.getModel(),
      year: vehicle.getYear(),
      licensePlate: vehicle.getLicensePlate(),
      color: vehicle.getColor(),
      seats: vehicle.getSeats(),
      transmissionType: vehicle.getTransmissionType(),
      fuelType: vehicle.getFuelType(),
      condition: vehicle.getCondition(),
      mileage: vehicle.getMileage(),
      pricing: {
        pricePerDay: vehicle.getPricePerDay(),
        pricePerHour: vehicle.getPricePerHour(),
        currency: vehicle.getCurrency(),
        securityDeposit: vehicle.getSecurityDeposit(),
        insuranceFee: vehicle.getInsuranceFee(),
      },
      location: vehicle.getLocation(),
      latitude: vehicle.getLatitude(),
      longitude: vehicle.getLongitude(),
      status: vehicle.getStatus(),
      instantBooking: vehicle.isInstantBookingEnabled(),
      features: vehicle.getFeatures(),
      coverPhotoId: vehicle.getCoverPhotoId(),
      createdAt: vehicle.getCreatedAt(),
    };
  }
  
  /**
   * Search & List vehicles (Public)
   */
  @Get()
  @ApiOperation({ summary: 'Search vehicles' })
  @ApiResponse({ status: 200, description: 'List of vehicles', type: ListVehiclesResponseDto })
  async searchVehicles(@Query() query: SearchVehicleDto): Promise<ListVehiclesResponseDto> {
    const vehicles = await this.searchVehiclesUseCase.execute({
      vehicleType: query.vehicleType,
      location: query.location,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      seats: query.seats,
    });
    
    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = vehicles.slice(startIndex, endIndex);
    
    return {
      data: paginatedData.map(v => ({
        id: v.getId(),
        title: v.getTitle(),
        description: v.getDescription(),
        vehicleType: v.getVehicleType(),
        brand: v.getBrand(),
        model: v.getModel(),
        year: v.getYear(),
        color: v.getColor(),
        seats: v.getSeats(),
        transmissionType: v.getTransmissionType(),
        fuelType: v.getFuelType(),
        condition: v.getCondition(),
        mileage: v.getMileage(),
        pricePerDay: v.getPricePerDay(),
        pricePerHour: v.getPricePerHour(),
        currency: v.getCurrency(),
        location: v.getLocation(),
        latitude: v.getLatitude(),
        longitude: v.getLongitude(),
        status: v.getStatus(),
        instantBooking: v.isInstantBookingEnabled(),
        features: v.getFeatures(),
        coverPhotoId: v.getCoverPhotoId(),
      })),
      meta: {
        page,
        limit,
        totalItems: vehicles.length,
        totalPages: Math.ceil(vehicles.length / limit),
        hasNextPage: endIndex < vehicles.length,
        hasPreviousPage: page > 1,
      },
    };
  }
  
  /**
   * Get vehicle details (Public)
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle details' })
  @ApiResponse({ status: 200, description: 'Vehicle details', type: VehicleDetailResponseDto })
  async getVehicle(@Param('id') id: string): Promise<VehicleDetailResponseDto> {
    const vehicle = await this.getVehicleUseCase.execute({ id });
    
    // Calculate sample pricing for 3 days
    const sampleStartDate = new Date();
    const sampleEndDate = new Date();
    sampleEndDate.setDate(sampleEndDate.getDate() + 3);
    const samplePricing = vehicle.calculatePrice(sampleStartDate, sampleEndDate);
    
    return {
      id: vehicle.getId(),
      ownerId: vehicle.getOwnerId(),
      title: vehicle.getTitle(),
      description: vehicle.getDescription(),
      vehicleType: vehicle.getVehicleType(),
      brand: vehicle.getBrand(),
      model: vehicle.getModel(),
      year: vehicle.getYear(),
      licensePlate: vehicle.getLicensePlate(),
      color: vehicle.getColor(),
      seats: vehicle.getSeats(),
      transmissionType: vehicle.getTransmissionType(),
      fuelType: vehicle.getFuelType(),
      condition: vehicle.getCondition(),
      mileage: vehicle.getMileage(),
      pricing: {
        pricePerDay: vehicle.getPricePerDay(),
        pricePerHour: vehicle.getPricePerHour(),
        currency: vehicle.getCurrency(),
        securityDeposit: vehicle.getSecurityDeposit(),
        insuranceFee: vehicle.getInsuranceFee(),
      },
      location: vehicle.getLocation(),
      latitude: vehicle.getLatitude(),
      longitude: vehicle.getLongitude(),
      status: vehicle.getStatus(),
      instantBooking: vehicle.isInstantBookingEnabled(),
      features: vehicle.getFeatures(),
      coverPhotoId: vehicle.getCoverPhotoId(),
      samplePricing: {
        days: 3,
        breakdown: samplePricing,
      },
      createdAt: vehicle.getCreatedAt(),
      updatedAt: vehicle.getUpdatedAt(),
    };
  }
  
  /**
   * Get owner's vehicles
   */
  @Get('owner/my-vehicles')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get owner vehicles' })
  @ApiResponse({ status: 200, description: 'List of owner vehicles' })
  async getOwnerVehicles(@Req() request: any) {
    // TODO: Implement FindByOwnerIdUseCase
    return {
      data: [],
      meta: {
        page: 1,
        total: 0,
      },
    };
  }
  
  /**
   * Calculate rental price
   */
  @Post('calculate-price')
  @ApiOperation({ summary: 'Tính giá thuê xe' })
  @ApiResponse({ status: 200, description: 'Price breakdown' })
  async calculatePrice(
    @Body('vehicleId') vehicleId: string,
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Body('useHourly') useHourly?: boolean,
  ) {
    const vehicle = await this.getVehicleUseCase.execute({ id: vehicleId });
    
    const pricing = vehicle.calculatePrice(
      new Date(startDate),
      new Date(endDate),
      useHourly,
    );
    
    return {
      vehicleId,
      startDate,
      endDate,
      pricing,
      breakdown: [
        {
          label: `${pricing.unitPrice} ${pricing.currency} × ${pricing.units} ${useHourly ? 'hours' : 'days'}`,
          amount: pricing.subtotal,
        },
        ...pricing.additionalFees.map(fee => ({
          label: fee.name,
          amount: fee.amount,
          description: fee.description,
        })),
        {
          label: 'Tax (8%)',
          amount: pricing.taxAmount,
        },
      ],
      total: pricing.totalAmount,
      currency: pricing.currency,
    };
  }
}

