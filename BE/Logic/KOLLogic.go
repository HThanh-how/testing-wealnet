package Logic

import (
	"fmt"
	"log"
	"wan-api-kol-event/DTO"
	"wan-api-kol-event/Initializers"
)

// * Get Kols from the database based on the range of pageIndex and pageSize
// ! USE GORM TO QUERY THE DATABASE
// ? There are some support function that can be access in Utils folder (/BE/Utils)
// --------------------------------------------------------------------------------
// @params: pageIndex
// @params: pageSize
// @return: List of KOLs and error message
func GetKolLogic(pageIndex int, pageSize int) ([]*DTO.KolDTO, error) {
	var kols []*DTO.KolDTO

	// Ensure the database connection is established
	if Initializers.DB == nil {
		log.Println("Database connection is not established. Attempting to connect...")
		Initializers.ConnectToDB()
		if Initializers.DB == nil {
			return nil, fmt.Errorf("failed to establish database connection")
		}
	}

	offset := (pageIndex - 1) * pageSize
	if err := Initializers.DB.Offset(offset).Limit(pageSize).Find(&kols).Error; err != nil {
		return nil, err
	}

	return kols, nil
}
