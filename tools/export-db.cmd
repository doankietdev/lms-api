@echo off

set "DB_NAME=lms"
set "MONGO_URI=mongodb://host.docker.internal:27017/%DB_NAME%"
set "DB_DIR=%cd%\db"

if exist "%DB_DIR%" (
    echo "%DB_DIR%" directory already exists, deleting...
    rd /s /q "%DB_DIR%"
    echo "%DB_DIR%" directory deleted successfully.
)

echo Exporting database...

docker run --rm ^
  -v "%DB_DIR%:/mongo-seed/%DB_NAME%" ^
  --add-host host.docker.internal:host-gateway ^
  -it mongo:8.0.0 ^
  /bin/bash -c "mongodump --uri '%MONGO_URI%' -o /mongo-seed"

if %ERRORLEVEL% equ 0 (
  echo Database exported successfully.
) else (
  echo Database export failed!
)

@pause
