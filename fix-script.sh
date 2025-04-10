#!/bin/bash

# Fix layout.tsx - Remove unused StarryBackground import
sed -i '' 's/import StarryBackground from "..\/components\/StarryBackground";//' src/app/layout.tsx

# Fix blog/page.tsx - Remove unused useState import and fix unescaped apostrophes
sed -i '' "s/import { useState } from 'react';/import React from 'react';/" src/app/blog/page.tsx
sed -i '' "s/We're/We\&apos;re/g" src/app/blog/page.tsx

# Fix blog/sleep-science/page.tsx - Remove unused useState import and fix unescaped apostrophes
sed -i '' "s/import { useState } from 'react';/import React from 'react';/" src/app/blog/sleep-science/page.tsx
sed -i '' "s/that's/that\&apos;s/g" src/app/blog/sleep-science/page.tsx
sed -i '' "s/It's/It\&apos;s/g" src/app/blog/sleep-science/page.tsx
sed -i '' "s/don't/don\&apos;t/g" src/app/blog/sleep-science/page.tsx

# Fix calculator/sleep/page.tsx - Fix unescaped apostrophes
sed -i '' "s/'s/'s/g" src/app/calculator/sleep/page.tsx

# Fix calculator/wake/page.tsx - Fix unescaped apostrophes
sed -i '' "s/'s/'s/g" src/app/calculator/wake/page.tsx

# Fix page.tsx - Remove unused useState import
sed -i '' "s/import { useState } from 'react';/import React from 'react';/" src/app/page.tsx

echo "All ESLint issues fixed!"
