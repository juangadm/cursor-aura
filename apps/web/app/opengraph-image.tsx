import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'Aura - Themed cursor shadows for the web'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public', 'logo-pixel.png'))
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          color: '#fafafa',
        }}
      >
        <img
          src={logoBase64}
          width={120}
          height={120}
          style={{ borderRadius: 16, marginBottom: 32 }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 400,
            letterSpacing: -2,
            fontFamily: 'monospace',
          }}
        >
          AURA
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#737373',
            marginTop: 16,
            fontFamily: 'sans-serif',
          }}
        >
          Themed cursor shadows for the web
        </div>
      </div>
    ),
    { ...size }
  )
}
