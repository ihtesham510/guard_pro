import { useReducer } from 'react'

type Action<Dialog extends string> =
	| { type: 'OPEN_DIALOG'; dialog: Dialog }
	| { type: 'CLOSE_DIALOG'; dialog: Dialog }
	| { type: 'SET_DIALOG'; dialog: Dialog; value: boolean }
	| { type: 'CLOSE_ALL' }

type State<Dialog extends string> = {
	[key in Dialog]: boolean
}

function reducer<Dialog extends string>(
	state: State<Dialog>,
	action: Action<Dialog>,
): State<Dialog> {
	switch (action.type) {
		case 'OPEN_DIALOG':
			return { ...state, [action.dialog]: true }
		case 'CLOSE_DIALOG':
			return { ...state, [action.dialog]: false }
		case 'SET_DIALOG':
			return { ...state, [action.dialog]: action.value }
		case 'CLOSE_ALL':
			return Object.fromEntries(
				Object.keys(state).map(key => [key, false]),
			) as State<Dialog>
		default:
			return state
	}
}

export function useDialogs<Dialog extends string>(initialState: State<Dialog>) {
	const [state, dispatch] = useReducer(reducer<Dialog>, initialState)

	const open = (dialog: Dialog) => dispatch({ type: 'OPEN_DIALOG', dialog })

	const close = (dialog: Dialog) => dispatch({ type: 'CLOSE_DIALOG', dialog })

	const closeAll = () => dispatch({ type: 'CLOSE_ALL' })

	const setState = (dialog: Dialog, value: boolean) =>
		dispatch({ type: 'SET_DIALOG', dialog, value })

	return { state, setState, open, close, closeAll }
}
