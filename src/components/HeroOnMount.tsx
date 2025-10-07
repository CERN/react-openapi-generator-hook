import { useApi } from '../hook/useApi'
import { DefaultApiFactory } from '../../open-api-configuration/api'
import { RequestStateVisualizer } from './RequestStateVisualizer'

export const HeroOnMount = () => {

  const [{ loading, data, error, response }, fetch, abort] = useApi({
    apiFactory: DefaultApiFactory,
    methodName: 'fetchData'
  }, { manual: true })

  return (
    <RequestStateVisualizer
      loading={loading}
      data={data}
      error={error}
      response={response}
      fetch={fetch}
      abort={abort}
    />
  )


}
