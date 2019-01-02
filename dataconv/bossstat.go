package main

import (
	"encoding/csv"
	"encoding/json"
	"os"
	"strconv"
	"strings"
)

type BossStats struct {
	Level      int `json:"level"`
	HP         int `json:"hp"`
	XP         int `json:"xp"`
	GP         int `json:"gp"`
	AtkMult    int `json:"atk_mult"`
	HitP       int `json:"hit_p"`
	Atk        int `json:"atk"`
	DefMult    int `json:"def_mult"`
	EvaP       int `json:"eva_p"`
	Def        int `json:"def"`
	MDefMult   int `json:"m_def_mult"`
	MEvaP      int `json:"m_eva_p"`
	MDef       int `json:"m_def"`
	MinSpeed   int `json:"min_speed"`
	MaxSpeed   int `json:"max_speed"`
	SpellPower int `json:"spell_power"`
}

type Record struct {
	Boss     string
	Position string
	Enemy    string
	Stats    BossStats `json:"stats"`
}

func main() {
	bossStatsFile, err := os.Open("boss_stats.csv")
	if err != nil {
		panic(err)
	}
	r, _ := csv.NewReader(bossStatsFile).ReadAll()

	records := map[string]*Record{}
	for _, fields := range r[1:] {
		var record Record

		record.Boss = fields[0]
		record.Position = strings.TrimSuffix(fields[1], "_slot")

		if record.Boss != record.Position {
			continue
		}

		record.Enemy = fields[2]

		record.Stats.Level, _ = strconv.Atoi(fields[3])
		record.Stats.HP, _ = strconv.Atoi(fields[4])
		record.Stats.XP, _ = strconv.Atoi(fields[5])
		record.Stats.GP, _ = strconv.Atoi(fields[6])
		record.Stats.AtkMult, _ = strconv.Atoi(fields[7])
		record.Stats.HitP, _ = strconv.Atoi(fields[8])
		record.Stats.Atk, _ = strconv.Atoi(fields[9])
		record.Stats.DefMult, _ = strconv.Atoi(fields[10])
		record.Stats.EvaP, _ = strconv.Atoi(fields[11])
		record.Stats.Def, _ = strconv.Atoi(fields[12])
		record.Stats.MDefMult, _ = strconv.Atoi(fields[13])
		record.Stats.MEvaP, _ = strconv.Atoi(fields[14])
		record.Stats.MDef, _ = strconv.Atoi(fields[15])
		record.Stats.MinSpeed, _ = strconv.Atoi(fields[16])
		record.Stats.MaxSpeed, _ = strconv.Atoi(fields[17])
		record.Stats.SpellPower, _ = strconv.Atoi(fields[18])

		if _, ok := records[record.Position]; ok {
			records[record.Position].Stats.HP += record.Stats.HP
			records[record.Position].Stats.XP += record.Stats.XP
			records[record.Position].Stats.GP += record.Stats.GP
		} else {
			records[record.Position] = &record
		}
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	encoder.Encode(&records)
}
