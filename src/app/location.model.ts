export interface LocationBossStats {
  level: number;
  hp: number;
  xp: number;
  gp: number;
  atk_mult: number;
  hit_p: number;
  atk: number;
  def_mult: number;
  eva_p: number;
  def: number;
  m_def_mult: number;
  m_eva_p: number;
  m_def: number;
  min_speed: number;
  max_speed: number;
  spell_power: number;
}

export interface LocationPoi {
  type: string;
  reqs?: string[];
  flags?: string[];
  key_item_flag?: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  map: string;
  poi?: LocationPoi[];
  trapped_chests?: string[];
}
