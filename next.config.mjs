/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Padrão do Next é 1MB — insuficiente pra foto/vídeo crus de celular
    // antes da compressão em `lib/media-compress.ts`.
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  /**
   * Sem isso o Turbopack tenta empacotar esses pacotes e quebra a resolução
   * de caminho baseada em `__dirname` que `ffmpeg-static`/`ffprobe-static`
   * usam pra achar o binário — resultava em ENOENT apontando pra um
   * caminho inventado (`\ROOT\...`) em vez do real.
   */
  serverExternalPackages: [
    'sharp',
    'ffmpeg-static',
    'ffprobe-static',
    '@napi-rs/canvas',
    'pdfjs-dist',
  ],
  // `poweredByHeader` removido: não há motivo pra anunciar a stack no header
  // de toda resposta.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default nextConfig
