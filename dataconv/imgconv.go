package main

import (
	"fmt"
	"image"
	"image/png"
	"os"
)

type Icon struct {
	x    int
	y    int
	name string
}

var icons = []Icon{
	Icon{x: 0, y: 0, name: "claw"},
	Icon{x: 1, y: 0, name: "rod"},
	Icon{x: 2, y: 0, name: "staff"},
	Icon{x: 3, y: 0, name: "darksword"},
	Icon{x: 4, y: 0, name: "sword"},
	Icon{x: 5, y: 0, name: "katana"},
	Icon{x: 6, y: 0, name: "knife"},
	Icon{x: 0, y: 1, name: "whip"},
	Icon{x: 1, y: 1, name: "axe"},
	Icon{x: 2, y: 1, name: "shuriken"},
	Icon{x: 3, y: 1, name: "boomerang"},
	Icon{x: 4, y: 1, name: "harp"},
	Icon{x: 5, y: 1, name: "wrench"},
	Icon{x: 6, y: 1, name: "potion"},
	Icon{x: 0, y: 2, name: "bow"},
	Icon{x: 1, y: 2, name: "arrow"},
	Icon{x: 2, y: 2, name: "shield"},
	Icon{x: 3, y: 2, name: "helmet"},
	Icon{x: 4, y: 2, name: "armor"},
	Icon{x: 5, y: 2, name: "shirt"},
	Icon{x: 6, y: 2, name: "gauntlet"},
	Icon{x: 0, y: 2, name: "ring"},
	Icon{x: 1, y: 2, name: "callmagic"},
	Icon{x: 2, y: 2, name: "tent"},
	Icon{x: 3, y: 2, name: "plus"},
	Icon{x: 4, y: 2, name: "spear"},
}

func main() {
	f, err := os.Open("icons.png")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	rawImg, err := png.Decode(f)
	if err != nil {
		panic(err)
	}

	img := rawImg.(*image.NRGBA)

	for _, icon := range icons {
		x := icon.x * 20
		y := icon.y * 20
		r := image.Rect(x, y, x+16, y+16)
		iconImg := img.SubImage(r)

		iconFile, err := os.OpenFile(fmt.Sprintf("icon/%s.png", icon.name),
			os.O_RDWR|os.O_CREATE, 0644)
		if err != nil {
			panic(err)
		}

		err = png.Encode(iconFile, iconImg)
		if err != nil {
			panic(err)
		}
		iconFile.Close()

	}

}
