// App.tsx
import * as React from 'react'
import { Ct } from '@ct'

class Demo extends React.Component<any, any> {
  render() {
    console.log(this.props?.asdad)
    return <div className="app">DEMODEMODEMO</div>
  }
}

export default Ct({
  model: 'demo',
  Component: Demo,
})
