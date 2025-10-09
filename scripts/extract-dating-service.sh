#!/bin/bash

echo "🚀 Extracting Dating Service from Monolith..."
echo ""

SERVICE_DIR="services/dating-service/src"

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p $SERVICE_DIR/core/domain/dating/{entity,port}
mkdir -p $SERVICE_DIR/core/service/dating/usecase
mkdir -p $SERVICE_DIR/core/common/{entity,usecase,code,exception,type}
mkdir -p $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/{entity/dating,repository,mapper,migration}
mkdir -p $SERVICE_DIR/infrastructure/adapter/grpc
mkdir -p $SERVICE_DIR/application/{controller,di}

echo "✅ Directory structure created"
echo ""

# Copy domain code
echo "📦 Copying domain entities..."
cp -r src/core/domain/dating/* $SERVICE_DIR/core/domain/dating/ 2>/dev/null || echo "⚠️ Domain files not found or already exist"

echo "📦 Copying use cases..."
cp -r src/core/service/dating/* $SERVICE_DIR/core/service/dating/ 2>/dev/null || echo "⚠️ Service files not found"

# Copy common code
echo "📦 Copying common code..."
cp -r src/core/common/* $SERVICE_DIR/core/common/ 2>/dev/null || echo "⚠️ Common files not found"

# Copy infrastructure
echo "📦 Copying TypeORM entities..."
cp -r src/infrastructure/adapter/persistence/typeorm/entity/dating/* \
      $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/entity/dating/ 2>/dev/null || true

echo "📦 Copying repositories..."
for repo in DatingProfile Swipe Match DateProposal BlockedUser UserReport DatingSettings ProfileView Boost Subscription; do
    cp src/infrastructure/adapter/persistence/typeorm/repository/${repo}RepositoryAdapter.ts \
       $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/repository/ 2>/dev/null || true
done

echo "📦 Copying mappers..."
for mapper in DatingProfile Swipe Match DateProposal BlockedUser UserReport DatingSettings ProfileView Boost Subscription; do
    cp src/infrastructure/adapter/persistence/typeorm/mapper/${mapper}Mapper.ts \
       $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/mapper/ 2>/dev/null || true
done

echo "📦 Copying migrations..."
cp src/infrastructure/adapter/persistence/typeorm/migration/*Block*.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/migration/ 2>/dev/null || true
cp src/infrastructure/adapter/persistence/typeorm/migration/*Dating*.ts \
   $SERVICE_DIR/infrastructure/adapter/persistence/typeorm/migration/ 2>/dev/null || true

# Copy application layer
echo "📦 Copying controller..."
cp src/application/api/http-rest/controller/DatingController.ts \
   $SERVICE_DIR/application/controller/ 2>/dev/null || true

echo "📦 Copying module..."
cp src/application/di/DatingModule.ts \
   $SERVICE_DIR/application/di/ 2>/dev/null || true

echo ""
echo "✅ Dating Service extraction complete!"
echo ""
echo "📊 Summary:"
find $SERVICE_DIR -type f -name "*.ts" | wc -l | xargs echo "   TypeScript files:"
echo ""
echo "📝 Next steps:"
echo "1. cd services/dating-service"
echo "2. npm install"
echo "3. Update imports (@core/* → @shared/* or local paths)"
echo "4. npm run build"
echo "5. npm run start:dev"
echo ""
echo "💘 Dating Service ready to go!"

