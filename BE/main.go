package handler

import (
	"net/http"
	"wan-api-kol-event/Controllers"
	"wan-api-kol-event/Initializers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Handler function that Vercel will use
func Handler(w http.ResponseWriter, r *http.Request) {
	Initializers.ConnectToDB()
	router := gin.Default()

	// Add CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Define your routes
	router.GET("/kols", Controllers.GetKolsController)
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	// router.GET("/kols-count", Controllers.GetKolsCountController)
	router.ServeHTTP(w, r)
}

// package main

// import (
// 	"log"
// 	"net/http"
// 	"wan-api-kol-event/Controllers"
// 	"wan-api-kol-event/Initializers"

// 	"github.com/gin-contrib/cors"
// 	"github.com/gin-gonic/gin"
// )

// func main() {
// 	// Load environment variables and connect to the database
// 	Initializers.LoadEnvironmentVariables()
// 	Initializers.ConnectToDB()

// 	// Create a Gin router
// 	router := gin.Default()

// 	// Configure CORS to allow all origins
// 	config := cors.DefaultConfig()
// 	config.AllowAllOrigins = true // Cho phép tất cả các nguồn (origins)
// 	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
// 	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}

// 	// Apply the CORS middleware
// 	router.Use(cors.New(config))

// 	// Define your routes
// 	router.GET("/kols", Controllers.GetKolsController)
// 	router.GET("/ping", func(c *gin.Context) {
// 		c.JSON(http.StatusOK, gin.H{
// 			"message": "pong",
// 		})
// 	})

// 	// Run the server on port 8080
// 	if err := router.Run(":8080"); err != nil {
// 		log.Fatalf("Failed to run server: %v", err)
// 	}
// }
