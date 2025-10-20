# סקריפט בדיקה לשירותים
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "בדיקת שירותים - QuickNotes" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# בדיקת PostgreSQL
Write-Host "בודק PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService) {
    if ($pgService.Status -eq "Running") {
        Write-Host "✅ PostgreSQL רץ!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL מותקן אבל לא רץ" -ForegroundColor Red
        Write-Host "   נסה להפעיל: Start-Service $($pgService.Name)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ PostgreSQL לא מותקן או לא נמצא" -ForegroundColor Red
}

Write-Host ""

# בדיקת Redis/Memurai
Write-Host "בודק Redis/Memurai..." -ForegroundColor Yellow
$redisService = Get-Service -Name "memurai*","redis*" -ErrorAction SilentlyContinue
if ($redisService) {
    if ($redisService.Status -eq "Running") {
        Write-Host "✅ Redis/Memurai רץ!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Redis/Memurai מותקן אבל לא רץ" -ForegroundColor Red
        Write-Host "   נסה להפעיל: Start-Service $($redisService.Name)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Redis/Memurai לא מותקן או לא נמצא" -ForegroundColor Red
}

Write-Host ""

# בדיקת Node.js
Write-Host "בודק Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js מותקן: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js לא מותקן" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "בדיקה הושלמה!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
