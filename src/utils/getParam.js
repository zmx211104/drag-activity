import http from '@/utils/request'
import { backend, appEnv } from '@/config/app.config'

export let getParam = async (key) => {
  let res = await http.request({
    url: backend.manager + '/api/adminsmlookupitem/weblist?lookupCodes=' + key,
    method: 'GET',
  })
  if (res.data && res.data.code > 0) 
    return res.data.data
  else throw 'get param error'
}