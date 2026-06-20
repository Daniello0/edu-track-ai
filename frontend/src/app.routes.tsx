import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './common/constants/app.constants';
import { MainPage } from './features/main-page/main';

/**
 * Application route definitions.
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
