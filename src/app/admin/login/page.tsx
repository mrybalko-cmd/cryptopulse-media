import { loginAction } from './actions';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#131725_0%,#0f1115_55%)]">
      <div className="w-[380px] bg-[#161922] border border-[#262b38] rounded-2xl p-9">
        <div className="flex items-center gap-2 mb-7">
          <span className="w-[26px] h-[26px] rounded-lg bg-red-600 flex items-center justify-center text-[13px]">⚡</span>
          <span className="font-extrabold text-base">CryptoPulse<b className="text-cyan-400">.admin</b></span>
        </div>
        <p className="text-xl font-extrabold mb-1">Вход в админку</p>
        <p className="text-[12.5px] text-[#8b93a7] mb-6">Доступ только для сотрудников редакции</p>

        <form action={loginAction}>
          <label className="text-[11.5px] font-bold text-[#8b93a7] mb-1.5 block">Email</label>
          <input
            name="email"
            type="email"
            required
            autoFocus
            className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3.5 py-2.5 text-[13.5px] mb-4 outline-none focus:border-cyan-500"
          />
          <label className="text-[11.5px] font-bold text-[#8b93a7] mb-1.5 block">Пароль</label>
          <input
            name="password"
            type="password"
            required
            className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3.5 py-2.5 text-[13.5px] mb-4 outline-none focus:border-cyan-500"
          />
          {error && (
            <p className="text-[12px] text-red-400 mb-3">Неверный email или пароль.</p>
          )}
          <button
            type="submit"
            className="w-full bg-cyan-500 text-[#06222b] font-extrabold text-[13.5px] rounded-lg py-3 hover:opacity-90 transition-opacity"
          >
            Войти
          </button>
        </form>
        <p className="text-center text-[11.5px] text-[#8b93a7] mt-4">Забыли пароль? Обратитесь к администратору</p>
      </div>
    </div>
  );
}
