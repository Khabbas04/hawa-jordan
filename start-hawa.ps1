param([int]$Port = 8765)

$secureKey = Read-Host "Paste a NEW Gemini API key (it will not be saved)" -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $env:GEMINI_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  $env:HAWA_PORT = $Port.ToString()
  node (Join-Path $PSScriptRoot "server.js")
}
finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  Remove-Item Env:GEMINI_API_KEY -ErrorAction SilentlyContinue
  Remove-Item Env:HAWA_PORT -ErrorAction SilentlyContinue
}
