import { ThemeToggleButton } from '@/components/ui/theme-toggle'
import { useThemeToggle } from '@/hooks/use-theme-toggle'

export function ThemeToggle() {
	const { toggleTheme, isDark } = useThemeToggle({
		blur: true,
		start: 'right-left',
		variant: 'rectangle',
	})
	return <ThemeToggleButton onClick={toggleTheme} isDarkTheme={isDark} />
}
