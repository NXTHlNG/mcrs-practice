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

	// create file
	f := excelize.NewFile()
	defer f.Close()
	if len(answers) == 0 {
		return "", fmt.Errorf("not found resource")
	}

	// answers to exel
	var haveMulti bool

	for _, item := range answers[0].Items {
		if item.Type == model.Multi {
			haveMulti = true
			break
		}
	}

	rowOffset := 1
	columnOffset := 1

	for i, item := range answers[0].Items {
		if item.Type != model.Multi {
			h, _ := excelize.CoordinatesToCellName(i+columnOffset, rowOffset)
			_ = f.SetCellValue(sheet, h, item.Title)

			if haveMulti {
				v, _ := excelize.CoordinatesToCellName(i+columnOffset, rowOffset+1)
				_ = f.MergeCell(sheet, h, v)
			}
		} else {
			h, _ := excelize.CoordinatesToCellName(i+columnOffset, rowOffset)
			_ = f.SetCellValue(sheet, h, item.Title)

			multiAnswers, ok := item.Value.([]model.AnswerItem)

			if !ok {
				return "", fmt.Errorf("erorr cast item value with type %s to []AnswerItem ", item.Type)
			}

			v, _ := excelize.CoordinatesToCellName(i+columnOffset+len(multiAnswers)-1, rowOffset)
			_ = f.MergeCell(sheet, h, v)

			for j, a := range multiAnswers {
				cell, _ := excelize.CoordinatesToCellName(i+j+columnOffset, rowOffset+1)
				_ = f.SetCellValue(sheet, cell, a.Title)
			}

			columnOffset += len(multiAnswers) - 1
		}
	}

	rowOffset = 2

	if haveMulti {
		rowOffset = 3
	}

	for i, answer := range answers {
		columnOffset = 1
		for j, item := range answer.Items {

			if item.Type != model.Multi {
				cell, _ := excelize.CoordinatesToCellName(j+columnOffset, i+rowOffset)
				_ = f.SetCellValue(sheet, cell, item.Value)
			} else {
				multiAnswers, ok := item.Value.([]model.AnswerItem)

				if !ok {
					return "", fmt.Errorf("erorr cast item value with type %s to []AnswerItem ", item.Type)
				}

				for k, a := range multiAnswers {
					cell, _ := excelize.CoordinatesToCellName(k+j+columnOffset, i+rowOffset)
					_ = f.SetCellValue(sheet, cell, a.Value)
				}

				columnOffset += len(multiAnswers) - 1
			}

		}
	}

	// save file
	if err := f.SaveAs("answer.xlsx"); err != nil {
		fmt.Println(err)
	}

	return f.Path, nil
}
