export type CastSlotRole = 'host' | 'player';

export function castRoleSurfaceClasses(role: CastSlotRole): string {
  return role === 'host'
    ? 'border-cast-host-border bg-cast-host'
    : 'border-cast-player-border bg-cast-player';
}

export function castRoleLabelClasses(role: CastSlotRole): string {
  return role === 'host'
    ? 'text-cast-host-foreground'
    : 'text-cast-player-foreground';
}
