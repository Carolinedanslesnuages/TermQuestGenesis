#!/bin/bash

# Test script to verify Prisma setup
echo "Testing Prisma setup..."

# Check if Prisma schema is valid
echo "✅ Validating Prisma schema..."
npx prisma validate

# Generate Prisma client
echo "✅ Generating Prisma client..."
npx prisma generate

# Check if build works
echo "✅ Testing build..."
npm run build

# Run tests
echo "✅ Running tests..."
npm test

echo ""
echo "🎉 Prisma setup test completed successfully!"
echo ""
echo "To run migrations in a real database environment:"
echo "1. Set up your database environment variables in .env"
echo "2. Run: npm run migration:run"
echo "3. To reset: npm run migration:reset"
echo "4. To view data: npm run db:studio"