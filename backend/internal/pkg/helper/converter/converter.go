package converter

import (
	"encoding/json"
	"fmt"
	"github.com/xuri/excelize/v2"
	"server/internal/model"
)

const (
	sheet = "Sheet1"
)

type checkboxAnswer []string

func (c checkboxAnswer) String() string {
	if len(c) == 0 {
		return ""
	}
	var res string

	for _, a := range c[:len(c)-1] {
		res += a + ","
	}

	res += c[len(c)-1]

	return res
}

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
			h, err := excelize.CoordinatesToCellName(i+columnOffset, rowOffset)
			if err != nil {
				return "", fmt.Errorf("failed to coord %d to %d: %v", i+columnOffset, rowOffset, err)
			}

			err = f.SetCellValue(sheet, h, item.Title)
			if err != nil {
				return "", fmt.Errorf("failed to set value %s: %v", item.Title, err)
			}

			if haveMulti {
				v, err := excelize.CoordinatesToCellName(i+columnOffset, rowOffset+1)
				if err != nil {
					return "", fmt.Errorf("failed to coord %d to %d: %v", i+columnOffset, rowOffset, err)
				}
				_ = f.MergeCell(sheet, h, v)
			}
		} else {
			h, err := excelize.CoordinatesToCellName(i+columnOffset, rowOffset)
			if err != nil {
				return "", fmt.Errorf("failed to coord %d to %d: %v", i+columnOffset, rowOffset, err)
			}

			err = f.SetCellValue(sheet, h, item.Title)
			if err != nil {
				return "", fmt.Errorf("failed to set value %s: %v", item.Title, err)
			}

			var multiAnswers []model.AnswerItem

			err = json.Unmarshal(item.Value, &multiAnswers)
			if err != nil {
				fmt.Println(err)
				continue
				// return "",
			}

			v, err := excelize.CoordinatesToCellName(i+columnOffset+len(multiAnswers)-1, rowOffset)
			if err != nil {
				return "", fmt.Errorf("failed to coord %d to %d: %v", i+columnOffset, rowOffset, err)
			}

			_ = f.MergeCell(sheet, h, v)

			for j, a := range multiAnswers {
				cell, err := excelize.CoordinatesToCellName(i+j+columnOffset, rowOffset+1)
				if err != nil {
					return "", fmt.Errorf("failed to coord %d to %d: %v", i+columnOffset, rowOffset, err)
				}
				err = f.SetCellValue(sheet, cell, a.Title)
				if err != nil {
					return "", fmt.Errorf("failed to set value %s: %v", a.Title, err)
				}
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

			switch item.Type {
			case model.Multi:
				var multiAnswers []model.AnswerItem

				err := json.Unmarshal(item.Value, &multiAnswers)

				if err != nil {
					fmt.Println(fmt.Errorf("failed encoding json: %v", err))
					continue
				}

				for k, a := range multiAnswers {
					switch a.Type {
					case model.Checkbox:
						var answers checkboxAnswer

						err := json.Unmarshal(a.Value, &answers)

						if err != nil {
							fmt.Println(fmt.Errorf("failed encoding json: %v", err))
							continue
						}

						cell, _ := excelize.CoordinatesToCellName(j+k+columnOffset, i+rowOffset)
						_ = f.SetCellValue(sheet, cell, answers)
						break
					default:
						var v string

						err := json.Unmarshal(a.Value, &v)

						if err != nil {
							fmt.Println(fmt.Errorf("failed encoding json: %v", err))
							continue
						}

						cell, _ := excelize.CoordinatesToCellName(j+k+columnOffset, i+rowOffset)
						_ = f.SetCellValue(sheet, cell, v)
						break
					}
				}

				columnOffset += len(multiAnswers) - 1
				break
			case model.Checkbox:
				var answers checkboxAnswer

				err := json.Unmarshal(item.Value, &answers)

				if err != nil {
					fmt.Println(fmt.Errorf("failed encoding json: %v", err))
					continue
				}

				cell, _ := excelize.CoordinatesToCellName(j+columnOffset, i+rowOffset)
				_ = f.SetCellValue(sheet, cell, answers)
			default:
				var v string

				err := json.Unmarshal(item.Value, &v)

				if err != nil {
					fmt.Println(fmt.Errorf("failed encoding json: %v", err))
					continue
				}

				cell, _ := excelize.CoordinatesToCellName(j+columnOffset, i+rowOffset)
				_ = f.SetCellValue(sheet, cell, v)
			}
		}
	}

	// save file
	if err := f.SaveAs("answer.xlsx"); err != nil {
		return "", fmt.Errorf("failed saving answer.xlsx: %v", err)
	}

	return f.Path, nil
}
