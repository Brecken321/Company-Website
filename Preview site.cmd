@echo off
title Studio site - local preview
start "" http://localhost:8770/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\serve.ps1"
