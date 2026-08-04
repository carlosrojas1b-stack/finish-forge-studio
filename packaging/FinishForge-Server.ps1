$ErrorActionPreference = "Stop"
$appRoot = Join-Path $PSScriptRoot "app"
$port = 8765
$address = [System.Net.IPAddress]::Loopback
$listener = [System.Net.Sockets.TcpListener]::new($address, $port)

function Get-ContentType([string]$path) {
    switch ([System.IO.Path]::GetExtension($path).ToLowerInvariant()) {
        ".html" { "text/html; charset=utf-8" }
        ".js"   { "text/javascript; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".wasm" { "application/wasm" }
        ".json" { "application/json; charset=utf-8" }
        ".png"  { "image/png" }
        ".svg"  { "image/svg+xml" }
        default { "application/octet-stream" }
    }
}

try {
    if (-not (Test-Path -LiteralPath (Join-Path $appRoot "index.html"))) {
        throw "The app folder is incomplete. Re-extract the Finish Forge Studio package and try again."
    }
    $listener.Start()
    $url = "http://127.0.0.1:$port/"
    Write-Host ""
    Write-Host "Finish Forge Studio is running at $url" -ForegroundColor Green
    Write-Host "Keep this window open while using the application." -ForegroundColor Gray
    Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
    Start-Process $url

    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }
            while (-not [string]::IsNullOrEmpty($reader.ReadLine())) {}

            $parts = $requestLine.Split(" ")
            $requestPath = if ($parts.Length -gt 1) { [Uri]::UnescapeDataString($parts[1].Split("?")[0]) } else { "/" }
            if ($requestPath -eq "/") { $requestPath = "/index.html" }
            $relativePath = $requestPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
            $candidate = [System.IO.Path]::GetFullPath((Join-Path $appRoot $relativePath))
            $safeRoot = [System.IO.Path]::GetFullPath($appRoot) + [System.IO.Path]::DirectorySeparatorChar

            if (-not $candidate.StartsWith($safeRoot, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
                $status = "404 Not Found"
                $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
                $contentType = "text/plain; charset=utf-8"
            } else {
                $status = "200 OK"
                $body = [System.IO.File]::ReadAllBytes($candidate)
                $contentType = Get-ContentType $candidate
            }

            $headers = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($body, 0, $body.Length)
            $stream.Flush()
        } finally {
            $client.Dispose()
        }
    }
} catch {
    Write-Error $_
    exit 1
} finally {
    $listener.Stop()
}
