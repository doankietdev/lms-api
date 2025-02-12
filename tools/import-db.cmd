@echo off

set "DB_NAME=lms"
set "MONGO_URI=mongodb://host.docker.internal:27017/%DB_NAME%"

set "DB_DIR=%cd%\db"

echo Deleting database...

docker run --rm ^
  --add-host host.docker.internal:host-gateway ^
  -it mongo:8.0.0 ^
  bash -c "mongosh \"%MONGO_URI%\" --eval \"db.getSiblingDB('%DB_NAME%').dropDatabase()\""

echo Database deleted successfully.

echo Importing database...

docker run --rm ^
  --add-host host.docker.internal:host-gateway ^
  -v "%DB_DIR%:/mongo-seed" ^
  -it mongo:8.0.0 ^
  bash -c "mongorestore --uri '%MONGO_URI%' /mongo-seed"

if %ERRORLEVEL% equ 0 (
    echo Database imported successfully.
) else (
    echo Database import failed!
)

@pause
