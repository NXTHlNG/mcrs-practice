package converter

import (
	"fmt"
	"github.com/xuri/excelize/v2"
	"server/internal/model"
)

const (
	firstColumnName = "Пользователь"
	sheet           = "Sheet1"
)

func ToExcel(answers []model.Answer) (string, error) {
	f := excelize.NewFile()
	defer f.Close()
	if len(answers) == 0 {
		return "", fmt.Errorf("not found resource")
	}

	cell, _ := excelize.CoordinatesToCellName(1, 1)
	_ = f.SetCellValue(sheet, cell, firstColumnName)

	for i := 1; i < len(answers[0].Items)+1; i++ {
		v := answers[0].Items[i-1].Title
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		_ = f.SetCellValue(sheet, cell, v)
	}

	for i, answer := range answers {
		cell, _ := excelize.CoordinatesToCellName(1, i+2)
		err := f.SetCellValue(sheet, cell, answer.UserId)
		if err != nil {
			return "", fmt.Errorf("bad data format")
		}

		for j, item := range answer.Items {
			cell, err := excelize.CoordinatesToCellName(j+2, i+2)
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
