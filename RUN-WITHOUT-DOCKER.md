# 🚀 מדריך הרצת QuickNotes ללא Docker

## דרך 1: שימוש בשירותים אונליין (הכי פשוט!) ⭐

### שלב 1: הגדרת PostgreSQL

בחר **אחת** מהאופציות הבאות:

#### אופציה A: Supabase (מומלץ)
1. גש ל-https://supabase.com
2. לחץ על "Start your project"
3. צור חשבון או התחבר
4. צור פרויקט חדש:
   - Project name: `quicknotes`
   - Database password: שמור אותה!
   - Region: בחר הכי קרוב אלייך
5. המתן שהפרויקט ייווצר (כ-2 דקות)
6. לך ל-Settings → Database
7. העתק את ה-**Connection string** (URI)
   - זה נראה כך: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

#### אופציה B: ElephantSQL
1. גש ל-https://www.elephantsql.com
2. לחץ "Get a managed database today"
3. צור חשבון חינם
4. צור instance חדש (Tiny Turtle - Free)
5. העתק את ה-URL

### שלב 2: הגדרת Redis

בחר **אחת** מהאופציות הבאות:

#### אופציה A: Upstash (מומלץ)
1. גש ל-https://upstash.com
2. צור חשבון חינם
3. לחץ "Create Database"
   - Name: `quicknotes-redis`
   - Type: Regional
   - Region: בחר הכי קרוב
4. העתק את:
   - **UPSTASH_REDIS_REST_URL** (זה ה-host)
   - **UPSTASH_REDIS_REST_TOKEN** (זה ה-password)
   - **Port**: 6379

#### אופציה B: Redis Cloud
1. גש ל-https://redis.com/try-free
2. צור חשבון חינם
3. צור database חדש
4. העתק את ה-endpoint והסיסמה

### שלב 3: עדכן את קובץ .env

פתח את הקובץ `nestjs/.env` וערוך אותו:

```bash
# אם אתה משתמש ב-Supabase/ElephantSQL:
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=postgres

# אם אתה משתמש ב-Upstash:
REDIS_HOST=your-redis-url.upstash.io
REDIS_PORT=6379
# אם יש password, הוסף REDIS_PASSWORD=your_password

# שאר ההגדרות
JWT_SECRET=my-super-secret-key-123
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
```

### שלב 4: הרץ את ה-Backend

פתח טרמינל ב-`QuickNotes` והרץ:

```bash
cd nestjs
npm run start:dev
```

אתה אמור לראות:
```
Application is running on: http://localhost:3000
```

### שלב 5: הרץ את ה-Frontend

פתח **טרמינל נוסף** (חדש!) והרץ:

```bash
cd react
npm run dev
```

אתה אמור לראות:
```
Local: http://localhost:8080
```

### שלב 6: גש לאפליקציה

פתח דפדפן וגש ל-**http://localhost:8080**

---

## דרך 2: התקנה מקומית של PostgreSQL ו-Redis

### Windows:

#### התקנת PostgreSQL:
1. הורד מ-https://www.postgresql.org/download/windows/
2. הפעל את ההתקנה
3. עקוב אחרי השלבים (השאר את כל ברירות המחדל)
4. **חשוב**: זכור את הסיסמה שתגדיר למשתמש `postgres`
5. סיים את ההתקנה

#### התקנת Redis:
Redis לא נתמך רשמית ב-Windows, אבל יש אופציות:

**אופציה 1: Memurai (Redis for Windows)**
1. הורד מ-https://www.memurai.com/get-memurai
2. התקן
3. הוא ירוץ אוטומטית על port 6379

**אופציה 2: WSL (Windows Subsystem for Linux)**
```bash
# בתוך WSL
sudo apt update
sudo apt install redis-server
redis-server
```

### עדכן את .env:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=הסיסמה_שהגדרת
DB_NAME=quicknotes

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=my-super-secret-key-123
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
```

### צור את ה-database:

פתח PowerShell או CMD:
```bash
# התחבר ל-PostgreSQL
psql -U postgres

# בתוך psql:
CREATE DATABASE quicknotes;
\q
```

### הרץ את השרתים:

**Terminal 1 - Backend:**
```bash
cd nestjs
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd react
npm run dev
```

---

## 🧪 בדיקת הפרויקט

1. **פתח דפדפן**: http://localhost:8080
2. **הירשם**: צור משתמש חדש
3. **צור Note**: לחץ על "Create Note"
4. **סנן לפי Tags**: הקלד tags בשורת החיפוש

## 🔍 בדיקת הבריאות

- Backend Health: http://localhost:3000/health
- Metrics: http://localhost:3000/metrics

## ❌ פתרון בעיות

### שגיאה: "Database connection failed"
- בדוק שה-DB_HOST, DB_PASSWORD נכונים ב-`.env`
- בדוק ש-PostgreSQL רץ (אם מקומי)
- נסה ping לשרת (אם אונליין)

### שגיאה: "Redis connection failed"
- בדוק שה-REDIS_HOST נכון
- בדוק ש-Redis רץ (אם מקומי)
- אם אתה משתמש ב-Upstash, בדוק שיש לך את ה-password

### שגיאה: "Port 3000 is already in use"
```bash
# Windows - מצא מה תופס את הפורט
netstat -ano | findstr :3000
# הרוג את התהליך
taskkill /PID <PID> /F
```

### Backend לא מתחיל
```bash
# וודא שכל ה-dependencies מותקנים
cd nestjs
npm install
npm run start:dev
```

### Frontend לא מתחיל
```bash
cd react
npm install
npm run dev
```

---

## 📝 טיפים

1. **שמור את הטרמינלים פתוחים** - אתה צריך 2 טרמינלים רצים במקביל
2. **אם משנה קוד** - השרתים יתרעננו אוטומטית (hot reload)
3. **לעצור** - לחץ Ctrl+C בכל טרמינל
4. **לראות לוגים** - הם יופיעו בטרמינלים

---

## ✅ מה הלאה?

ברגע ש-Docker Hub יחזור לפעולה, תוכל להריץ הכל ב-Docker:
```bash
docker-compose up -d
```

זה יריץ את הכל אוטומטית עם 2 instances של API ו-load balancer!
