package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strconv"
)

type Item struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Icon     string `json:"icon"`
	Rarity   string `json:"rarity,omitempty"`
	ShopType string `json:"shop_type,omitempty"`
	Key      string `json:"key,omitempty"`
}

var keyItems = map[string]string{
	"Legend Sword":     "legend_sword",
	"Spoon":            "spoon",
	"Crystal":          "crystal",
	"Pass":             "pass",
	"Package":          "package",
	"Baron Key":        "baron-key",
	"SandRuby":         "sand-ruby",
	"Earth Crystal":    "earth-crystal",
	"Magma Key":        "magma-key",
	"Luca Key":         "luca-key",
	"TwinHarp":         "twin-harp",
	"Darkness Crystal": "darkness-crystal",
	"Rat Tail":         "rat-tail",
	"Adamant":          "adamant",
	"Pan":              "pan",
	"Pink Tail":        "pink-tail",
	"Tower Key":        "tower_key",
}

var removedItems = map[string]bool{
	"Medusa Sword": true,
}

var rarityNameExceptions = map[string]string{
	"FireClaw Claw":   "Fire Claw",
	"IceClaw Claw":    "Ice Claw",
	"Charm Claw":      "Fairy Claw",
	"CatClaw Claw":    "Cat Claw",
	"Rod Rod":         "Rod",
	"IceRod Rod":      "Ice Rod",
	"FlameRod Rod":    "Flame Rod",
	"Staff Staff":     "Staff",
	"Excalibur Sword": "Excalibur",
	"IceBrand Sword":  "IceBrand",
	"Defense Sword":   "Defender",
	"Medusa Sword":    "Medusa Sword",
	"Spear Spear":     "Spear",
	"Murasame Katana": "Murasame",
	"Masamune Katana": "Masamune",
	"Assassin Knife":  "Assassin Dagger",
	"Whip Whip":       "Whip",
	"HandAxe Axe":     "Hand Axe",
	"Dancing Knife":   "Dancing Dagger",
	"Ninja":           "Ninja Shuriken",
	"Boomrang":        "Boomerang",
	"FullMoon":        "Full Moon",
	"RuneAxe Axe":     "Rune Axe",
	"ShortBow Bow":    "Short Bow",
	"CrossBow Bow":    "Cross Bow",
	"GreatBow Bow":    "Great Bow",
	"ElvenBow Bow":    "Elven Bow",
	"Cap Helm":        "Cap",
	"Leather Helm":    "Leather Cap",
	"Gaea Helm":       "Gaea Cap",
	"Wizard Helm":     "WIzard Hat",
	"Tiara Helm":      "Tiara",
	"Ribbon Helm":     "Ribbon",
	"Headband Helm":   "Headband",
	"Bandanna Helm":   "Bandanna",
	"Ninja Helm":      "Ninja Hat",
	"Glass Helm":      "Glass Mask",
	"Cloth Robe":      "Cloth",
	"Prisoner Robe":   "Prisoner Clothes",
	"Bard Robe":       "Bard Clothes",
	"Karate Robe":     "Karate Suit",
	"Bl.Belt Robe":    "Black Belt",
	"Ninja Robe":      "Ninja Gear",
	"IronRing Ring":   "Iron Ring",
	"RubyRing Ring":   "Ruby Ring",
	"BigBomb":         "Big Bomb",
	"Hermes":          "Hermes Shoes",
	"Lit-Bolt":        "LitBolt",
	"MuteBell":        "Mute Bell",
	"GaiaDrum":        "Gaia Drum",
	"Eyedrops":        "EyeDrops",
	"Heal":            "Remedy",
	"Levia":           "Leviatan",
	"Baham":           "Bahamut",

	// Key Items
	"Spoon Knife":     "Spoon",
	"Crystal Crystal": "Crystal",
	"TwinHarp Harp":   "TwinHarp",
}

func (i *Item) RarityName() string {
	name := i.Name

	switch i.Icon {
	case "claw":
		name += " Claw"
	case "rod":
		name += " Rod"
	case "staff":
		name += " Staff"
	case "darksword":
		name += " Sword"
	case "lightsword":
		name += " Sword"
	case "sword":
		name += " Sword"
	case "spear":
		name += " Spear"
	case "katana":
		name += " Katana"
	case "knife":
		name += " Knife"
	case "whip":
		name += " Whip"
	case "axe":
		name += " Axe"
	case "harp":
		name += " Harp"
	case "wrench":
		name += " Hammer"
	case "bow":
		name += " Bow"
	case "arrow":
		name += " Arrow"
	case "shield":
		name += " Shield"
	case "helmet":
		name += " Helm"
	case "armor":
		name += " Armor"
	case "shirt":
		name += " Robe"
	case "gauntlet":
		name += " Gauntlet"
	case "ring":
		name += " Ring"
	case "crystal":
		name += " Crystal"
	case "key":
		name += " Key"
	case "tail":
		name += " Tail"
	}

	if exception, ok := rarityNameExceptions[name]; ok {
		return exception
	}

	return name
}

var rarityNameRe = regexp.MustCompile(`\**$`)

func addInfo(rarities map[string]string, itemTypes map[string]string, rarity string, t string, name string) {
	name = rarityNameRe.ReplaceAllString(name, "")
	rarities[name] = rarity
	itemTypes[name] = t
}
func main() {
	itemRarityFile, err := os.Open("itemrarity.csv")
	if err != nil {
		panic(err)
	}
	records, _ := csv.NewReader(itemRarityFile).ReadAll()
	rarities := map[string]string{}
	itemTypes := map[string]string{}
	for _, record := range records[6:39] {
		addInfo(rarities, itemTypes, "common", "item", record[0])
		addInfo(rarities, itemTypes, "common", "weapon", record[1])
		addInfo(rarities, itemTypes, "common", "ammo", record[2])
		addInfo(rarities, itemTypes, "common", "armor", record[3])

		addInfo(rarities, itemTypes, "uncommon", "item", record[5])
		addInfo(rarities, itemTypes, "uncommon", "weapon", record[6])
		addInfo(rarities, itemTypes, "uncommon", "ammo", record[7])
		addInfo(rarities, itemTypes, "uncommon", "armor", record[8])

		addInfo(rarities, itemTypes, "rare", "item", record[10])
		addInfo(rarities, itemTypes, "rare", "weapon", record[11])
		addInfo(rarities, itemTypes, "rare", "ammo", record[12])
		addInfo(rarities, itemTypes, "rare", "armor", record[13])

		addInfo(rarities, itemTypes, "ultrarare", "item", record[15])
		addInfo(rarities, itemTypes, "ultrarare", "weapon", record[16])
		addInfo(rarities, itemTypes, "ultrarare", "armor", record[17])
	}

	// Not listed in spread sheet.
	addInfo(rarities, itemTypes, "common", "armor", "Shadow Shield")

	itemsFile, err := os.Open("items.csv")
	if err != nil {
		panic(err)
	}

	records, _ = csv.NewReader(itemsFile).ReadAll()

	var items []*Item
	r := regexp.MustCompile(`\[(.*)\](.*)`)
	idAdjust := 0
	for i, record := range records[1:] {
		strs := r.FindStringSubmatch(record[0])

		item := &Item{}
		item.Id = i - idAdjust
		if strs != nil {
			item.Name = strs[2]
			item.Icon = strs[1]
		} else {
			item.Name = record[0]
			item.Icon = ""
		}

		if _, ok := removedItems[item.RarityName()]; ok {
			idAdjust++
			continue
		}

		item.Price, _ = strconv.Atoi(record[1])

		known := false
		if rarity, ok := rarities[item.RarityName()]; ok {
			item.Rarity = rarity
			known = true
		}

		if t, ok := itemTypes[item.RarityName()]; ok {
			if t == "ammo" {
				t = "weapon"
			}
			item.ShopType = t
			known = true
		}

		if ki, ok := keyItems[item.RarityName()]; ok {
			item.Key = ki
			known = true
		}
		if !known {
			fmt.Fprintf(os.Stderr, "Can't find \"%s\"\n", item.RarityName())
		}
		items = append(items, item)
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	encoder.Encode(&items)

}
