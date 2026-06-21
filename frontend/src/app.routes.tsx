import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './common/components/app-layout';
import { APP_ROUTES } from './common/constants/app.constants';
import { MainPage } from './features/main-page/main';
import { ProfilePage } from './features/profile/profile';
import { QuizPage } from './features/quiz/quiz';
import { ReaderPage } from './features/reader/reader';

/**
 * Application route definitions.
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={APP_ROUTES.HOME} element={<MainPage />} />
          <Route path={APP_ROUTES.READER} element={<ReaderPage />} />
          <Route path={APP_ROUTES.QUIZ} element={<QuizPage />} />
          <Route path={APP_ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
