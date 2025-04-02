@echo off
D:\Kent\Projects\Laravel x Vue\rbsi\frontend
start cmd /k "npm run serve"
timeout /t 60 >nul
start chrome http://localhost:8080/
