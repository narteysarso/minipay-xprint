import React from 'react';
import { Breadcrumb, Menu, theme } from 'antd';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import WalletContext from './context';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/home';
import Jobs from './pages/jobs';
import Settings from './pages/settings';
import Page404 from './pages/Page404';
import RouterHandler from './pages';

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <WalletContext>
      <RouterHandler />
    </WalletContext>

  );
};

export default App;