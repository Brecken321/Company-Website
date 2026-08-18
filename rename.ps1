# =============================================================================
#  Rename the studio.
#
#  The site currently uses the placeholder name "Northwind Studio". This script
#  swaps it for your real one across every page, including the little square
#  logo mark (which shows the first letter of the name).
#
#  How to run it:
#     Right-click this file  ->  "Run with PowerShell"
#  ...or from a PowerShell window in this folder:
#     .\rename.ps1 -NewName "Two Pines Web"
#
#  Nothing is touched until you confirm.
# =============================================================================
param(
  [string]$NewName,
  [string]$Mark
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$oldName = 'Northwind Studio'

if (-not $NewName) {
  Write-Host ""
  Write-Host "  Current studio name: $oldName" -ForegroundColor Yellow
  Write-Host ""
  $NewName = Read-Host "  New studio name"
}

$NewName = $NewName.Trim()
if (-not $NewName) { Write-Host "  No name given - nothing changed." -ForegroundColor Red; exit 1 }

# The logo square shows a single character. Default to the new name's initial.
if (-not $Mark) { $Mark = $NewName.Substring(0,1).ToUpper() }

$files = Get-ChildItem $root -Filter *.html -File
$hits  = 0
foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText($f.FullName)
  $hits += ([regex]::Matches($text, [regex]::Escape($oldName))).Count
}

Write-Host ""
Write-Host "  About to change:" -ForegroundColor Cyan
Write-Host "    Name:      $oldName  ->  $NewName"
Write-Host "    Logo mark: N  ->  $Mark"
Write-Host "    Files:     $($files.Count) HTML pages, $hits mentions"
Write-Host ""
$go = Read-Host "  Go ahead? (y/n)"
if ($go -notmatch '^[Yy]') { Write-Host "  Cancelled - nothing changed." -ForegroundColor Yellow; exit 0 }

foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText($f.FullName)

  $text = $text.Replace($oldName, $NewName)

  # The logo square: <span class="brand-mark" aria-hidden="true">N</span>
  $text = [regex]::Replace($text,
    '(<span class="brand-mark" aria-hidden="true">).(</span>)',
    "`${1}$Mark`${2}")

  # The favicon is an inline SVG with the same letter in it.
  $text = [regex]::Replace($text,
    "(text-anchor='middle' fill='%2317130c'%3E).(%3C/text%3E)",
    "`${1}$Mark`${2}")

  # Write back as UTF-8 without a BOM so the accented characters survive.
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($f.FullName, $text, $enc)
  Write-Host "    updated  $($f.Name)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "  Done. Open 'Preview site.cmd' to see it." -ForegroundColor Green
Write-Host "  (This script still looks for '$oldName', so edit \$oldName above if you rename again.)" -ForegroundColor DarkGray
Write-Host ""
Read-Host "  Press Enter to close"
