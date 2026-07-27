import { logoutAction } from './actions';

export default function LogoutButton() {
  return (
    <form action={logoutAction} className="px-2.5">
      <button type="submit" className="text-[11.5px] font-semibold text-[#8b93a7] hover:text-[#eef0f4] transition-colors">
        Выйти
      </button>
    </form>
  );
}
