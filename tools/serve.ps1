# Minimal static web server for previewing the studio site.
# Started by "Preview site.cmd" in the folder above. Close the window to stop it.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  [int]$Port = 8770
)
$ErrorActionPreference = 'Stop'

$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
  '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'; '.webp'='image/webp';
  '.woff2'='font/woff2'; '.woff'='font/woff'; '.json'='application/json; charset=utf-8';
  '.mp4'='video/mp4'; '.webm'='video/webm';
  '.xml'='application/xml; charset=utf-8'; '.txt'='text/plain; charset=utf-8'; '.ico'='image/x-icon';
  '.md'='text/markdown; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
  $listener.Start()
} catch {
  Write-Host "Could not start on port $Port. Is something already using it?" -ForegroundColor Red
  Write-Host $_.Exception.Message
  Read-Host "Press Enter to close"
  exit 1
}

Write-Host ""
Write-Host "  Your studio site is running at:  http://localhost:$Port/" -ForegroundColor Green
Write-Host "  Serving: $Root"
Write-Host "  Close this window to stop the server."
Write-Host ""

$rootFull = [System.IO.Path]::GetFullPath($Root)

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response
    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ($rel -eq '') { $rel = 'index.html' }
    $path = Join-Path $Root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path 'index.html' }

    $full = $null
    try { $full = [System.IO.Path]::GetFullPath($path) } catch { }
    if (-not $full -or -not $full.StartsWith($rootFull)) { $res.StatusCode = 403; $res.Close(); continue }

    if (Test-Path $full -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $res.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' })
      $res.StatusCode = 200
    } else {
      $notFound = Join-Path $Root '404.html'
      if (Test-Path $notFound) {
        $bytes = [System.IO.File]::ReadAllBytes($notFound)
        $res.ContentType = 'text/html; charset=utf-8'
      } else {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('Not found')
        $res.ContentType = 'text/plain; charset=utf-8'
      }
      $res.StatusCode = 404
    }
    $res.Headers.Add('Cache-Control', 'no-store')
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.OutputStream.Close()
  } catch {
    try { $ctx.Response.StatusCode = 500; $ctx.Response.Close() } catch { }
  }
}
