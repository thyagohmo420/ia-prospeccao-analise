@echo off
title Execução de Prospecção com IA
color 0A

echo ===============================
echo    INICIANDO O PROCESSO IA
echo ===============================
echo.

echo [1/5] Importando planilha de leads...
node importarPlanilha.js

echo [2/5] Analisando os sites com IA...
npm run start

echo [3/5] Gerando diagnóstico com IA...
npm run diagnostico

echo [4/5] Gerando mensagens personalizadas...
npm run mensagens

echo [5/5] Enviando mensagens no WhatsApp...
node enviarWhatsapp.js

echo.
echo ===============================
echo    PROCESSO FINALIZADO COM SUCESSO!
echo ===============================
pause