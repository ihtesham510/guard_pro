import React from 'react'
import { CompanyDialog } from '@/components/dialogs/company'
import { EmployeeDialog } from '@/components/dialogs/employee'
import { ShiftDialog } from '@/components/dialogs/shift'
import { SiteDialog } from '@/components/dialogs/sites'

export function RenderDialogs() {
	return (
		<React.Fragment>
			<CompanyDialog />
			<EmployeeDialog />
			<SiteDialog />
			<ShiftDialog />
		</React.Fragment>
	)
}
