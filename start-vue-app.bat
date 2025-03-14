@echo off
cd D:\Kent\Projects\Laravel x Vue\rbsi\frontend
start cmd /k "npm run serve"
timeout /t 60 >nul
start chrome http://192.168.1.29:8080/
