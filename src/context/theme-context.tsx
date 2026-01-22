import { createContext, PropsWithChildren, useCallback, useContext } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'

type Theme = 'dark' | 'light'

interface ThemeContext {
	theme: Theme
	toggleTheme: () => void
	setTheme: (theme: Theme) => void
}

export const themeContext = createContext<ThemeContext | null>(null)

const get_theme = createServerFn({ method: 'GET' }).handler(() => {
	return (getCookie('theme') as Theme) ?? 'light'
})

export const set_theme = createServerFn({ method: 'POST' })
	.inputValidator((theme: Theme) => theme)
	.handler(({ data }) => {
		return setCookie('theme', data as Theme)
	})

export const themeQuery = queryOptions({
	queryKey: ['theme'],
	queryFn: get_theme,
})

export function ThemeProvider({ children }: PropsWithChildren) {
	const { data } = useQuery(themeQuery)
	const themeMutation = useMutation({
		mutationFn: set_theme,
		async onMutate(variables, context) {
			await context.client.setQueryData(['theme'], variables.data)
		},
		meta: {
			invalidateQuries: ['theme'],
		},
	})
	const theme = data!

	const toggleTheme = useCallback(() => {
		themeMutation.mutate({ data: theme === 'dark' ? 'light' : 'dark' })
	}, [theme])
	const setTheme = (theme: Theme) => themeMutation.mutate({ data: theme })

	return <themeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</themeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(themeContext)
	if (!ctx) {
		throw Error('useTheme must be used inside ThemeProvider')
	}
	return ctx
}
