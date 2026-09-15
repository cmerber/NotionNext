import { loadExternalResource } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'

const TABS = [
  ['image', '🖼️', '图片格式'],
  ['imagePdf', '📚', '图片转 PDF'],
  ['pdf', '📄', 'PDF 转换'],
  ['word', '📝', 'Word 转换'],
  ['counter', '🔢', '文字统计']
]

const CDN = {
  pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  pdfWorker:
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  mammoth: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
  jszip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
}

const panelClass =
  'rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900 md:p-5'
const inputClass =
  'min-h-[44px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-900'

function Button({ children, onClick, primary = false, disabled = false }) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? 'bg-[var(--heo-color-primary)] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function FilePicker({ accept, multiple = false, onChange, label }) {
  return (
    <label className='flex min-h-[9rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 px-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/20'>
      <span className='text-3xl'>＋</span>
      <span className='mt-2 text-sm font-black text-indigo-700 dark:text-indigo-200'>
        {label}
      </span>
      <span className='mt-1 text-xs text-gray-400'>
        文件仅在当前浏览器中读取
      </span>
      <input
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={event => onChange(Array.from(event.target.files || []))}
        className='sr-only'
      />
    </label>
  )
}

function Notice({ message, error = false }) {
  if (!message) return null
  return (
    <div
      className={`mt-4 rounded-xl px-4 py-3 text-sm leading-6 ${
        error
          ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300'
          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200'
      }`}
    >
      {message}
    </div>
  )
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function safeBaseName(filename) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[\\/:*?"<>|]/g, '-')
    .trim()
}

function sanitizeDocumentHtml(value) {
  const parsed = new DOMParser().parseFromString(value, 'text/html')
  parsed
    .querySelectorAll('script, iframe, object, embed, form, input, button')
    .forEach(element => element.remove())
  parsed.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase()
      const content = attribute.value.trim().toLowerCase()
      if (
        name.startsWith('on') ||
        ((name === 'href' || name === 'src') &&
          content.startsWith('javascript:'))
      ) {
        element.removeAttribute(attribute.name)
      }
    })
  })
  return parsed.body.innerHTML
}

function assertFileSize(files, maxMb = 30) {
  const oversized = files.find(file => file.size > maxMb * 1024 * 1024)
  if (oversized) throw new Error(`${oversized.name} 超过 ${maxMb}MB 限制。`)
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('无法读取图片。'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('图片转换失败。'))),
      type,
      quality
    )
  })
}

function ImageFormatTool() {
  const [file, setFile] = useState(null)
  const [target, setTarget] = useState('image/jpeg')
  const [quality, setQuality] = useState(0.9)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const convert = async () => {
    if (!file) return
    setBusy(true)
    setMessage('')
    try {
      assertFileSize([file])
      const image = await loadImage(file)
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d')
      if (target === 'image/jpeg') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      context.drawImage(image, 0, 0)
      const blob = await canvasToBlob(canvas, target, quality)
      const extension = target.split('/')[1].replace('jpeg', 'jpg')
      downloadBlob(blob, `${safeBaseName(file.name)}.${extension}`)
      setMessage(
        `转换完成：${image.naturalWidth} × ${image.naturalHeight}，${(
          blob.size / 1024
        ).toFixed(1)}KB。`
      )
      setIsError(false)
    } catch (error) {
      setMessage(error.message || '图片转换失败。')
      setIsError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='grid gap-5 lg:grid-cols-[.9fr_1.1fr]'>
      <FilePicker
        accept='image/png,image/jpeg,image/webp'
        label='选择 PNG、JPG 或 WebP 图片'
        onChange={files => setFile(files[0] || null)}
      />
      <div className={panelClass}>
        <div className='text-sm font-black'>输出设置</div>
        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          <label className='text-xs text-gray-500'>
            输出格式
            <select
              value={target}
              onChange={event => setTarget(event.target.value)}
              className={`${inputClass} mt-2 w-full`}
            >
              <option value='image/jpeg'>JPG</option>
              <option value='image/png'>PNG</option>
              <option value='image/webp'>WebP</option>
            </select>
          </label>
          <label className='text-xs text-gray-500'>
            图片质量：{Math.round(quality * 100)}%
            <input
              type='range'
              min='0.4'
              max='1'
              step='0.05'
              value={quality}
              onChange={event => setQuality(Number(event.target.value))}
              disabled={target === 'image/png'}
              className='mt-4 w-full accent-indigo-600 disabled:opacity-40'
            />
          </label>
        </div>
        <div className='mt-4 rounded-xl bg-white px-4 py-3 text-sm dark:bg-gray-800'>
          {file ? (
            <>
              <b className='break-all'>{file.name}</b>
              <span className='ml-2 text-gray-400'>
                {(file.size / 1024 / 1024).toFixed(2)}MB
              </span>
            </>
          ) : (
            <span className='text-gray-400'>尚未选择图片</span>
          )}
        </div>
        <div className='mt-4'>
          <Button primary disabled={!file || busy} onClick={convert}>
            {busy ? '正在转换…' : '转换并下载'}
          </Button>
        </div>
        <Notice message={message} error={isError} />
      </div>
    </div>
  )
}

function ImagesToPdfTool() {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const convert = async () => {
    if (!files.length) return
    setBusy(true)
    setMessage('正在加载 PDF 组件…')
    try {
      assertFileSize(files)
      await loadExternalResource(CDN.jspdf, 'js')
      const JsPdf = window.jspdf?.jsPDF
      if (!JsPdf) throw new Error('PDF 组件加载失败，请检查网络。')
      let document
      for (let index = 0; index < files.length; index++) {
        setMessage(`正在处理第 ${index + 1}/${files.length} 张图片…`)
        const image = await loadImage(files[index])
        const landscape = image.naturalWidth > image.naturalHeight
        const orientation = landscape ? 'landscape' : 'portrait'
        const pageWidth = landscape ? 297 : 210
        const pageHeight = landscape ? 210 : 297
        if (!document) {
          document = new JsPdf({ orientation, unit: 'mm', format: 'a4' })
        } else {
          document.addPage('a4', orientation)
        }
        const ratio = Math.min(
          (pageWidth - 16) / image.naturalWidth,
          (pageHeight - 16) / image.naturalHeight
        )
        const width = image.naturalWidth * ratio
        const height = image.naturalHeight * ratio
        const x = (pageWidth - width) / 2
        const y = (pageHeight - height) / 2
        const canvas = window.document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const context = canvas.getContext('2d')
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0)
        document.addImage(
          canvas.toDataURL('image/jpeg', 0.92),
          'JPEG',
          x,
          y,
          width,
          height
        )
      }
      document.save('qcode-图片合并.pdf')
      setMessage(`转换完成，共生成 ${files.length} 页 PDF。`)
      setIsError(false)
    } catch (error) {
      setMessage(error.message || 'PDF 生成失败。')
      setIsError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='grid gap-5 lg:grid-cols-[.9fr_1.1fr]'>
      <FilePicker
        accept='image/png,image/jpeg,image/webp'
        multiple
        label='选择一张或多张图片'
        onChange={setFiles}
      />
      <div className={panelClass}>
        <div className='flex items-center justify-between'>
          <div className='text-sm font-black'>图片顺序</div>
          <span className='text-xs text-gray-400'>{files.length} 张</span>
        </div>
        <div className='mt-3 max-h-56 space-y-2 overflow-auto'>
          {files.length ? (
            files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className='flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm dark:bg-gray-800'
              >
                <span className='font-mono text-xs text-indigo-500'>
                  {index + 1}
                </span>
                <span className='min-w-0 flex-1 truncate'>{file.name}</span>
                <button
                  type='button'
                  onClick={() =>
                    setFiles(list => list.filter((_, i) => i !== index))
                  }
                  className='text-gray-400 hover:text-red-500'
                >
                  移除
                </button>
              </div>
            ))
          ) : (
            <div className='py-8 text-center text-sm text-gray-400'>
              PDF 将按选择顺序分页
            </div>
          )}
        </div>
        <div className='mt-4'>
          <Button primary disabled={!files.length || busy} onClick={convert}>
            {busy ? '正在生成…' : '合并为 PDF'}
          </Button>
        </div>
        <Notice message={message} error={isError} />
      </div>
    </div>
  )
}

async function loadPdfDocument(file) {
  await loadExternalResource(CDN.pdf, 'js')
  if (!window.pdfjsLib) throw new Error('PDF 组件加载失败，请检查网络。')
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = CDN.pdfWorker
  const data = await file.arrayBuffer()
  return window.pdfjsLib.getDocument({ data }).promise
}

async function extractPdfText(document, onProgress) {
  const pages = []
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    onProgress?.(pageNumber, document.numPages)
    const page = await document.getPage(pageNumber)
    const content = await page.getTextContent()
    pages.push(content.items.map(item => item.str).join(' '))
  }
  return pages
}

function PdfTool() {
  const [file, setFile] = useState(null)
  const [target, setTarget] = useState('png')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const convert = async () => {
    if (!file) return
    setBusy(true)
    setMessage('正在读取 PDF…')
    try {
      assertFileSize([file], 40)
      const pdfDocument = await loadPdfDocument(file)
      if (pdfDocument.numPages > 60) {
        throw new Error('当前最多处理 60 页 PDF，请先拆分大文件。')
      }
      const name = safeBaseName(file.name)
      if (target === 'word' || target === 'txt') {
        const pages = await extractPdfText(pdfDocument, (current, total) =>
          setMessage(`正在提取第 ${current}/${total} 页文字…`)
        )
        const plainText = pages
          .map((text, index) => `第 ${index + 1} 页\n${text}`)
          .join('\n\n')
        if (target === 'txt') {
          downloadBlob(
            new Blob([plainText], { type: 'text/plain;charset=utf-8' }),
            `${name}.txt`
          )
        } else {
          const html = `<!doctype html><html><head><meta charset="utf-8"><title>${name}</title></head><body>${pages
            .map(
              (text, index) =>
                `<h2>第 ${index + 1} 页</h2><p>${text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')}</p>`
            )
            .join('<div style="page-break-after:always"></div>')}</body></html>`
          downloadBlob(
            new Blob(['\ufeff', html], { type: 'application/msword' }),
            `${name}-可编辑文字版.doc`
          )
        }
      } else {
        setMessage('正在加载压缩组件…')
        await loadExternalResource(CDN.jszip, 'js')
        if (!window.JSZip) throw new Error('压缩组件加载失败，请检查网络。')
        const zip = new window.JSZip()
        const mime = target === 'jpg' ? 'image/jpeg' : 'image/png'
        for (
          let pageNumber = 1;
          pageNumber <= pdfDocument.numPages;
          pageNumber++
        ) {
          setMessage(`正在转换第 ${pageNumber}/${pdfDocument.numPages} 页…`)
          const page = await pdfDocument.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 2 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const context = canvas.getContext('2d')
          if (target === 'jpg') {
            context.fillStyle = '#ffffff'
            context.fillRect(0, 0, canvas.width, canvas.height)
          }
          await page.render({ canvasContext: context, viewport }).promise
          const blob = await canvasToBlob(canvas, mime, 0.92)
          zip.file(
            `第-${String(pageNumber).padStart(3, '0')}-页.${target}`,
            blob
          )
        }
        setMessage('正在打包转换结果…')
        const result = await zip.generateAsync({ type: 'blob' })
        downloadBlob(result, `${name}-${target.toUpperCase()}图片.zip`)
      }
      setMessage(`转换完成，共处理 ${pdfDocument.numPages} 页。`)
      setIsError(false)
    } catch (error) {
      setMessage(error.message || 'PDF 转换失败。')
      setIsError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='grid gap-5 lg:grid-cols-[.9fr_1.1fr]'>
      <FilePicker
        accept='application/pdf,.pdf'
        label='选择 PDF 文件'
        onChange={files => setFile(files[0] || null)}
      />
      <div className={panelClass}>
        <div className='text-sm font-black'>转换成</div>
        <select
          value={target}
          onChange={event => setTarget(event.target.value)}
          className={`${inputClass} mt-3 w-full`}
        >
          <option value='png'>PNG 图片（每页一张并打包）</option>
          <option value='jpg'>JPG 图片（每页一张并打包）</option>
          <option value='word'>可编辑 Word 文字版（.doc）</option>
          <option value='txt'>纯文字（.txt）</option>
        </select>
        <div className='mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-700 dark:bg-amber-950/30 dark:text-amber-200'>
          PDF 转 Word
          会提取可编辑文字，不保留原文件的复杂排版、公式和扫描图片；扫描版 PDF
          需要 OCR，当前版本暂不支持。
        </div>
        <div className='mt-3 rounded-xl bg-white px-4 py-3 text-sm dark:bg-gray-800'>
          {file ? <b className='break-all'>{file.name}</b> : '尚未选择 PDF'}
        </div>
        <div className='mt-4'>
          <Button primary disabled={!file || busy} onClick={convert}>
            {busy ? '正在处理…' : '开始转换'}
          </Button>
        </div>
        <Notice message={message} error={isError} />
      </div>
    </div>
  )
}

function WordTool() {
  const [file, setFile] = useState(null)
  const [html, setHtml] = useState('')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const readWord = async () => {
    if (!file) return
    setBusy(true)
    setMessage('正在读取 Word 文档…')
    try {
      assertFileSize([file], 25)
      await loadExternalResource(CDN.mammoth, 'js')
      if (!window.mammoth) throw new Error('Word 组件加载失败，请检查网络。')
      const arrayBuffer = await file.arrayBuffer()
      const [htmlResult, textResult] = await Promise.all([
        window.mammoth.convertToHtml({ arrayBuffer }),
        window.mammoth.extractRawText({ arrayBuffer })
      ])
      setHtml(sanitizeDocumentHtml(htmlResult.value))
      setText(textResult.value)
      setMessage(
        htmlResult.messages.length
          ? `读取完成，同时发现 ${htmlResult.messages.length} 条格式兼容提示。`
          : '读取完成，可以下载 HTML、TXT，或打开打印页面另存为 PDF。'
      )
      setIsError(false)
    } catch (error) {
      setMessage(error.message || 'Word 文档读取失败，请确认文件为 DOCX。')
      setIsError(true)
    } finally {
      setBusy(false)
    }
  }

  const downloadHtml = () => {
    const document = `<!doctype html><html><head><meta charset="utf-8"><style>body{max-width:850px;margin:40px auto;font:16px/1.8 Arial,"Microsoft YaHei",sans-serif;padding:0 24px}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #bbb;padding:8px}</style></head><body>${html}</body></html>`
    downloadBlob(
      new Blob([document], { type: 'text/html;charset=utf-8' }),
      `${safeBaseName(file.name)}.html`
    )
  }

  const printPdf = () => {
    const frame = document.createElement('iframe')
    frame.style.position = 'fixed'
    frame.style.right = '0'
    frame.style.bottom = '0'
    frame.style.width = '0'
    frame.style.height = '0'
    frame.style.border = '0'
    document.body.appendChild(frame)
    const frameDocument = frame.contentWindow.document
    frameDocument.open()
    frameDocument.write(
      `<!doctype html><html><head><meta charset="utf-8"><style>@page{margin:18mm}body{font:12pt/1.7 Arial,"Microsoft YaHei",sans-serif}img{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #aaa;padding:6px}</style></head><body>${html}</body></html>`
    )
    frameDocument.close()
    window.setTimeout(() => {
      frame.contentWindow.focus()
      frame.contentWindow.print()
      window.setTimeout(() => frame.remove(), 1200)
    }, 400)
  }

  return (
    <div className='grid gap-5 lg:grid-cols-[.75fr_1.25fr]'>
      <div>
        <FilePicker
          accept='.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          label='选择 DOCX 文档'
          onChange={files => {
            setFile(files[0] || null)
            setHtml('')
            setText('')
            setMessage('')
          }}
        />
        <div className='mt-4 flex flex-wrap gap-2'>
          <Button primary disabled={!file || busy} onClick={readWord}>
            {busy ? '正在读取…' : '读取文档'}
          </Button>
          <Button disabled={!html} onClick={downloadHtml}>
            下载 HTML
          </Button>
          <Button
            disabled={!text}
            onClick={() =>
              downloadBlob(
                new Blob([text], { type: 'text/plain;charset=utf-8' }),
                `${safeBaseName(file.name)}.txt`
              )
            }
          >
            下载 TXT
          </Button>
          <Button disabled={!html} onClick={printPdf}>
            打印/另存为 PDF
          </Button>
        </div>
        <Notice message={message} error={isError} />
      </div>
      <div className={`${panelClass} min-h-[18rem]`}>
        <div className='mb-3 flex items-center justify-between'>
          <div className='text-sm font-black'>内容预览</div>
          <span className='text-xs text-gray-400'>
            仅支持 DOCX，不支持旧版 DOC
          </span>
        </div>
        {html ? (
          <div
            className='prose max-h-[28rem] max-w-none overflow-auto rounded-xl bg-white p-4 text-sm dark:prose-invert dark:bg-gray-800'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className='flex min-h-[14rem] items-center justify-center text-center text-sm leading-7 text-gray-400'>
            读取后会在这里预览文字、标题、列表、表格和图片
          </div>
        )}
      </div>
    </div>
  )
}

function TextCounter({ copy }) {
  const [value, setValue] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const readFile = async files => {
    const file = files[0]
    if (!file) return
    setBusy(true)
    setMessage(`正在读取 ${file.name}…`)
    try {
      assertFileSize([file], 40)
      const extension = file.name.split('.').pop()?.toLowerCase()
      let content = ''
      if (extension === 'pdf') {
        const pdfDocument = await loadPdfDocument(file)
        if (pdfDocument.numPages > 100) {
          throw new Error('文字统计最多读取 100 页 PDF。')
        }
        const pages = await extractPdfText(pdfDocument, (current, total) =>
          setMessage(`正在读取 PDF 第 ${current}/${total} 页…`)
        )
        content = pages.join('\n\n')
      } else if (extension === 'docx') {
        await loadExternalResource(CDN.mammoth, 'js')
        if (!window.mammoth) {
          throw new Error('Word 读取组件加载失败，请检查网络。')
        }
        const result = await window.mammoth.extractRawText({
          arrayBuffer: await file.arrayBuffer()
        })
        content = result.value
      } else if (extension === 'html' || extension === 'htm') {
        const html = await file.text()
        content =
          new DOMParser().parseFromString(html, 'text/html').body.textContent ||
          ''
      } else if (['txt', 'md', 'markdown', 'csv'].includes(extension)) {
        content = await file.text()
      } else {
        throw new Error(
          '暂不支持该文件，请选择 TXT、MD、CSV、HTML、DOCX 或 PDF。'
        )
      }
      if (!content.trim()) {
        throw new Error(
          extension === 'pdf'
            ? '没有读取到可统计文字；这可能是一份扫描版 PDF。'
            : '文件中没有读取到可统计文字。'
        )
      }
      setValue(content)
      setSourceName(file.name)
      setMessage(`已读取 ${file.name}，下方统计结果已更新。`)
      setIsError(false)
    } catch (error) {
      setMessage(error.message || '文件读取失败。')
      setIsError(true)
    } finally {
      setBusy(false)
    }
  }

  const stats = useMemo(() => {
    const chinese = (value.match(/[\u3400-\u9fff]/g) || []).length
    const english = (value.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length
    const numbers = (value.match(/\d+(?:\.\d+)?/g) || []).length
    const noSpaces = value.replace(/\s/g, '').length
    const lines = value ? value.split(/\r?\n/).length : 0
    const paragraphs = value.trim()
      ? value
          .trim()
          .split(/(?:\r?\n){2,}/)
          .filter(Boolean).length
      : 0
    const punctuation = (
      value.match(/[，。！？；：、“”‘’（）《》,.!?;:'"()[\]{}]/g) || []
    ).length
    const readingMinutes = value
      ? Math.max(1, Math.ceil((chinese + english) / 400))
      : 0
    return {
      chinese,
      english,
      numbers,
      noSpaces,
      lines,
      paragraphs,
      punctuation,
      total: value.length,
      readingMinutes
    }
  }, [value])

  const cards = [
    ['总字符数', stats.total],
    ['不含空格', stats.noSpaces],
    ['中文字数', stats.chinese],
    ['英文词数', stats.english],
    ['数字数量', stats.numbers],
    ['标点数量', stats.punctuation],
    ['行数', stats.lines],
    ['段落数', stats.paragraphs]
  ]

  return (
    <div className='grid gap-5 lg:grid-cols-[1.05fr_.95fr]'>
      <div>
        <FilePicker
          accept='.txt,.md,.markdown,.csv,.html,.htm,.docx,.pdf,text/plain,text/markdown,text/csv,text/html,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          label={busy ? '正在读取文件…' : '上传文件并自动统计'}
          onChange={readFile}
        />
        <div className='my-3 flex items-center gap-3 text-xs text-gray-400'>
          <span className='h-px flex-1 bg-gray-200 dark:bg-gray-700' />
          或直接粘贴文字
          <span className='h-px flex-1 bg-gray-200 dark:bg-gray-700' />
        </div>
        <textarea
          value={value}
          onChange={event => {
            setValue(event.target.value)
            setSourceName('')
          }}
          placeholder='在这里粘贴文章、论文摘要、作业说明或英文内容…'
          rows={16}
          className='w-full resize-y rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-7 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-indigo-900'
        />
        <div className='mt-3 flex flex-wrap gap-2'>
          <Button disabled={!value} onClick={() => copy(value)}>
            复制文字
          </Button>
          <Button
            disabled={!value}
            onClick={() => {
              setValue('')
              setSourceName('')
              setMessage('')
            }}
          >
            清空
          </Button>
          {sourceName && (
            <span className='flex min-h-[44px] max-w-full items-center rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200'>
              <span className='truncate'>来源：{sourceName}</span>
            </span>
          )}
        </div>
        <Notice message={message} error={isError} />
      </div>
      <div>
        <div className='grid grid-cols-2 gap-2'>
          {cards.map(([label, result]) => (
            <div
              key={label}
              className='rounded-2xl bg-gray-50 p-4 text-center dark:bg-gray-900'
            >
              <div className='text-xs text-gray-500'>{label}</div>
              <div className='mt-1 text-2xl font-black tabular-nums text-indigo-700 dark:text-indigo-200'>
                {result}
              </div>
            </div>
          ))}
        </div>
        <div className='mt-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white'>
          <div className='text-xs font-bold tracking-[.2em] text-white/70'>
            预计阅读时间
          </div>
          <div className='mt-2 text-3xl font-black'>
            {stats.readingMinutes || '—'} {stats.readingMinutes ? '分钟' : ''}
          </div>
          <div className='mt-2 text-xs leading-6 text-white/70'>
            按中英文合计约 400 字词/分钟估算，仅供参考。
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FileConverterTool({ copy }) {
  const [active, setActive] = useState('image')
  const panels = {
    image: <ImageFormatTool />,
    imagePdf: <ImagesToPdfTool />,
    pdf: <PdfTool />,
    word: <WordTool />,
    counter: <TextCounter copy={copy} />
  }

  return (
    <section className='relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.07)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] md:p-7'>
      <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500' />
      <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <div className='text-xs font-black tracking-[.25em] text-indigo-500'>
            LOCAL FILE LAB
          </div>
          <h2 className='mt-2 text-2xl font-black text-gray-900 dark:text-white md:text-3xl'>
            🗂️ 格式转换工坊
          </h2>
          <p className='mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400'>
            图片、PDF、Word 内容转换与文字统计；文件不会上传到本站服务器。
          </p>
        </div>
        <div className='rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200'>
          本地处理 · 完成即清除
        </div>
      </div>
      <div className='mt-6 flex gap-2 overflow-x-auto pb-2'>
        {TABS.map(([id, icon, label]) => (
          <button
            key={id}
            type='button'
            onClick={() => setActive(id)}
            className={`min-h-[44px] shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${
              active === id
                ? 'bg-[var(--heo-color-primary)] text-white shadow-sm'
                : 'border border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
            }`}
          >
            <span className='mr-1.5'>{icon}</span>
            {label}
          </button>
        ))}
      </div>
      <div className='mt-5'>{panels[active]}</div>
      <div className='mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-6 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400'>
        隐私说明：处理过程在当前浏览器中完成，本站不接收文件内容。首次使用
        PDF、Word
        功能时会联网加载免费的开源转换组件；文件本身不会发送给组件提供方。
      </div>
    </section>
  )
}
