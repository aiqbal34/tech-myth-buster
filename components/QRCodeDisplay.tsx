'use client'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
}

export function QRCodeDisplay({ url }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-2 bg-white rounded-lg">
        <QRCodeSVG value={url} size={100} />
      </div>
      <p className="text-xs text-zinc-400 font-mono">{url}</p>
    </div>
  )
}
