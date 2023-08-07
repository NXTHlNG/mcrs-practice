package converter

import (
	"fmt"
	"github.com/xuri/excelize/v2"
	"server/internal/model"
)

const (
	sheet = "Sheet1"
)

func ToExcel(answers []model.Answer) (string, error) {
	f := excelize.NewFile()
	defer f.Close()
	if len(answers) == 0 {
		return "", fmt.Errorf("not found resource")
	}

	for i := 0; i < len(answers[0].Items); i++ {
		v := answers[0].Items[i].Title
		cell, _ := excelize.CoordinatesToCellName(i, 1)
		_ = f.SetCellValue(sheet, cell, v)
	}

	for i, answer := range answers {
		for j, item := range answer.Items {
			cell, err := excelize.CoordinatesToCellName(j+1, i+1)
			if err != nil {
				return "", fmt.Errorf("bad data format")
			}

			err = f.SetCellValue(sheet, cell, item.Value)
			if err != nil {
				return "", fmt.Errorf("bad data format")
			}
		}
	}

	if err := f.SaveAs("xyi.xlsx"); err != nil {
		fmt.Println(err)
	}

	return f.Path, nil
}
