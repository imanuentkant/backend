# 🗄️ DATABASE MIGRATIONS GUIDE

## 📋 HIỆN TRẠNG

Hệ thống hiện đang chạy với **MOCK DATA**. API hoạt động tốt mà không cần database thật.

### Migrations Có Sẵn
✅ **3 Airbnb Migrations** (11 tables):
- `1696800000000-CreatePropertiesTables.ts` - 5 tables
- `1696800001000-CreateBookingsTables.ts` - 2 tables  
- `1696800002000-CreateReviewsTables.ts` - 1 table

⚠️ **Lưu ý**: Migrations Airbnb sẽ tạo foreign keys đến bảng `users` (nếu bảng tồn tại).

---

## 🎯 KHI NÀO CẦN RUN MIGRATIONS?

### ❌ KHÔNG CẦN RUN nếu:
- Bạn chỉ test API
- Frontend development với mock data
- Demo cho stakeholders
- Prototype nhanh

### ✅ CẦN RUN nếu:
- Muốn persist data thật
- Production deployment
- Integration testing với real data
- Development backend features

---

## 🚀 OPTION 1: CHỈ AIRBNB TABLES (Recommended)

Nếu bạn chỉ cần tables Airbnb mà không cần hệ thống cũ:

### Bước 1: Kiểm tra Database
```bash
# Ensure PostgreSQL is running
docker-compose up -d postgresql_local

# Check connection
docker exec -it postgresql_local psql -U iposter -d iposter
```

### Bước 2: Run Migrations
```bash
npm run build
npm run migration:run
```

**Kết quả**: 
- ✅ 11 tables mới được tạo
- ✅ Foreign keys đến `users` sẽ bị skip (vì chưa có bảng users)
- ✅ API tiếp tục hoạt động với mock data
- ⏳ Có thể implement repositories sau để dùng real data

---

## 🔄 OPTION 2: FULL SYSTEM (Với Users)

Nếu bạn muốn toàn bộ hệ thống bao gồm users, posts, media:

### Bước 1: Check Existing Migrations
```bash
# Xem list migrations
ls src/infrastructure/adapter/persistence/typeorm/migration/
```

### Bước 2: Run All Migrations
```bash
# Build first
npm run build

# Run all migrations
npm run migration:run
```

### Bước 3: Verify
```bash
# Check tables created
docker exec -it postgresql_local psql -U iposter -d iposter -c "\dt"
```

**Expected Tables**:
- users
- posts
- media
- comments
- albums
- properties (Airbnb)
- property_locations (Airbnb)
- amenities (Airbnb)
- property_amenities (Airbnb)
- property_photos (Airbnb)
- bookings (Airbnb)
- booking_dates (Airbnb)
- reviews (Airbnb)

---

## 🛠️ TROUBLESHOOTING

### Problem 1: "relation users does not exist"

**Đã được fix!** Migrations giờ sẽ check xem bảng `users` có tồn tại không trước khi tạo foreign key.

**What happens now**:
- ✅ Nếu có bảng users → Tạo foreign key
- ✅ Nếu không có → Skip foreign key, vẫn tạo table

### Problem 2: Migration already ran

```bash
# Check migration status
npm run migration:show

# Revert last migration
npm run migration:revert

# Run again
npm run migration:run
```

### Problem 3: Want to reset everything

```bash
# Drop all tables (CAREFUL!)
docker exec -it postgresql_local psql -U iposter -d iposter -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Run migrations fresh
npm run migration:run
```

### Problem 4: Can't connect to database

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Start if not running
docker-compose up -d postgresql_local

# Check logs
docker logs postgresql_local
```

---

## 📊 DATABASE SCHEMA

### Properties Domain (5 tables)

#### 1. properties
```sql
- id (uuid, PK)
- host_id (uuid, FK → users)
- title, description
- property_type, max_guests, bedrooms, beds, bathrooms
- price_per_night, cleaning_fee, currency
- minimum_nights, maximum_nights
- instant_booking, status
- created_at, updated_at, removed_at
```

#### 2. property_locations
```sql
- id (uuid, PK)
- property_id (uuid, FK → properties)
- address, city, state, country, postal_code
- latitude, longitude
```

#### 3. amenities
```sql
- id (uuid, PK)
- name, icon, category
```

#### 4. property_amenities (junction)
```sql
- property_id (FK → properties)
- amenity_id (FK → amenities)
```

#### 5. property_photos
```sql
- id (uuid, PK)
- property_id (FK → properties)
- media_id (uuid, FK → media)
- is_cover, order_index
```

### Bookings Domain (2 tables)

#### 6. bookings
```sql
- id (uuid, PK)
- property_id (FK → properties)
- guest_id (FK → users)
- check_in_date, check_out_date
- number_of_guests, total_nights
- price_per_night, subtotal, cleaning_fee, service_fee, total_amount
- status, cancellation_policy
- special_requests, cancellation_reason
- created_at, updated_at, confirmed_at, cancelled_at
```

#### 7. booking_dates
```sql
- property_id (FK → properties)
- date
- booking_id (FK → bookings)
- status
```

### Reviews Domain (1 table)

#### 8. reviews
```sql
- id (uuid, PK)
- booking_id (FK → bookings)
- property_id (FK → properties)
- reviewer_id (FK → users)
- reviewee_id (FK → users)
- rating_overall, rating_cleanliness, rating_accuracy
- rating_checkin, rating_communication, rating_location, rating_value
- comment, response
- is_published, published_at
- created_at, updated_at
```

---

## 🔐 INDEXES

Migrations tự động tạo indexes cho:

### Properties
- `IDX_properties_host_id`
- `IDX_properties_status`
- `IDX_properties_property_type`
- `IDX_property_locations_city`
- `IDX_property_locations_country`
- `IDX_property_locations_coordinates` (geospatial)

### Bookings
- `IDX_bookings_property_id`
- `IDX_bookings_guest_id`
- `IDX_bookings_status`
- `IDX_bookings_check_in_date`
- `IDX_booking_dates_property_date` (unique)

### Reviews
- `IDX_reviews_property_id`
- `IDX_reviews_reviewer_id`
- `IDX_reviews_booking_id` (unique)
- `IDX_reviews_is_published`

---

## 📝 SEED DATA (Optional)

Sau khi run migrations, bạn có thể tạo seed data:

### Manual Seed via SQL
```sql
-- Seed amenities
INSERT INTO amenities (id, name, icon, category) VALUES
  (gen_random_uuid(), 'WiFi', 'wifi', 'basic'),
  (gen_random_uuid(), 'Kitchen', 'kitchen', 'basic'),
  (gen_random_uuid(), 'Air Conditioning', 'ac', 'basic'),
  (gen_random_uuid(), 'Pool', 'pool', 'outdoor'),
  (gen_random_uuid(), 'Parking', 'parking', 'basic');
```

### Or Create Seed Script
```typescript
// scripts/seed-airbnb.ts
import { DataSource } from 'typeorm';

async function seed() {
  const dataSource = new DataSource({
    // ... config
  });
  
  await dataSource.initialize();
  
  // Seed amenities
  await dataSource.query(`
    INSERT INTO amenities (id, name, icon, category) VALUES
    (gen_random_uuid(), 'WiFi', 'wifi', 'basic'),
    (gen_random_uuid(), 'Kitchen', 'kitchen', 'basic')
  `);
  
  console.log('Seed completed');
  await dataSource.destroy();
}

seed();
```

```bash
# Run seed
ts-node scripts/seed-airbnb.ts
```

---

## 🔄 MIGRATION WORKFLOW

### Development
```bash
# 1. Make changes to entities
# 2. Generate migration
npm run migration:generate -- -n AddNewColumn

# 3. Review generated migration
# 4. Run migration
npm run migration:run

# 5. If wrong, revert
npm run migration:revert
```

### Production
```bash
# 1. Test migrations in staging
npm run migration:run

# 2. Backup database
pg_dump -h localhost -U iposter iposter > backup.sql

# 3. Run in production
npm run migration:run

# 4. Verify
npm run migration:show
```

---

## ⚙️ CONFIGURATION

### ormconfig.json
```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5454,
  "username": "iposter",
  "password": "souQu6ienug0ash9eeY9",
  "database": "iposter",
  "entities": ["dist/infrastructure/adapter/persistence/typeorm/entity/**/*.js"],
  "migrations": ["dist/infrastructure/adapter/persistence/typeorm/migration/**/*.js"],
  "cli": {
    "migrationsDir": "src/infrastructure/adapter/persistence/typeorm/migration"
  }
}
```

---

## 🎯 SUMMARY

### Current State
- ✅ API hoạt động với MOCK DATA
- ✅ 3 migrations sẵn sàng (11 tables)
- ✅ Foreign keys tự động skip nếu users table không tồn tại
- ✅ Indexes đã được tạo

### To Use Real Data
1. Run migrations: `npm run migration:run`
2. Implement TypeORM entities (if needed)
3. Implement repositories
4. Update controllers to use repositories instead of mock data

### Recommended Approach
1. **NOW**: Continue using MOCK DATA for development
2. **LATER**: Run migrations when ready for production
3. **OPTIONAL**: Seed data for testing

---

## 📞 COMMANDS REFERENCE

```bash
# Build
npm run build

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show

# Generate new migration
npm run migration:generate -- -n MigrationName

# Create empty migration
npm run migration:create -- -n MigrationName
```

---

## ✅ BEST PRACTICES

1. **Always backup** before running migrations in production
2. **Test migrations** in staging first
3. **Review generated** migrations before running
4. **Version control** all migration files
5. **Document changes** in migration file comments
6. **Rollback plan** - test revert before deploying

---

**Current Status**: ✅ Migrations ready, API works with mock data, database optional!

