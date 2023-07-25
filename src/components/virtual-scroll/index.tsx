import React, { ReactNode, cloneElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import './index.scss'

type Position = {
  index: number,
  top: number,
  bottom: number,
  height: number,
}

type Props = {
  /* 传入的数据列表 */
  listData: Array<any>,
  /* 预估每行总高度 */
  estimatedItemSize: number,
  /* 容器总高度 */
  propHeight?: string,
  /* 缓冲比例 */
  bufferScale?: number,
  /* 子组件样式 */
  children?: ReactNode
}

export const ExampleItem: React.FC<{item?: any}> = (props) => {
  return (
    <span>{props.item.value}</span>
  )
}

const VirtualScroll: React.FC<Props> = ({listData = [], estimatedItemSize = 32, propHeight, bufferScale = 0.2, children}) => {
  const refVirtualScroll = useRef<any>(null)
  /* 可视区域高度 */
  const [screenHeight, setScreenHeight] = useState<number>(0)
  /* 偏移量 */
  const [startOffset, setStartOffset] = useState<number>(0)
  /* 起始索引 */
  const [start, setStart] = useState<number>(0)
  /* 结束索引 */
  const [end, setEnd] = useState<number>(0)
  /* 初始 缓存数据 */
  const _listData = useMemo(() => {
    return listData.map((item, index) => ({
      _index: `_${index}`,
      ...item
    }))
  }, [listData])
  /* 存储列表每项的高度和位置 */
  const position = useMemo(() => {
    return listData.map((i, index) => ({
        index,
        height: estimatedItemSize,
        top: index * estimatedItemSize,
        bottom: (index + 1) * estimatedItemSize,
    }))
  }, [listData])
  /* 显示数量 */
  const visibelCount = useMemo(() => {
    return Math.ceil(screenHeight / estimatedItemSize)
  }, [screenHeight, estimatedItemSize])
  /* 创建refs */
  const refVirtualItems = useMemo(() => 
  Array(visibelCount).fill(0).map(i => React.createRef<HTMLDivElement>())
  , [visibelCount])
  /* 计算整个组件高度 */
  const listHeight = useMemo(() => {
    return position[position.length - 1]?.bottom
  }, [position])
  /* buffer */
  const aboveCount = useMemo(() => {
    return Math.min(start, Math.ceil(bufferScale * visibelCount))
  }, [visibelCount, start])
  const belowCount = useMemo(() => {
    return Math.min(listData.length - end, Math.ceil(bufferScale * visibelCount))
  }, [visibelCount, end])
  /* 偏移量 */
  const getTransform = useMemo(() => {
    return `translate3d(0, ${startOffset}px, 0)`
  }, [startOffset])
  const visibleData = useMemo(() => {
    let _start = start - aboveCount
    let _end = end + belowCount
    return _listData.slice(_start, _end)
  }, [listData, start, end])

  /* mounted */
  useLayoutEffect(() => {
    setScreenHeight(refVirtualScroll.current.clientHeight)
  }, [])
  useEffect(() => {
    setStart(0)
    setEnd(start + visibelCount)
  }, [visibelCount])

  /* updated */
  useEffect(() => {
    updateItemSize()
    getStartOffset()
  })

  const updateItemSize = () => {
    let nodes = refVirtualItems
    for(let node of nodes) {
      if (!node.current) return;
      let rect = node.current?.getBoundingClientRect();
      let height = rect?.height;
      let index = + node.current?.id.slice(1)
      let oldHeight = position[index].height
      let dValue = oldHeight - height

      if(dValue) {
        position[index].bottom -= dValue
        position[index].height = height
        for(let k = index + 1; k < position.length; k++) {
          position[k].top = position[k - 1].bottom
          position[k].bottom -= dValue
        }
      }
    }
  }

  /* event */
  const scrollEvent = () => {
    let scrollTop = refVirtualScroll.current.scrollTop
    const _start = getStartIndex(scrollTop)
    setStart(_start)
    setEnd(_start + visibelCount)
    getStartOffset()
  };

  const getStartOffset = () => {
    if (start >= 1) {
      let size = position[start].top - (start >= aboveCount ? position[start - aboveCount]. top : 0)
      setStartOffset(position[start - 1].bottom - size)
    } else {
      setStartOffset(0)
    }
  }

  const getStartIndex = (scrollTop: number): any => {
    return binarySearch(position, scrollTop)
  }

  /* 二分查找 */
  function binarySearch(list: Array<Position>, value: number): any {
    let _start = 0
    let _end = list.length - 1
    let tempIndex = null
    while(_start <= _end) {
      let midIndex = Math.floor((_start + _end) / 2)
      let midValue = list[midIndex].bottom
      if (midValue === value) {
        return midIndex + 1;
      } else if (midValue < value) {
        _start = midIndex + 1
      } else if (midValue > value) {
        if (tempIndex === null || tempIndex > midIndex) {
          tempIndex = midIndex
        }
        _end = _end - 1
      }
    }
    return tempIndex;
  }

  return (
    /* 可视区容器 */
    <div ref={refVirtualScroll} className="infinite-list-container" onScroll={scrollEvent}>
      {/* 内容总高度 */}
      <div 
        className="infinite-list-phantom" 
        style={{height: listHeight}}
      />
      <div className="infinite-list" style={{ transform: getTransform}}>
        {
          visibleData.map((item, index) => {
            return (
              <div 
                ref={refVirtualItems[index]} 
                className="infinite-list-item" 
                style={{height: estimatedItemSize + 'px', lineHeight: estimatedItemSize + 'px'}}
                key={index}
                id={`${item._index}`}
                >
                {cloneElement(children as React.ReactElement<any>, { item })}
              </div>
            )
          })
        }
      </div>
    </div>
  ) 
}

export default VirtualScroll
