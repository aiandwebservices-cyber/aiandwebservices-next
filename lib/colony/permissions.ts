export type ColonyRole = 'owner' | 'admin' | 'staff' | 'viewer'

export type ColonyPermission =
  | 'view_leads'
  | 'send_email'
  | 'onboard_customer'
  | 'manage_team'
  | 'delete_lead'
  | 'change_cohort_settings'

const MATRIX: Record<ColonyRole, Set<ColonyPermission>> = {
  owner:  new Set(['view_leads','send_email','onboard_customer','manage_team','delete_lead','change_cohort_settings']),
  admin:  new Set(['view_leads','send_email','manage_team','delete_lead','change_cohort_settings']),
  staff:  new Set(['view_leads','send_email']),
  viewer: new Set(['view_leads']),
}

export function hasPermission(role: ColonyRole, permission: ColonyPermission): boolean {
  return MATRIX[role]?.has(permission) ?? false
}

export function mapClerkRoleToColony(clerkRole: string | null | undefined): ColonyRole {
  switch (clerkRole) {
    case 'org:admin':  return 'owner'
    case 'org:member': return 'admin'
    case 'org:staff':  return 'staff'
    case 'org:viewer': return 'viewer'
    default:           return 'viewer'
  }
}
