# TypeScript Conversion Script for React Native Screens
# This script renames .js files to .tsx in the screens directory

$screensPath = "c:\Users\e_mci\Documents\csc\unCaged-client\app\screens"
$stacksPath = "c:\Users\e_mci\Documents\csc\unCaged-client\app\stacks"

# Get all .js files in screens directory
$screenFiles = Get-ChildItem -Path $screensPath -Filter "*.js"

Write-Host "Found $($screenFiles.Count) screen files to process"

foreach ($file in $screenFiles) {
    $oldPath = $file.FullName
    $newPath = $oldPath -replace '\.js$', '.tsx'
    
    # Check if .tsx version already exists
    if (Test-Path $newPath) {
        Write-Host "Skipping $($file.Name) - .tsx version already exists" -ForegroundColor Yellow
    } else {
        # Read the file content
        $content = Get-Content $oldPath -Raw
        
        # Add React.FC type annotation if function component is found
        $content = $content -replace 'function\s+(\w+)\s*\(props\)', 'const $1: React.FC<any> = (props) =>'
        $content = $content -replace 'function\s+(\w+)\s*\(\s*\)', 'const $1: React.FC = () =>'
        
        # Write to .tsx file
        Set-Content -Path $newPath -Value $content
        
        Write-Host "Converted: $($file.Name) -> $($file.BaseName).tsx" -ForegroundColor Green
    }
}

# Handle stacks
$stackFiles = Get-ChildItem -Path $stacksPath -Filter "*.js"

foreach ($file in $stackFiles) {
    $oldPath = $file.FullName
    $newPath = $oldPath -replace '\.js$', '.tsx'
    
    if (Test-Path $newPath) {
        Write-Host "Skipping $($file.Name) - .tsx version already exists" -ForegroundColor Yellow
    } else {
        $content = Get-Content $oldPath -Raw
        $content = $content -replace 'function\s+(\w+)\s*\(props\)', 'const $1: React.FC<any> = (props) =>'
        $content = $content -replace 'function\s+(\w+)\s*\(\s*\)', 'const $1: React.FC = () =>'
        Set-Content -Path $newPath -Value $content
        Write-Host "Converted: $($file.Name) -> $($file.BaseName).tsx" -ForegroundColor Green
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Cyan
Write-Host "Note: Manual type refinement may be needed for proper TypeScript typing" -ForegroundColor Yellow
