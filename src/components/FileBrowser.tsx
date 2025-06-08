import React, { useEffect, useMemo, useState } from 'react'
import { useArtifact } from '@artifact/client/hooks'
import {
  File as FileIcon,
  Folder as FolderIcon,
  ChevronRight
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface EntryMeta {
  path: string
  type: 'blob' | 'tree'
}

function join(...parts: string[]): string {
  return parts.filter(Boolean).join('/').replace(/\/+/g, '/')
}

const imageExt = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

const FileBrowser: React.FC = () => {
  const artifact = useArtifact()
  const [cwd, setCwd] = useState('')
  const [entries, setEntries] = useState<EntryMeta[]>([])
  const [selected, setSelected] = useState<string>()
  const [fileText, setFileText] = useState<string>()
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    if (!artifact) return
    artifact.files.read.ls(cwd || undefined).then((list) => {
      setEntries(list.map((m) => ({ path: m.path, type: m.type })))
    })
  }, [artifact, cwd])

  const openEntry = async (entry: EntryMeta) => {
    if (!artifact) return
    const full = join(cwd, entry.path)
    if (entry.type === 'tree') {
      setCwd(full)
      setSelected(undefined)
      setFileText(undefined)
      setImageUrl(undefined)
      return
    }
    setSelected(full)
    const ext = entry.path.split('.').pop()?.toLowerCase()
    if (ext && imageExt.includes(ext)) {
      const bin = await artifact.files.read.binary(full)
      const obj = URL.createObjectURL(new Blob([bin]))
      setImageUrl(obj)
      setFileText(undefined)
      return
    }
    const text = await artifact.files.read.text(full)
    setFileText(text)
    setImageUrl(undefined)
  }

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const breadcrumbs = useMemo(() => {
    const segments = cwd ? cwd.split('/') : []
    const crumbs = [{ name: '/', path: '' }]
    let cur = ''
    segments.forEach((seg) => {
      if (!seg) return
      cur = join(cur, seg)
      crumbs.push({ name: seg, path: cur })
    })
    return crumbs
  }, [cwd])

  const previewUrl = imageUrl

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Files</h2>
      <nav className="flex items-center text-sm mb-4 flex-wrap">
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={b.path || '/'}>
            {i > 0 && <ChevronRight size={14} className="mx-1 text-gray-400" />}
            <button
              onClick={() => setCwd(b.path)}
              className="text-blue-600 hover:underline"
            >
              {b.name === '/' ? '/' : b.name}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ul className="space-y-1">
          {entries.map((e) => (
            <li key={e.path}>
              <button
                className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50 w-full text-left"
                onClick={() => openEntry(e)}
              >
                {e.type === 'tree' ? (
                  <FolderIcon size={16} />
                ) : (
                  <FileIcon size={16} />
                )}
                <span>{e.path}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border border-gray-200 rounded p-3 overflow-auto max-h-96">
          {previewUrl && (
            <img src={previewUrl} alt={selected} className="max-w-full" />
          )}
          {fileText &&
            (/\.md$|\.markdown$/i.test(selected ?? '') ? (
              <ReactMarkdown>{fileText}</ReactMarkdown>
            ) : (
              <pre className="whitespace-pre-wrap text-sm">
                <code>{fileText}</code>
              </pre>
            ))}
        </div>
      </div>
    </div>
  )
}

export default FileBrowser
