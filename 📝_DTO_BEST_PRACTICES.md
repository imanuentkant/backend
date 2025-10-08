# 📝 DTO Best Practices - Query Parameters

## ✅ Đã Cập Nhật: GetEarningsQueryDto

### ❌ Trước (Không chuẩn):
```typescript
@Get('earnings')
async getEarnings(
  @Query('period') period: string = 'month',
  @Req() request: any
) {
  // period là string, không có validation
  // period: period as 'week' | 'month' | 'year' // Unsafe cast
}
```

**Vấn đề:**
- ❌ Không có validation
- ❌ Có thể truyền giá trị invalid: `?period=invalid`
- ❌ Không có type safety
- ❌ Không có auto-complete trong Swagger
- ❌ Unsafe type casting

---

### ✅ Sau (Chuẩn):
```typescript
// DTO File: GetEarningsQueryDto.ts
export enum PeriodType {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class GetEarningsQueryDto {
  @ApiPropertyOptional({ 
    enum: PeriodType,
    description: 'Khoảng thời gian báo cáo',
    default: PeriodType.MONTH,
    example: 'month'
  })
  @IsOptional()
  @IsEnum(PeriodType, {
    message: 'Period must be one of: week, month, year'
  })
  period?: PeriodType = PeriodType.MONTH;
}

// Controller
@Get('earnings')
async getEarnings(
  @Query() query: GetEarningsQueryDto,
  @Req() request: any
) {
  const earnings = await this.getHostEarningsUseCase.execute({ 
    hostId: request.user.id, 
    period: query.period || 'month',
  });
}
```

**Lợi ích:**
- ✅ Có validation tự động
- ✅ Reject invalid values
- ✅ Type-safe
- ✅ Auto-complete trong Swagger UI
- ✅ Clear error messages
- ✅ Reusable DTO

---

## 🎯 Validation trong Action

### Request với valid value:
```http
GET /api/host/dashboard/earnings?period=month
✅ SUCCESS - Accepted
```

### Request với invalid value:
```http
GET /api/host/dashboard/earnings?period=invalid
❌ 400 Bad Request
{
  "statusCode": 400,
  "message": ["Period must be one of: week, month, year"],
  "error": "Bad Request"
}
```

### Request without parameter:
```http
GET /api/host/dashboard/earnings
✅ SUCCESS - Uses default 'month'
```

---

## 📊 Swagger UI Benefits

### Enum Dropdown:
```
Period: [dropdown]
  ▼ month (default)
  - week
  - month
  - year
```

**User Experience:**
- Không thể nhập sai giá trị
- Clear options
- Default value hiển thị
- Description tooltip

---

## 🏗️ Best Practices Applied

### 1. Enum for Fixed Values ✅
```typescript
export enum PeriodType {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}
```

**Why:**
- Type-safe
- Centralized values
- Easy to maintain
- IDE auto-complete

---

### 2. Validation Decorators ✅
```typescript
@IsOptional()           // Field is optional
@IsEnum(PeriodType, {   // Must be valid enum
  message: '...'        // Custom error message
})
```

**Why:**
- Automatic validation
- Clear error messages
- No manual checks needed

---

### 3. Swagger Documentation ✅
```typescript
@ApiPropertyOptional({ 
  enum: PeriodType,
  description: '...',
  default: PeriodType.MONTH,
  example: 'month'
})
```

**Why:**
- Auto-generated API docs
- Interactive UI
- Clear examples
- Better DX

---

### 4. Default Values ✅
```typescript
period?: PeriodType = PeriodType.MONTH;
```

**Why:**
- User-friendly
- No null checks needed
- Consistent behavior

---

## 📝 Pattern for Other Query DTOs

### Example: SearchQueryDto
```typescript
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SearchQueryDto {
  
  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  keyword?: string;
  
  @ApiPropertyOptional({ enum: SortOrder, default: 'asc' })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
  
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
  
  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
}
```

---

## 🎓 Key Takeaways

### DO ✅
- ✅ Create DTO for query parameters
- ✅ Use enums for fixed values
- ✅ Add validation decorators
- ✅ Document with Swagger decorators
- ✅ Provide default values
- ✅ Use descriptive error messages

### DON'T ❌
- ❌ Use raw `string` or `number` for query params
- ❌ Manual validation in controller
- ❌ Type casting without validation
- ❌ Skip Swagger documentation
- ❌ Accept any value without validation

---

## 📦 Files Created

```
src/application/api/http-rest/dto/booking/
├── CreateBookingDto.ts
├── GetEarningsQueryDto.ts    ← NEW ✅
└── ...
```

---

## 🚀 Next Steps (Optional)

### Apply to Other Controllers:

1. **BookingController**
```typescript
// query: status
class GetBookingsQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
```

2. **PropertyController**
```typescript
// Already has SearchPropertyDto ✅
```

3. **VehicleController**
```typescript
// Already has SearchVehicleDto ✅
```

---

## 🎉 Summary

### Before:
```typescript
@Query('period') period: string = 'month'
```

### After:
```typescript
@Query() query: GetEarningsQueryDto
```

**Benefits:**
- ✅ Type-safe
- ✅ Validated
- ✅ Documented
- ✅ User-friendly
- ✅ Maintainable

**Build Status:** ✅ SUCCESS

🎊 **Best practices applied!**

