import React from 'react'
import { CompanyDialog } from './company'
import { EmployeeDialog } from './employee'
import { SiteDialog } from './sites'
import { ShiftDialog } from './shift'

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
