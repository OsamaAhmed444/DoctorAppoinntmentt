#!/usr/bin/env bash
# =============================================================
#  script.sh - يشغل مشروع doctorAppointmentMERN_Stack بالكامل
#  Backend (Express) بيسرف الـ API وكمان بيسرف الـ Frontend
#  المبني (build) على نفس البورت، فالموقع كله هيبقى شغال على:
#
#         http://localhost:3000
#
#  الاستخدام:
#     chmod +x script.sh
#     ./script.sh
# =============================================================

set -e

# مسار الفولدر اللي فيه السكريبت (يشتغل من أي مكان تحطه فيه)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

PORT=3000

echo "🩺 Doctor Appointment MERN - Setup & Run"
echo "-----------------------------------------"

# 1) تأكد إن node و npm موجودين
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js مش متثبت. ثبته الأول من https://nodejs.org"
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm مش موجود."
  exit 1
fi

echo "✅ Node: $(node -v) | npm: $(npm -v)"

# 2) ملف الـ .env بتاع الباك-إند (لو مش موجود بيتعمل واحد افتراضي)
if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo "⚙️  بعمل backend/.env افتراضي (عدّل فيه MONGO_URI لو عندك داتا بيز تانية)..."
  cat > "$BACKEND_DIR/.env" <<EOF
PORT=$PORT
MONGO_URI=mongodb://127.0.0.1:27017/doctorAppointment
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
CLIENT_URL=http://localhost:$PORT
EOF
else
  echo "ℹ️  backend/.env موجود بالفعل، مش هيتلمس."
fi

# 3) ملف الـ .env بتاع الفرونت-إند (VITE_API_URL لازم يبقى موجود عشان الـ build يشتغل صح)
if [ ! -f "$FRONTEND_DIR/.env" ]; then
  echo "⚙️  بعمل frontend/.env افتراضي..."
  cat > "$FRONTEND_DIR/.env" <<EOF
VITE_API_URL=http://localhost:$PORT
EOF
else
  echo "ℹ️  frontend/.env موجود بالفعل، مش هيتلمس."
fi

# 4) تثبيت باكدجات الباك-إند
echo ""
echo "📦 بتثبيت باكدجات الـ backend..."
(cd "$BACKEND_DIR" && npm install)

# 5) تثبيت باكدجات الفرونت-إند وعمل build
echo ""
echo "📦 بتثبيت باكدجات الـ frontend..."
(cd "$FRONTEND_DIR" && npm install)

echo ""
echo "🏗️  بعمل build للفرونت-إند (بيتحط في frontend/dist)..."
(cd "$FRONTEND_DIR" && npm run build)

# 6) تشغيل الباك-إند - هو اللي هيسرف الـ API + الفرونت-إند المبني
echo ""
echo "🚀 بشغل السيرفر... افتح المتصفح على:"
echo ""
echo "        http://localhost:$PORT"
echo ""
echo "   (Ctrl+C عشان توقف السيرفر)"
echo "-----------------------------------------"

cd "$BACKEND_DIR"
PORT=$PORT node server.js
