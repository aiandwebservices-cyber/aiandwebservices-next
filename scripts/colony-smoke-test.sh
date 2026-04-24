#!/bin/bash
# Colony production smoke test. Run after deploy.
# Usage: ./scripts/colony-smoke-test.sh https://colony.aiandwebservices.com

BASE_URL="${1:-https://colony.aiandwebservices.com}"
PASS=0
FAIL=0

check() {
  local name="$1"
  local url="$2"
  local expected="$3"

  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [[ "$status" == "$expected" ]]; then
    echo "✓ $name ($status)"
    PASS=$((PASS+1))
  else
    echo "✗ $name (expected $expected, got $status)"
    FAIL=$((FAIL+1))
  fi
}

echo "Colony smoke test against $BASE_URL"
echo "---"
check "Homepage redirect to sign-in" "$BASE_URL/colony" "307"
check "Sign-in page" "$BASE_URL/colony/sign-in" "200"
check "Sign-up page" "$BASE_URL/colony/sign-up" "200"
check "API ping (unauth)" "$BASE_URL/api/colony/ping" "401"
check "API feed (unauth)" "$BASE_URL/api/colony/feed" "401"
check "Manifest" "$BASE_URL/colony/manifest.webmanifest" "200"
check "Marketing page" "https://aiandwebservices.com/product/colony" "200"
check "Thank-you page" "https://aiandwebservices.com/product/colony/requested" "200"

echo "---"
echo "Passed: $PASS | Failed: $FAIL"
[[ $FAIL -eq 0 ]]
