import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Menu } from 'antd';
import { useRecoilValue } from 'recoil';
import { Amplify, Auth } from 'aws-amplify';
import Layout from './components/layout';
import Login from './components/Login/Login';
import SignUp from './components/Login/SignUp';
import Forgot from './components/Login/Forgot';
import Home from './components/Home';
import { loggedInUserData } from './utils/state';

Amplify.configure({
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id:
      'eu-west-1:06863165-5b56-4598-8e87-cc9ae2895f39',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_sk5LfmU4g',
  aws_user_pools_web_client_id: '6d5of62ku9g4pcl2jpp0rcng67',
  oauth: {},
});

const App = () => {
  const [selected, setSelected] = useState('home');
  const user1 = useRecoilValue(loggedInUserData);
  const userStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : { sub: null };
  const user = user1.sub ? user1 : userStorage;

  const logout = () => {
    localStorage.setItem('user', JSON.stringify({ sub: null }));
    // window.location.reload();
  };
  const handleClick = (e) => {
    setSelected(e.key);
  };
  return (
    <Router>
      <Menu onClick={handleClick} selectedKeys={[selected]} mode="horizontal">
        <Menu.Item key="home">
          <Link to="/">Начало</Link>
        </Menu.Item>
        {user.sub === null ? (
          <>
            <Menu.Item key="login">
              <Link to="/app/login">Вход</Link>
            </Menu.Item>
            <Menu.Item key="signup">
              <Link to="/app/signup">Регистрация</Link>
            </Menu.Item>
            <Menu.Item key="forgot">
              <Link to="/app/forgot">Забравена парола</Link>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="logout">
              <a href="/" onClick={() => Auth.signOut().then(logout())}>
                Изход
              </a>
            </Menu.Item>
          </>
        )}
      </Menu>

      <Layout>
        <Switch>
          <Route path="/app/login">
            {user.sub === null ? (
              <>
                <h1>Вход</h1>
                <Login type="full" />
              </>
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/app/forgot">
            <Forgot />
          </Route>
          <Route path="/app/signup">
            <SignUp />
          </Route>
          <Route path="/">
            <Home user={user} />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
