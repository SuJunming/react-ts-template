// App.tsx
import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
const lazy = React.lazy
const Suspense = React.Suspense
const Status = ({ code, children }: any) => (
  <Route
    render={({ staticContext }: any) => {
      if (staticContext) {
        staticContext.status = code
      }
      return children
    }}
  />
)
const NotFound = (): any => (
  <Status code={404}>
    <div>
      <h1>抱歉，页面消失了</h1>
    </div>
  </Status>
)
export default class App extends React.Component<any, any> {
  render() {
    return (
      <div className="app">
        <Router>
          <Suspense fallback={'loading...'}>
            <Switch>
              <Route
                exact
                path="/"
                component={lazy(() => import('./pages/demo'))}
              />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </div>
    )
  }
}
