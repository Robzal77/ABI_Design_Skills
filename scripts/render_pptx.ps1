param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,
    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$source = (Resolve-Path -LiteralPath $InputPath).Path
if ([System.IO.Path]::GetExtension($source).ToLowerInvariant() -ne '.pptx') {
    throw 'InputPath must be a PowerPoint .pptx file'
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$destination = (Resolve-Path -LiteralPath $OutputDirectory).Path
$name = [System.IO.Path]::GetFileNameWithoutExtension($source)
$pdf = Join-Path $destination ($name + '.pdf')
$reportPath = Join-Path $destination ($name + '.render-check.json')
$issues = [System.Collections.Generic.List[object]]::new()
$app = $null
$deck = $null

try {
    Write-Host 'Connecting to Microsoft PowerPoint...'
    $app = New-Object -ComObject PowerPoint.Application
    Write-Host ('Opening presentation: ' + [System.IO.Path]::GetFileName($source))
    $deck = $app.Presentations.Open($source, -1, 0, -1)
    Write-Host ('Checking text layout on ' + $deck.Slides.Count + ' slides...')
    foreach ($slide in $deck.Slides) {
        foreach ($shape in $slide.Shapes) {
            if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
                $range = $shape.TextFrame.TextRange
                $height = $shape.Height - $shape.TextFrame.MarginTop - $shape.TextFrame.MarginBottom
                $width = $shape.Width - $shape.TextFrame.MarginLeft - $shape.TextFrame.MarginRight
                if ($range.BoundHeight -gt ($height + 2) -or $range.BoundWidth -gt ($width + 2)) {
                    $issues.Add([pscustomobject]@{
                        slide = $slide.SlideIndex
                        shape = $shape.Name
                        text = $range.Text
                        textHeight = [math]::Round($range.BoundHeight, 2)
                        availableHeight = [math]::Round($height, 2)
                        textWidth = [math]::Round($range.BoundWidth, 2)
                        availableWidth = [math]::Round($width, 2)
                    })
                }
            }
        }
    }
    Write-Host 'Exporting native PowerPoint PDF...'
    $deck.SaveAs($pdf, 32)
    $report = [pscustomobject]@{
        renderer = "Microsoft PowerPoint $($app.Version)"
        slideCount = $deck.Slides.Count
        overflowCount = $issues.Count
        overflow = @($issues.ToArray())
        pdf = [System.IO.Path]::GetFileName($pdf)
        visualReviewRequired = $true
    }
    $report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $reportPath -Encoding UTF8
    $report | ConvertTo-Json -Depth 5
    if ($issues.Count -gt 0) {
        throw "Text overflow found. Review $reportPath"
    }
} finally {
    if ($null -ne $deck) {
        $deck.Close()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($deck) | Out-Null
    }
    if ($null -ne $app) {
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null
    }
}
