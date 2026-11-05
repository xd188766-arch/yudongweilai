param(
    [Parameter(Mandatory = $true)][string]$Domain,
    [string]$LastMod = (Get-Date -Format "yyyy-MM-dd")
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# 规范化：允许输入 www.example.com 或 user.github.io/repo
$Domain = $Domain.Trim().TrimEnd("/")
if ($Domain -notmatch "^https?://") { $Domain = "https://$Domain" }
$Domain = $Domain -replace "https?://", "https://"

# 站点根路径：GitHub Pages 项目站是 /仓库名/，独立域名是 /
$uri = [System.Uri]$Domain
$basePath = $uri.AbsolutePath
if (-not $basePath.EndsWith("/")) { $basePath = $basePath + "/" }
$baseTag = '<base href="' + $basePath + '">'

Write-Host "站点地址：$Domain" -ForegroundColor Cyan
Write-Host "根路径：  $basePath" -ForegroundColor DarkGray
Write-Host ""

$exts = @("*.html", "*.xml", "*.txt")
$files = Get-ChildItem -Path $root -Recurse -File -Include $exts |
    Where-Object { $_.Name -notlike "_*" -and $_.FullName -notmatch "\\(资源|assets)\\" }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$count = 0

foreach ($f in $files) {
    $text = [System.IO.File]::ReadAllText($f.FullName)
    $orig = $text

    $text = $text.Replace("https://your-domain.com", $Domain)

    # 404 页需要 <base> 才能在任意深度的错误地址上正常加载样式
    if ($f.Name -eq "404.html") {
        $text = [regex]::Replace($text, "(?s)<!--\s*BASE_HREF.*?-->", $baseTag)
        $text = [regex]::Replace($text, '<base href="[^"]*">', $baseTag)
    }

    # 刷新 sitemap 的 lastmod
    if ($f.Name -eq "sitemap.xml" -and $text -match "<lastmod>") {
        $text = [regex]::Replace($text, "<lastmod>[^<]*</lastmod>", "<lastmod>$LastMod</lastmod>")
    }

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($f.FullName, $text, $utf8NoBom)
        Write-Host "  已更新 $($f.Name)" -ForegroundColor Green
        $count++
    }
}

Write-Host ""
if ($count -eq 0) {
    Write-Host "没有需要替换的内容，可能已经处理过。" -ForegroundColor Yellow
} else {
    Write-Host "完成：更新了 $count 个文件。" -ForegroundColor Green
}

Write-Host ""
Write-Host "上线后请检查：" -ForegroundColor Cyan
Write-Host "  1) 首页能打开：$Domain/"
Write-Host "  2) 随便输个不存在的地址，404 页有样式"
Write-Host "  3) 把 sitemap 提交到百度 / 必应 / Google"
Write-Host ""
