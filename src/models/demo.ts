import { request, Api } from '@api'
export const demo = {
  state: {
    data: 0,
  },
  reducers: {
    getData(state: any, payload: any) {
      return { data: state.data + 1 }
    },
  },
  effects: (dispatch: any) => ({
    getByAsync: async (params: any) => {
      const data = await request.post(Api.test)
      dispatch.demo.getData(data)
    },
  }),
}
