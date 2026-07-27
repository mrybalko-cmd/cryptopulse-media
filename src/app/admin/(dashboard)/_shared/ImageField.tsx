export default function ImageField({
  name,
  label,
  currentUrl,
  size = 96,
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
  size?: number;
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-[#8b93a7] font-bold mb-2">{label}</div>
      {currentUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${currentUrl}?w=${size * 2}&h=${size * 2}&fit=crop`}
          alt=""
          style={{ width: size, height: size }}
          className="rounded-lg object-cover mb-2 border border-[#262b38]"
        />
      )}
      <input name={name} type="file" accept="image/*" className="w-full text-[12.5px] text-[#8b93a7]" />
      {currentUrl && <p className="text-[11px] text-[#8b93a7] mt-1">Оставьте пустым, чтобы не менять текущую картинку.</p>}
    </div>
  );
}
