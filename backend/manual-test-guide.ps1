# Manual Testing Instructions for Manager and Employee Login
# Copy and paste these commands one by one in PowerShell while the server is running

Write-Host "🧪 Manual Manager and Employee Login Testing Guide" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Write-Host "`n📋 Prerequisites:" -ForegroundColor Yellow
Write-Host "1. Make sure backend server is running on port 2025"
Write-Host "2. Run these commands one by one in PowerShell"
Write-Host "3. Copy and paste each command block"

Write-Host "`n👤 STEP 1: Create a Manager" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$managerData = @{
    firstName = "John"
    lastName = "Manager"
    email = "testmanager@company.com"
    phoneNumber = "555-1111" 
    password = "manager123"
} | ConvertTo-Json

Write-Host "Command to run:" -ForegroundColor Yellow
Write-Host 'Invoke-RestMethod -Uri "http://localhost:2025/api/manager/create" -Method POST -ContentType "application/json" -Body $managerData' -ForegroundColor White

Write-Host "`n👤 STEP 2: Login as Manager" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "First, note the username from the previous response, then run:" -ForegroundColor Yellow
Write-Host 'Replace "MAN123" with the actual username from step 1' -ForegroundColor Red

$managerLogin = @{
    username = "MAN123"  # Replace with actual username
    password = "manager123"
} | ConvertTo-Json

Write-Host "Command to run:" -ForegroundColor Yellow
Write-Host 'Invoke-RestMethod -Uri "http://localhost:2025/api/manager/login" -Method POST -ContentType "application/json" -Body $managerLogin' -ForegroundColor White

Write-Host "`n👷 STEP 3: Create an Employee (using Manager token)" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host "First, copy the token from step 2, then run:" -ForegroundColor Yellow
Write-Host 'Replace "YOUR_MANAGER_TOKEN_HERE" with the actual token' -ForegroundColor Red

$employeeData = @{
    firstName = "Alice"
    lastName = "Driver"
    email = "testdriver@company.com"
    phoneNumber = "555-2222"
    password = "driver123"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer YOUR_MANAGER_TOKEN_HERE"
    "Content-Type" = "application/json"
}

Write-Host "Command to run:" -ForegroundColor Yellow
Write-Host 'Invoke-RestMethod -Uri "http://localhost:2025/api/employee/create" -Method POST -Headers $headers -Body $employeeData' -ForegroundColor White

Write-Host "`n👷 STEP 4: Login as Employee" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "Note the username from step 3, then run:" -ForegroundColor Yellow
Write-Host 'Replace "EMP123" with the actual username from step 3' -ForegroundColor Red

$employeeLogin = @{
    username = "EMP123"  # Replace with actual username
    password = "driver123"
} | ConvertTo-Json

Write-Host "Command to run:" -ForegroundColor Yellow
Write-Host 'Invoke-RestMethod -Uri "http://localhost:2025/api/employee/login" -Method POST -ContentType "application/json" -Body $employeeLogin' -ForegroundColor White

Write-Host "`n🔧 STEP 5: Test Wrong Password" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

$wrongLogin = @{
    username = "MAN123"  # Use manager username
    password = "wrongpassword"
} | ConvertTo-Json

Write-Host "Command to run (should fail with 401):" -ForegroundColor Yellow
Write-Host 'Invoke-RestMethod -Uri "http://localhost:2025/api/manager/login" -Method POST -ContentType "application/json" -Body $wrongLogin' -ForegroundColor White

Write-Host "`n✅ Expected Results:" -ForegroundColor Green
Write-Host "- Manager creation: Returns 201 status with user data (no password)"
Write-Host "- Manager login: Returns 200 status with JWT token"
Write-Host "- Employee creation: Returns 201 status with user data (no password)"
Write-Host "- Employee login: Returns 200 status with JWT token"
Write-Host "- Wrong password: Returns 401 status with error message"

Write-Host "`n🔍 API Endpoints Summary:" -ForegroundColor Magenta
Write-Host "Manager Create: POST /api/manager/create"
Write-Host "Manager Login:  POST /api/manager/login"
Write-Host "Employee Create: POST /api/employee/create (requires manager token)"
Write-Host "Employee Login:  POST /api/employee/login"