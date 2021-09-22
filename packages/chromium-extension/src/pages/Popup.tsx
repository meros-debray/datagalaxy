import React, { useEffect, useState } from 'react';
import { MemoryRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AccessToken } from '../../../shared/dist/shared';
import App from '../App';
import GlobalError from '../components/GlobalError';
import Layout from '../components/Layout';
import LoadingScreen from '../components/LoadingScreen';
import { useStoreDispatch, useStoreState } from '../store/hooks';
import Onboarding from './Onboarding';

enum AppInitialLoadingStatus {
    Loading,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    Onboarding,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    App,
}

const Popup = () => {
    const [initialLoadingState, setInitialLoadingState] = useState<AppInitialLoadingStatus>(
        AppInitialLoadingStatus.Loading,
    );

    const dispatch = useStoreDispatch();
    const state = useStoreState((stt) => stt);
    const { onboardingDone, pat } = state.auth;

    useEffect(() => {
        const loadStorage = async () => {
            if (onboardingDone) {
                setInitialLoadingState(AppInitialLoadingStatus.App);
            } else {
                setInitialLoadingState(AppInitialLoadingStatus.Onboarding);
            }
        };
        loadStorage();
    }, []);

    const [isAppReady, setIsAppReady] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<boolean>(null);

    useEffect(() => {
        const initApp = async () => {
            try {
                // Refresh accessToken at the extension launch
                const accessTokenSingleton = AccessToken.getInstance();
                await accessTokenSingleton.init(pat);

                // Fetch all available tags
                await dispatch.auth.fetchTags();
                await dispatch.auth.fetchUser();

                setIsAppReady(true);
            } catch (error) {
                setGlobalError(true);
            }
        };

        if (onboardingDone) {
            initApp();
        }
    }, []);

    const renderBootingExtension = () => {
        if (initialLoadingState === AppInitialLoadingStatus.Loading) {
            return <LoadingScreen />;
        }

        if (isAppReady && initialLoadingState === AppInitialLoadingStatus.App) {
            return <Redirect to="/app" />;
        }

        if (initialLoadingState === AppInitialLoadingStatus.Onboarding) {
            return <Redirect to="/onboarding" />;
        }

        return null;
    };

    if (globalError) {
        return <GlobalError />;
    }

    return (
        <Layout>
            <Router>
                <Switch>
                    <Route path="/onboarding">
                        <Onboarding />
                    </Route>
                    <Route path="/app">
                        <App />
                    </Route>
                    <Route render={renderBootingExtension} exact />
                </Switch>
            </Router>
        </Layout>
    );
};

export default Popup;
