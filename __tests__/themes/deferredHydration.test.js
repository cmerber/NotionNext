import { lazy, Suspense } from 'react'
import { act } from '@testing-library/react'
import { renderToString } from 'react-dom/server.node'
import { hydrateRoot } from 'react-dom/client'
import useIsHydrated from '@/hooks/useIsHydrated'

test('preview updates preserve a server-rendered boundary while its client chunk is still loading', async () => {
  const Content = ({ hydrated }) => <p>{hydrated ? '预览已就绪' : '服务器文章'}</p>
  let resolveChunk
  const chunk = new Promise(resolve => { resolveChunk = resolve })
  const ClientContent = lazy(() => chunk)
  function Page({ server = false }) {
    const hydrated = useIsHydrated()
    const Child = server ? Content : ClientContent
    return <Suspense fallback={<p>正在加载</p>}><Child hydrated={hydrated} /></Suspense>
  }
  const container = document.createElement('div')
  container.innerHTML = renderToString(<Page server />)
  document.body.appendChild(container)
  const article = container.querySelector('p')
  const onRecoverableError = jest.fn()
  let root
  await act(async () => {
    root = hydrateRoot(container, <Page />, { onRecoverableError })
    await Promise.resolve()
  })
  expect(onRecoverableError).not.toHaveBeenCalled()
  expect(container.querySelector('p')).toBe(article)
  expect(container).toHaveTextContent('服务器文章')
  await act(async () => {
    resolveChunk({ default: Content })
    await chunk
  })
  expect(onRecoverableError).not.toHaveBeenCalled()
  expect(container.querySelector('p')).toBe(article)
  expect(container).toHaveTextContent('预览已就绪')
  act(() => root.unmount())
  container.remove()
})
