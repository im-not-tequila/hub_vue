type DownloadResponse = {
  data: unknown
  headers?: Record<string, unknown>
}

function resolveFilename(contentDisposition: string, fallbackFilename: string): string {
  const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-8'')?([^;"']+)/i)
  if (!filenameMatch?.[1]) {
    return fallbackFilename
  }
  try {
    return decodeURIComponent(filenameMatch[1])
  } catch {
    return filenameMatch[1]
  }
}

function saveBlob(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href)
  document.body.removeChild(link)
}

export function downloadExcelResponse(
  response: DownloadResponse,
  fallbackFilename: string,
  mimeType = 'application/vnd.ms-excel'
) {
  const contentDisposition = String(response.headers?.['content-disposition'] ?? '')
  const filename = resolveFilename(contentDisposition, fallbackFilename)
  const blob = response.data instanceof Blob
    ? response.data
    : new Blob([response.data], { type: mimeType })
  saveBlob(blob, filename)
}

