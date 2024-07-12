import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './home'
import Jobs from './jobs'
import Layout from '../components/Layout'
import Settings from './settings'
import Page404 from './Page404'
import { useAccount } from 'wagmi'

function RouterHandler() {
    const {address} = useAccount();

    if(!address) {
        return <Home />
    }

    return (

        <Routes>
            <Route path='/'>
                <Route index element={<Home />} />
            </Route>
            <Route path="dashboard" element={<Layout
            />}>
                <Route index element={<Jobs />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="settings" element={<Settings />} />

                {/* Using path="*"" means "match anything", so this route
            acts like a catch-all for URLs that we don't have explicit
            routes for. */}
                <Route path="*" element={<Page404 />} />
            </Route>
        </Routes>
    )
}

export default RouterHandler