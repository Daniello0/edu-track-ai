import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { PageTransition } from './page-transition';
import './app-layout.styles.css';

/**
 * Shared shell: header and animated route outlet.
 */
export function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <PageTransition>
        <Outlet />
      </PageTransition>
    </div>
  );
}
