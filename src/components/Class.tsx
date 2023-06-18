// 类组件,可以用装饰器简化代码。
import React, { PureComponent } from "react";

// 装饰器为,组件添加age属性
function addAge(Target: Function) {
  Target.prototype.age = 111
}

// 使用装饰器
@addAge
class Class extends PureComponent {
  age?: number
  render(): React.ReactNode {
    return (
      <h2>我是类组件---{ this.age }</h2>
    )
  }
}

export default Class

