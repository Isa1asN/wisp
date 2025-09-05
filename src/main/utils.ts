export function isDev(): boolean {
  return process.env.NODE_ENV === 'development' || process.argv.includes('--dev')
}

export function getAssetPath(asset: string): string {
  if (isDev()) {
    return asset
  }
  return asset.replace(/^\//, '')
}
