import { loginAction } from './actions';
import PasswordField from '../(dashboard)/_shared/PasswordField';
import SubmitButton from '../(dashboard)/_shared/SubmitButton';
import { SITE_BRAND } from '@/lib/site';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--admin-bg-alt)_0%,var(--admin-bg)_55%)]">
      <div className="w-[380px] bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-2xl p-9">
        <div className="flex items-center gap-2 mb-7">
          <span className="w-[26px] h-[26px] rounded-lg bg-[#1d1d1f] flex items-center justify-center text-[13px]">⚡</span>
          <span className="font-extrabold text-base">{SITE_BRAND}<b className="text-cyan-400">.admin</b></span>
        </div>
        <p className="text-xl font-extrabold mb-1">Вход в админку</p>
        <p className="text-[12.5px] text-[var(--admin-text-muted)] mb-6">Доступ только для сотрудников редакции</p>

        <form action={loginAction}>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-muted)] mb-1.5 block">Email</label>
          <input
            name="email"
            type="email"
            required
            autoFocus
            className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3.5 py-2.5 text-[13.5px] mb-4 outline-none focus:border-cyan-500"
          />
          <div className="mb-4">
            <PasswordField
              name="password"
              label="Пароль"
              required
              className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3.5 py-2.5 text-[13.5px] outline-none focus:border-cyan-500 pr-16"
            />
          </div>
          {error && (
            <p className="text-[12px] text-red-400 mb-3">Неверный email или пароль.</p>
          )}
          <SubmitButton className="w-full bg-cyan-500 text-[#06222b] font-extrabold text-[13.5px] rounded-lg py-3 hover:opacity-90 transition-opacity">
            Войти
          </SubmitButton>
        </form>
        <p className="text-center text-[11.5px] text-[var(--admin-text-muted)] mt-4">Забыли пароль? Обратитесь к администратору</p>
      </div>
    </div>
  );
}
