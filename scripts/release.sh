#!/bin/bash

# 取得當前腳本所在的目錄
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
PROJECT_NAME="BeybladeXSPViewer"

# 創建 release 資料夾
mkdir -p "$PROJECT_ROOT/release"

# 生成 Android APK
echo "Building Android APK..."
cd "$PROJECT_ROOT/android"
./gradlew assembleRelease
mv ./app/build/outputs/apk/release/app-release.apk "$PROJECT_ROOT/release/$PROJECT_NAME.apk"


# 生成 iOS IPA
echo "Building iOS IPA..."
cd "$PROJECT_ROOT/ios"
rm -rf $PROJECT_NAME.xcarchive
xcodebuild -workspace $PROJECT_NAME.xcworkspace \
  -scheme $PROJECT_NAME clean archive \
  -destination 'generic/platform=iOS' \
  -configuration Release \
  -archivePath $PROJECT_NAME.xcarchive
source_dir="$PROJECT_NAME.xcarchive/Products/Applications"
new_folder="Payload"
rm -rf $new_folder
mkdir $new_folder
cp -a $source_dir/* $new_folder
file_name=$(find $new_folder -type d -name '*.app' -exec basename {} \; | head -n 1)
zip -rmq "${file_name%.*}.ipa" $new_folder
mv "${file_name%.*}.ipa" "$PROJECT_ROOT/release/"
rm -rf $PROJECT_NAME.xcarchive

# 回到專案根目錄
cd "$PROJECT_ROOT"

echo "Build completed! Check the release folder for output files."