import { dialogs_list } from '@/constants'
import { useDialogs } from '@/hooks/use-dialog'
import { createContext, PropsWithChildren, useContext } from 'react'

export type DialogType = (typeof dialogs_list)[number]

interface AppStateContext {
	dialogs: ReturnType<typeof useDialogs<DialogType>>
}

export const appStateContext = createContext<AppStateContext | null>(null)

export function AppStateContextProvider({ children }: PropsWithChildren) {
	const initailState = Object.fromEntries(dialogs_list.map(d => [d, false])) as Record<DialogType, boolean>
	const dialogs = useDialogs(initailState)
	return <appStateContext.Provider value={{ dialogs }}>{children}</appStateContext.Provider>
}

export function useAppState() {
	const ctx = useContext(appStateContext)
	if (!ctx) throw Error('useAppState must be used inside AppStateContextProvider')
	return ctx
}
