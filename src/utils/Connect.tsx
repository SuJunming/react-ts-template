import { connect } from 'react-redux'
import * as React from 'react'
const preStyle: any = {
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  margin: '1em 0',
  fontSize: 0.8,
}
const MyFallbackComponent = (props: any) => (
  <pre style={preStyle}>{props.error.message}</pre>
)
const connectRedux = (key: string, component: any) => {
  const mapState = (state: any) => ({
    data: state[key],
  })
  const mapDispatch = (data: any) => ({ actions: { ...data[key] } })
  return connect(mapState, mapDispatch)(component)
}
export const Ct = ({ model, Component, title }: any) => {
  class WithErrorHandler extends React.Component<any, any> {
    static displayName: string
    constructor(props: any) {
      super(props)

      this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
      }
    }
    componentDidMount() {
      if (title) {
        document.title = title
      }
    }

    componentDidCatch(error: any, info: any) {
      this.setState({ hasError: true, error, errorInfo: info })
    }

    render() {
      if (this.state.hasError) {
        const { error, errorInfo } = this.state
        return (
          <MyFallbackComponent
            {...this.props}
            error={error}
            errorInfo={errorInfo}
          />
        )
      }
      return <Component {...this.props} />
    }
  }
  WithErrorHandler.displayName = `withErrorHandler(${Component.displayName})`
  return connectRedux(model, WithErrorHandler)
}
