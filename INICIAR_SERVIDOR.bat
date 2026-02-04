@echo off
title Servidor Local - Planificación 2º CFGS
echo Iniciando servidor en http://localhost:8000 ...
echo Mantén esta ventana abierta mientras uses la aplicación.
echo.
start http://localhost:8000/Planificacion-Docente.html
python -m http.server 8000
pause
