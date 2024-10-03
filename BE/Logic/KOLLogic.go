package Logic

import (
    "fmt"
    "log"
    "wan-api-kol-event/DTO"
    "wan-api-kol-event/Initializers"
)

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

    // Convert boolean fields to string representations
    for _, kol := range kols {
        if kol.VerificationStatus == "true" {
            kol.VerificationStatus = "Verified"
        } else {
            kol.VerificationStatus = "Pending"
        }

        if kol.LivenessStatus == "true" {
            kol.LivenessStatus = "Passed"
        } else {
            kol.LivenessStatus = "Failed"
        }
    }

    return kols, nil
}