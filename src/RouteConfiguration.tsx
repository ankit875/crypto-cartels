import { Route, HashRouter } from 'react-router-dom'
import { StartScreen, GameScreen } from './screens'

const RouteConfiguration = () => {
  return (
    <HashRouter>
      <Route path={'/'} Component={StartScreen} />
      <Route path={'/game'} Component={GameScreen} />
    </HashRouter>
  )
}

export default RouteConfiguration
