import { Outlet } from 'react-router-dom';
import { useAppStore } from '../stores/app.store';
import { AuthModal } from '../../features/auth/auth-modal';
import { Header } from './header';
import { PageTransition } from './page-transition';
import './app-layout.styles.css';

/**
 * Shared shell: header, auth modal, and animated route outlet.
 */
export function AppLayout() {
  const authModal = useAppStore((state) => state.authModal);
  const closeAuthModal = useAppStore((state) => state.closeAuthModal);

  return (
    <div className="app-layout">
      <Header />
      <AuthModal
        isOpen={authModal.isOpen}
        variant={authModal.variant}
        onClose={closeAuthModal}
        onSuccess={closeAuthModal}
      />
      <PageTransition>
        <Outlet />
      </PageTransition>
    </div>
  );
}
