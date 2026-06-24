import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/constants/app.constants';
import { LoadingIndicator } from '../../common/components/loading-indicator';
import { useAppStore } from '../../common/stores/app.store';
import { isAuthenticated } from '../auth/auth-flow.utils';
import { loadProfileLibraryData } from './profile-library.utils';
import { openReaderMaterialFromLibrary } from './profile-reader.utils';
import {
  PROFILE_EMPTY_LIBRARY_MESSAGE,
  PROFILE_LOADING_MESSAGE,
} from './profile.constants';
import type { LibraryItem, ProfileStats } from './profile.types';
import { MaterialGrid } from './material-grid';
import { StatsOverview } from './stats-overview';
import './profile.styles.css';

/**
 * Profile dashboard with library list loaded from the API.
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const accessToken = useAppStore((state) => state.auth.accessToken);
  const userId = useAppStore((state) => state.user.id);
  const setReaderMaterial = useAppStore((state) => state.setReaderMaterial);

  const [items, setItems] = useState<LibraryItem[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [continuingMaterialId, setContinuingMaterialId] = useState<
    string | null
  >(null);

  const isLoggedIn = isAuthenticated(userId, accessToken);

  useEffect(() => {
    if (!isLoggedIn || accessToken === null) {
      return;
    }

    void loadProfileLibraryData(accessToken, {
      setItems,
      setStats,
      setIsLoading,
      setError,
    });
  }, [accessToken, isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  const handleContinue = (materialId: string): void => {
    if (accessToken === null) {
      return;
    }

    setContinuingMaterialId(materialId);
    void openReaderMaterialFromLibrary(materialId, accessToken, {
      setReaderMaterial,
      navigateToReader: () => navigate(APP_ROUTES.READER),
      setError,
      setIsLoading: (loading) => {
        setContinuingMaterialId(loading ? materialId : null);
      },
    });
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Профиль</h1>

      {error ? <p className="profile-error">{error}</p> : null}

      <StatsOverview stats={stats} />

      <section className="profile-library">
        <h2 className="profile-section-title">Мои материалы</h2>

        {isLoading ? (
          <LoadingIndicator message={PROFILE_LOADING_MESSAGE} />
        ) : null}

        {!isLoading && items.length === 0 ? (
          <p className="profile-empty-message">
            {PROFILE_EMPTY_LIBRARY_MESSAGE}
          </p>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <MaterialGrid
            items={items}
            continuingMaterialId={continuingMaterialId}
            onContinue={handleContinue}
          />
        ) : null}
      </section>
    </div>
  );
}
