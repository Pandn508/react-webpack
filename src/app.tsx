import React, { lazy, Suspense, useState } from "react";
import '@/app.scss'
import Class from "./components/Class";
import { Demo1, Demo2 } from '@/components'

// 使用import语法配合react的Lazy动态引入资源
const LazyDemo = lazy(() => import('@/components/LazyDemo'))

// preload是告诉浏览器页面必定需要的资源,浏览器一定会加载这些资源。
const PreloadDemo = lazy(() => import(
  /* webpackMode: "lazy" */
  /* webpackChunkName: "PreloadDemo" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  '@/components/PreloadDemo'
))
// prefetch是告诉浏览器页面可能需要的资源,浏览器不一定会加载这些资源,会在空闲时加载。
const PreFetchDemo = lazy(() => import(
  /* webpackChunkName: "PreFetchDemo" */
  /* webpackPrefetch: true */
  '@/components/PreFetchDemo'
))

function App() {
  const [ show, setShow ] = useState(false)

  // 点击事件中动态引入css, 设置show为true
  const onClick = () => {
    import('./app.css')
    setShow(true)
  }

  return (
    <div>
      <h2 onClick={onClick}>展示</h2>
      {/* show为true时加载LazyDemo组件 */}
      { show && (
        <>
          <Suspense fallback={null}><PreloadDemo /></Suspense>
          <Suspense fallback={null}><PreFetchDemo /></Suspense>
          <Suspense fallback={null}><LazyDemo /></Suspense>
        </>
      )}
      <Demo1 />
      <Class/>
    </div>
  )
}

export default App