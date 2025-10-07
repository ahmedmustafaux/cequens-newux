#!/bin/bash

# Find all .tsx files in the src directory
find src -name "*.tsx" -type f | while read -r file; do
  # Check if the file starts with "use client"
  if grep -q "^\"use client\"" "$file"; then
    # Remove the "use client" line and any following empty line
    sed -i '' '1s/^"use client"$//' "$file"
    sed -i '' '/^$/d' "$file"
    echo "Removed 'use client' from $file"
  fi
done

echo "Completed removing 'use client' directives from all files."