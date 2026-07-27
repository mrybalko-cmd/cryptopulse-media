import { logoutAction } from './actions';

export default function LogoutButton() {
  return (
    <form action={logoutAction} className="px-2.5">
      <button type="submit" className="text-[11.5px] font-semibold text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors">
        Выйти
      </button>
    </form>
  );
}
