package Controllers

import (
	"net/http"
	"strconv"
	"wan-api-kol-event/Const"
	"wan-api-kol-event/Logic"
	"wan-api-kol-event/ViewModels"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetKolsController(context *gin.Context) {
	var KolsVM ViewModels.KolViewModel
	var guid = uuid.New().String()

	// * Get Kols from the database based on the range of pageIndex and pageSize
	// * TODO: Implement the logic to get parameters from the request
	// ? If parameter passed in the request is not valid, return the response with HTTP Status Bad Request (400)
	// @params: pageIndex
	// @params: pageSize
	// Get pageIndex and pageSize from query parameters
	pageIndexStr := context.Query("pageIndex")
	pageSizeStr := context.Query("pageSize")

	// Convert query parameters to integers
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
	// * Perform Logic Here
	// ! Pass the parameters to the Logic Layer
	kols, error := Logic.GetKolLogic(pageIndex, pageSize)
	if error != nil {
		KolsVM.Result = Const.UnSuccess
		KolsVM.ErrorMessage = error.Error()
		KolsVM.PageIndex = int64(pageIndex) // * change this to the actual page index from the request
		KolsVM.PageSize = int64(pageSize)   // * change this to the actual page size from the request
		KolsVM.Guid = guid
		context.JSON(http.StatusInternalServerError, KolsVM)
		return
	}

	// * Return the response after the logic is executed
	// ? If the logic is successful, return the response with HTTP Status OK (200)
	KolsVM.Result = Const.Success
	KolsVM.ErrorMessage = ""
	KolsVM.PageIndex = int64(pageIndex) // * change this to the actual page index from the request
	KolsVM.PageSize = int64(pageSize)   // * change this to the actual page size from the request
	KolsVM.Guid = guid
	KolsVM.KOL = kols
	KolsVM.TotalCount = int64(len(kols))
	context.JSON(http.StatusOK, KolsVM)
}
// func GetKolsCountController(context *gin.Context) {
//     count, err := Logic.CountKolsLogic()
//     if err != nil {
//         context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }
//     context.JSON(http.StatusOK, gin.H{"count": count})
// }

