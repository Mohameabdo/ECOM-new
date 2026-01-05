#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "🧪 ECOM-new Test Suite Runner"
echo "=========================================="
echo ""

# Function to run tests for a component
run_component_tests() {
    local component=$1
    local dir=$2
    
    echo -e "${YELLOW}Testing $component...${NC}"
    cd "$dir"
    
    if npm test; then
        echo -e "${GREEN}✅ $component tests passed!${NC}"
        cd - > /dev/null
        return 0
    else
        echo -e "${RED}❌ $component tests failed!${NC}"
        cd - > /dev/null
        return 1
    fi
}

# Track failures
FAILED=0

# Run Backend Tests
run_component_tests "Backend" "backend" || FAILED=$((FAILED + 1))
echo ""

# Run Admin Tests
run_component_tests "Admin" "admin" || FAILED=$((FAILED + 1))
echo ""

# Run Mobile Tests
run_component_tests "Mobile" "mobile" || FAILED=$((FAILED + 1))
echo ""

# Summary
echo "=========================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  $FAILED component(s) failed tests${NC}"
    exit 1
fi