#!/bin/bash
cd /root/walk-academy-nextjs
npm run build && pm2 restart walk-academy
