#!/usr/bin/env ts-node
/**
 * Script để migrate tất cả UUID v4 sang v7
 * 
 * Usage: ts-node scripts/migrate-to-uuid-v7.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const filesToUpdate = [
  'src/application/api/http-rest/controller/PropertyCalendarController.ts',
  'src/application/api/http-rest/controller/PropertyController.ts',
  'src/application/api/http-rest/controller/BookingController.ts',
  'src/application/api/http-rest/controller/ReviewController.ts',
  'src/application/api/http-rest/controller/PaymentController.ts',
  'src/application/api/http-rest/controller/MessageController.ts',
  'src/application/api/http-rest/controller/WishlistController.ts',
  'src/application/api/http-rest/controller/HostDashboardController.ts',
  'src/infrastructure/adapter/messaging/WebSocketGateway.ts',
];

function updateFile(filePath: string): void {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace import
    content = content.replace(
      /import \{ v4 as uuid \} from ['"]uuid['"]/g,
      "import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator'"
    );
    
    // Replace usage
    content = content.replace(/uuid\(\)/g, 'UuidGenerator.generate()');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🔄 Starting UUID v4 → v7 migration...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of filesToUpdate) {
    const fullPath = path.join(process.cwd(), file);
    
    if (fs.existsSync(fullPath)) {
      updateFile(fullPath);
      successCount++;
    } else {
      console.log(`⚠️  File not found: ${file}`);
      failCount++;
    }
  }
  
  console.log(`\n✨ Migration complete!`);
  console.log(`✅ Success: ${successCount} files`);
  console.log(`❌ Failed: ${failCount} files`);
  console.log(`\n🎉 All UUIDs now use v7 (time-based, sortable)!`);
}

main();

