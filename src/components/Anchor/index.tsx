import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

type AnchorLinkProps = {
  to: string,
  children: ReactNode,
  container: string,
  scrollOffset: number | string
}
export const AnchorLink: React.FC<AnchorLinkProps> = ({to, children, container, scrollOffset}) => {
  const jumpClick = () => {
    const id = to;
    const el = document.querySelector(`#${id}`);
    if (el !== null) {
      const offsetTop = (el as HTMLElement).offsetTop;
      const headerTop = isNaN(Number(scrollOffset))
        ? document.querySelector(scrollOffset as string)?.scrollHeight
        : scrollOffset;
      const scrollNdoe = document.querySelector(container)
      scrollNdoe?.scrollTo({
        top: offsetTop + (headerTop as number),
        behavior: 'smooth'
      })
    }
  }
  return (
    <a className='anchor-link' onClick={jumpClick}>
      {children}
    </a>
  );
}

type AnchorProps = {
  showInk?: boolean | number,
  offset?: number,
  container: string,
  scrollOffset?: string | number,
  children: ReactNode
}
const Anchor: React.FC<AnchorProps> = ({
  showInk = false,
  offset = 20,
  container,
  scrollOffset,
  children
}) => {
  const refAnchor = useRef<any>(null)
  const [affixed, setAffixed] = useState<boolean>(false)
  const [affixedTop, setAddixedTop] = useState<number>(94)
  const [inkTop, setInkTop] = useState<number>(0)
  const affixAnchor = (e: Event) => {
    const isEqual = (e.target as Node).isEqualNode(document.querySelector(container))
    if (!isEqual) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTo || e.target.scrollTop;
    const clientHeight = document.querySelector('.anchor-link')?.clientHeight || 28;
    setInkTop(Math.max(offsetTopArr.findIndex(i => i >= scrollTop)-1, 0) * clientHeight)
    setAffixed(scrollTop >= offsetTop);
  }
  const fnGetTargetOffsetArr = () => {
    const offsetTopArr = React.Children.map(children, (child, index) => {
      const id = `#${child.to}`;
      const target = document.querySelector(id);
      const offsetTop = target.offsetTop - offset
      return offsetTop
    })
    return offsetTopArr
  }

  let resizeObserver: ResizeObserver, offsetTop: number, offsetTopArr: Array<number>;
  useLayoutEffect(() => {
    resizeObserver = new ResizeObserver(() => {
      offsetTop = refAnchor.current.offsetTop;
      offsetTopArr = fnGetTargetOffsetArr()
    })
    resizeObserver.observe(this.$parent.$el);
  }, [])
  useEffect(() => {
    window.addEventListener('scroll', affixAnchor, true)
  })
  return (
    <div 
      id='anchor' 
      className={`anchor ${showInk && affixed ? 'anchor-fixed' : ''}`}
      style={{top: `${affixedTop}px`}}
      >
      <div className='anchor-ink'>
        <span className='anchor-ink-bar' style={{top: `${inkTop}px`}}></span>
      </div>
      {children}
    </div>
  )
}
export default Anchor;