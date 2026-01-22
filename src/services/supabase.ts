import { createClient } from '@supabase/supabase-js'
import { createMiddleware } from '@tanstack/react-start'

export const supabaseMiddleWare = createMiddleware({ type: 'function' }).server(({ next }) => {
	const url = process.env.SUPABASE_URL!
	// Use service role key for admin operations (like deletion), fallback to anon key
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
	if (!url || !key) {
		console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in process.env')
		throw new Error('Server env vars SUPABASE_URL and SUPABASE_ANON_KEY must be set')
	}
	const supabase = createClient(url, key)
	return next({ context: { supabase } })
})
