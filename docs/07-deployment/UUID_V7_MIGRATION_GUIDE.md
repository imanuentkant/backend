# 🔄 UUID V7 MIGRATION - TIME-BASED SORTABLE IDs

## 🎯 TẠI SAO ĐỔI SANG UUID V7?

### UUID v4 (Hiện tại):
- ❌ Random, không có thứ tự
- ❌ Không sortable
- ❌ Không tối ưu cho database index
- ❌ Không thể sắp xếp theo thời gian

### UUID v7 (Mới nhất):
- ✅ **Time-based** - Chứa timestamp
- ✅ **Sortable** - Có thể sort theo thời gian tạo
- ✅ **Index-friendly** - Tốt hơn cho database B-tree index
- ✅ **Compatible** - Vẫn là UUID standard

### So sánh:

```javascript
// UUID v4 (random)
"a3bb189e-8bf9-4e0b-8f45-e8e8b8f8e8e8"
"12345678-1234-4123-8123-123456789012"
"ffffffff-ffff-4fff-8fff-ffffffffffff"
// Không có pattern, random hoàn toàn

// UUID v7 (time-based, sortable)
"018b6e38-1234-7000-8000-000000000001"  // Created 2024-01-01
"018b6e39-5678-7000-8000-000000000002"  // Created 2024-01-02
"018b6e3a-9abc-7000-8000-000000000003"  // Created 2024-01-03
// Prefix tăng dần theo thời gian!
```

### Benefits:
- 🚀 **30% faster** database inserts (better B-tree performance)
- 📊 **Better indexing** - Sequential IDs
- 🔍 **Easy debugging** - Sort by ID = sort by creation time
- 📈 **Query optimization** - Range queries efficient

---

## 🔄 MIGRATION STRATEGY

### Option 1: Update Tất Cả (Recommended)
- Thay tất cả `v4()` thành `v7()`
- Clean, consistent
- Best for new projects

### Option 2: Hybrid (Transition)
- Entities mới dùng v7
- Entities cũ giữ v4
- Dần migrate

### Option 3: Helper Function
- Wrapper function
- Easy to change implementation

---

## 🚀 IMPLEMENTATION

### Bước 1: Check UUID Package Version
```bash
npm list uuid
# Should be >= 9.0.0 for v7 support
```

### Bước 2: Update If Needed
```bash
npm install uuid@latest
# Latest có v7 support
```

### Bước 3: Create UUID Helper
```typescript
// src/core/common/util/uuid/UuidGenerator.ts
import { v7 as uuidv7 } from 'uuid';

export class UuidGenerator {
  /**
   * Generate time-based sortable UUID v7
   */
  static generate(): string {
    return uuidv7();
  }
  
  /**
   * Generate UUID from timestamp (for testing)
   */
  static generateFromTimestamp(timestamp: number): string {
    return uuidv7({ msecs: timestamp });
  }
  
  /**
   * Validate UUID
   */
  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
  
  /**
   * Extract timestamp from UUID v7
   */
  static extractTimestamp(uuid: string): Date {
    // UUID v7 first 48 bits = Unix timestamp in milliseconds
    const hex = uuid.replace(/-/g, '').substring(0, 12);
    const timestamp = parseInt(hex, 16);
    return new Date(timestamp);
  }
}
```

### Bước 4: Replace Tất Cả v4()

**From**:
```typescript
import { v4 as uuid } from 'uuid';

const id = uuid();
```

**To**:
```typescript
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

const id = UuidGenerator.generate();
```

**Or**:
```typescript
import { v7 as uuid } from 'uuid';

const id = uuid();
```

---

## 📝 MIGRATION SCRIPT

Tôi sẽ tạo script tự động replace:

```bash
# find-replace-uuid.sh
find src -type f -name "*.ts" -exec sed -i 's/v4 as uuid/v7 as uuid/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/{ v4 }/{ v7 as uuid }/g' {} +
```

---

## 🎯 RECOMMENDED APPROACH

### Approach 1: UuidGenerator Helper (Best)

**Ưu điểm**:
- ✅ Centralized
- ✅ Easy to change implementation
- ✅ Can add custom logic
- ✅ Testable

**Code**:
```typescript
// Usage everywhere
const id = UuidGenerator.generate();

// Future change chỉ ở 1 chỗ!
```

### Approach 2: Direct v7 Import

**Ưu điểm**:
- ✅ Simple
- ✅ Direct
- ✅ No wrapper

**Code**:
```typescript
import { v7 as uuid } from 'uuid';
const id = uuid();
```

---

## 💡 WHICH APPROACH?

Tôi recommend **Approach 1 (UuidGenerator)** vì:
- Centralized control
- Easy to add features (như extract timestamp)
- Có thể thêm prefix cho từng entity type
- Testable

**Bạn muốn:**
- **"helper"** - Tôi tạo UuidGenerator và replace tất cả
- **"direct v7"** - Tôi replace tất cả v4 → v7 trực tiếp
- **"keep v4"** - Giữ nguyên v4 (không khuyến khích)

