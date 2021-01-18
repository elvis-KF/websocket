import Login from '../components/login/login'
import App from '../components/index/index'
import React from 'react'
import { Route, Switch } from 'react-router'


export interface RoutesItem {
  title: string
  component: typeof React.Component | React.FC
  path: string
}

export const routes: RoutesItem[] = [
  {
    title: 'login',
    component: Login,
    path: '/login'
  },
  {
    title: 'home',
    component: App,
    path: '/home'
  },
  {
    title: 'login',
    component: Login,
    path: '/'
  }
]

export const Routes = () => {
  return (
    <Switch>
      {routes.map((item, index) => (
        <Route path={item.path} component={item.component} key={index} />
      ))}
      {/* <Redirect from='/' to={routes[0].path} /> */}
    </Switch>
  )
}
