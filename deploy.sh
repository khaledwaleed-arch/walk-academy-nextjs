#!/bin/bash
set -e
cd /root/walk-academy-nextjs
echo "Building..."
npm run build
echo "Restarting walk-academy service..."
systemctl restart walk-academy
sleep 3
systemctl status walk-academy --no-pager
echo "Deploy complete."
