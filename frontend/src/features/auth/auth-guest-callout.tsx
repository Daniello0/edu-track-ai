import { GUEST_CALLOUT_MESSAGE } from './auth.constants';

/**
 * Guest save prompt shown above the auth form in the modal.
 */
export function AuthGuestCallout() {
  return <p className="auth-modal-guest-callout">{GUEST_CALLOUT_MESSAGE}</p>;
}
