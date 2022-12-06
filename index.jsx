// 使用的css库为tailwind

import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import styles from './index.module.scss'

// 使用模板匹配判断资源路径是否为本地
var pathPattern = /[/]+/
const isLocal = imgUrl => pathPattern.test(imgUrl) ? getImage(imgUrl) : getLocalImage(imgUrl)

// vite获取本地外部资源路径
export const getLocalImage = imgUrl => new URL(`/src/assets/${imgUrl}`, import.meta.url).href
export const getImage = imgUrl => new URL(imgUrl, import.meta.url).href

// 加载时使用的图片
const LoadingImage = ({ style }) => {
  return (
    <div className={styles.lodingSupe} style={style}>
      <img src={isLocal('BGsupe.png')}/>
    </div>
  )
}

// 组件懒加载
export const lazyLoad = component => {
  const LazyComponent = lazy(component)
  return (
    <Suspense fallback={
      <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center text-3xl'><span className='animate-pulse'>Loading</span><LoadingImage style={{ width: '7rem', height: '3.3rem' }}/></div>
    }>
      <LazyComponent />
    </Suspense>
  )
}

// 图片预加载
export const PrestrainImg = ({ imgUrl }) => {
  const [loadingOk, setLoadingOk] = useState(false)

  useEffect(()=>{
    var image = new Image()
    image.src = isLocal(imgUrl)
    image.onload = () => setLoadingOk(true)
  }, [])

  return ( loadingOk ? <img className="h-full w-full" src={isLocal(imgUrl)} alt="" /> : <div className="h-full w-full animate-pulse bg-slate-200"></div> )
}

// 图片懒加载（监控屏幕刷到图片再加载）
export const LazyImage = ({ imgUrl, style }) => {

  const divRef = useRef()

  const [loadingOk, setLoadingOk] = useState(false)

  useEffect(()=>{
    const observer = new IntersectionObserver ( entries => {
      entries.forEach(item => {
        if (item.intersectionRatio <= 0) return
        var image = new Image()
        image.src = isLocal(imgUrl)
        image.onload = () => setLoadingOk(true)
      })
    }, { threshold: [ 0.1 ] })
    observer.observe(divRef.current)
  }, [])

  return (
    loadingOk ? <img className="h-full w-full bg-cover" style={style} src={isLocal(imgUrl)} alt="" /> : <div ref={divRef} className="h-full w-full  "><LoadingImage/></div>
  )
}
