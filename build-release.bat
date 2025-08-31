@echo off
echo Building release for Roll Initiative 5e...

REM Create a temporary directory for the build
if exist temp-build rmdir /s /q temp-build
mkdir temp-build

REM Copy module files to temp directory
xcopy /s /e /i roll-initiative-5e temp-build\roll-initiative-5e

REM Create the module.zip
cd temp-build
tar -a -c -f ..\module.zip roll-initiative-5e
cd ..

REM Copy module.json for separate upload
copy roll-initiative-5e\module.json module.json

REM Clean up
rmdir /s /q temp-build

echo.
echo Build complete!
echo.
echo Release assets created:
echo   - module.json (upload this to the release)
echo   - module.zip (upload this to the release)
echo.
echo Make sure to upload BOTH files to your GitHub release!