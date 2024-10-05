package Controllers

import (
	"net/http"
	"strconv"
	"wan-api-kol-event/Const"
	"wan-api-kol-event/DTO"
	"wan-api-kol-event/Logic"
	"wan-api-kol-event/ViewModels"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetKolsController(context *gin.Context) {
	var KolsVM ViewModels.KolViewModel
	var guid = uuid.New().String()

	pageIndexStr := context.Query("pageIndex")
	pageSizeStr := context.Query("pageSize")

	pageIndex, err := strconv.Atoi(pageIndexStr)
	if err != nil || pageIndex < 1 {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pageIndex"})
		return
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pageSize"})
		return
	}

	kols, error := Logic.GetKolLogic()
	if error != nil {
		KolsVM.Result = Const.UnSuccess
		KolsVM.ErrorMessage = error.Error()
		KolsVM.PageIndex = int64(pageIndex)
		KolsVM.PageSize = int64(pageSize)
		KolsVM.Guid = guid
		context.JSON(http.StatusInternalServerError, KolsVM)
		return
	}

	totalKols := len(kols)
	KolsVM.TotalCount = int64(totalKols)

	startIndex := (pageIndex - 1) * pageSize
	endIndex := startIndex + pageSize

	if endIndex > totalKols {
		endIndex = totalKols
	}

	// Slice the KOLs based on the calculated startIndex and endIndex
	if startIndex < totalKols {
		KolsVM.KOL = kols[startIndex:endIndex]
	} else {
		KolsVM.KOL = []*DTO.KolDTO{} // Return an empty list if pageIndex is out of range
	}

	// Set response fields
	KolsVM.Result = Const.Success
	KolsVM.ErrorMessage = ""
	KolsVM.PageIndex = int64(pageIndex)
	KolsVM.PageSize = int64(pageSize)
	KolsVM.Guid = guid

	// Return the paginated data as JSON
	context.JSON(http.StatusOK, KolsVM)
}
