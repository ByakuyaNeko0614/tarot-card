param([switch]$RequireAll, [switch]$ArchiveSources)

# Keep the original generated PNGs intact. Produce smaller, crisp delivery files.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$cardsDirectory = Join-Path $projectRoot '塔羅牌/cards'
$originalsDirectory = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'artifacts/card-art-originals'))
if (!$originalsDirectory.StartsWith($projectRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Original artwork archive must remain inside this project.'
}
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object MimeType -EQ 'image/jpeg'
$sources = @(Get-ChildItem -LiteralPath $cardsDirectory -Filter '*.png' -File)
if (Test-Path -LiteralPath $originalsDirectory) {
    $sources += @(Get-ChildItem -LiteralPath $originalsDirectory -Filter '*.png' -File)
}
if ($RequireAll -and $sources.Count -ne 56) { throw "Expected 56 original PNGs; found $($sources.Count)." }
$sourceBytes = 0L
$deliveryBytes = 0L
foreach ($source in $sources) {
    $destination = Join-Path $cardsDirectory ($source.BaseName + '.jpg')
    if (!(Test-Path -LiteralPath $destination) -or (Get-Item -LiteralPath $destination).LastWriteTimeUtc -lt $source.LastWriteTimeUtc) {
        $image = [System.Drawing.Image]::FromFile($source.FullName)
        $bitmap = $null
        $graphics = $null
        $encoderParameters = $null
        try {
            $width = [Math]::Min(640, $image.Width)
            $height = [int][Math]::Round($width * $image.Height / $image.Width)
            $bitmap = [System.Drawing.Bitmap]::new($width, $height)
            $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
            $graphics.Clear([System.Drawing.Color]::FromArgb(10, 15, 25))
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.DrawImage($image, 0, 0, $width, $height)
            $encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
            $encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]90)
            $bitmap.Save($destination, $jpegCodec, $encoderParameters)
        }
        finally {
            if ($encoderParameters) { $encoderParameters.Dispose() }
            if ($graphics) { $graphics.Dispose() }
            if ($bitmap) { $bitmap.Dispose() }
            $image.Dispose()
        }
    }
    $sourceBytes += $source.Length
    $deliveryBytes += (Get-Item -LiteralPath $destination).Length
    if ($ArchiveSources -and $source.DirectoryName -ne $originalsDirectory) {
        New-Item -ItemType Directory -Path $originalsDirectory -Force | Out-Null
        Move-Item -LiteralPath $source.FullName -Destination (Join-Path $originalsDirectory $source.Name)
    }
}
Write-Output ("Optimized {0} cards: {1:N1} MB -> {2:N1} MB ({3:P0} smaller)." -f $sources.Count, ($sourceBytes / 1MB), ($deliveryBytes / 1MB), (1 - $deliveryBytes / [Math]::Max(1, $sourceBytes)))
