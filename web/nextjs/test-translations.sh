#!/bin/bash

# Quick translation testing script

echo "🌐 Testing Translation System"
echo "=============================="
echo ""

BASE_URL="http://localhost:3000"

echo "1. Testing root redirect..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/"
echo ""

echo "2. Testing English home page..."
curl -s "$BASE_URL/en" | grep -q "Legacy Modernization" && echo "✅ English page loads" || echo "❌ English page failed"
echo ""

echo "3. Testing Portuguese home page..."
curl -s "$BASE_URL/pt" | grep -q "Modernização" && echo "✅ Portuguese page loads" || echo "❌ Portuguese page failed"
echo ""

echo "4. Testing modernize page (EN)..."
curl -s "$BASE_URL/en/modernize" | grep -q "Legacy Code Modernization" && echo "✅ EN modernize page loads" || echo "❌ EN modernize page failed"
echo ""

echo "5. Testing modernize page (PT)..."
curl -s "$BASE_URL/pt/modernize" | grep -q "Modernização de Código Legado" && echo "✅ PT modernize page loads" || echo "❌ PT modernize page failed"
echo ""

echo "=============================="
echo "✅ Testing complete!"
echo ""
echo "To test manually:"
echo "  - Open: $BASE_URL/en/modernize"
echo "  - Open: $BASE_URL/pt/modernize"
echo "  - Use language switcher in top-right corner"
echo ""

