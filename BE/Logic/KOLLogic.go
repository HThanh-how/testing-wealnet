package Logic

import (
	"fmt"
	"log"
	"time"
	"wan-api-kol-event/DTO"
	"wan-api-kol-event/Initializers"
)

func GetKolLogic() ([]*DTO.KolDTO, error) {
	var kols []*DTO.KolDTO
	startTime := time.Now()

	// Ensure the database connection is established
	if Initializers.DB == nil {
		log.Println("Database connection is not established. Attempting to connect...")
		Initializers.ConnectToDB()
		if Initializers.DB == nil {
			return nil, fmt.Errorf("failed to establish database connection")
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////
	// 																					//
	// 	   * Get Kols from the database based on the range of pageIndex and pageSize 	//
	// 																					//
	//////////////////////////////////////////////////////////////////////////////////////

	// offset := (pageIndex - 1) * pageSize
	// for {
	// 	if err := Initializers.DB.Offset(offset).Limit(pageSize).Find(&kols).Error; err != nil {
	// 		// Check if 10 seconds have passed
	// 		if time.Since(startTime) > 10*time.Second {
	// 			return nil, fmt.Errorf("query failed after 10 seconds: %w", err)
	// 		}
	// 		// Wait for a short period before retrying
	// 		time.Sleep(100 * time.Millisecond)
	// 		continue
	// 	}
	// 	break
	// }

	//////////////////////////////////////////////////////////////////////////////////////
	// 																					//
	// 	 				SELECT * FROM DB											 	//
	// 																					//
	//////////////////////////////////////////////////////////////////////////////////////
	for {
		if err := Initializers.DB.Find(&kols).Error; err != nil {
			if time.Since(startTime) > 10*time.Second {
				return nil, fmt.Errorf("query failed after 10 seconds: %w", err)
			}
			time.Sleep(100 * time.Millisecond)
			continue
		}
		break
	}

	for _, kol := range kols {

		if kol.LivenessStatus == "true" {
			kol.LivenessStatus = "Passed"
		} else {
			kol.LivenessStatus = "Failed"
		}
		if kol.VerificationStatus == "true" {
			kol.VerificationStatus = "Verified"
		} else {
			kol.VerificationStatus = "Pending"
		}
	}

	return kols, nil
}

// func CountKolsLogic() (int64, error) {
//     var count int64
// 	startTime := time.Now()
// 	var kols []*DTO.KolDTO

//     for {
//         if err := Initializers.DB.Model(&kols).Count(&count).Error; err != nil {
//             if time.Since(startTime) > 10*time.Second {
//                 return 0, fmt.Errorf("query failed after 10 seconds: %w", err)
//             }
//             time.Sleep(100 * time.Millisecond)
//             continue
//         }
//         break
//     }

//     return count, nil
// }
