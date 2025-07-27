import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value)
  }

  return (
    <select
      onChange={handleChange}
      value={i18n.language}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-blue-100 cursor-pointer hover:text-blue-700 rounded transition"
    >
      <option value="ru">🇷🇺 Рус</option>
      <option value="en">🇬🇧 Eng</option>
      <option value="kz">🇰🇿 Қаз</option>
      <option value="cn">🇨🇳 中文</option>
    </select>
  )
}
