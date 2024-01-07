package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"
)

type Item struct {
	ID    int    `json:"id"`
	Description string `json:"description"`
	Price string `json:"price"`
}

func main() {
	var port string
	flag.StringVar(&port, "port", "8080", "port to listen on");
	flag.Parse()

	resp, err := http.Get("http://127.0.0.1:" + port + "/items")
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(100)
	}
	defer resp.Body.Close()

	items := []Item{}
	err = json.NewDecoder(resp.Body).Decode(&items)
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(100)
	}
	fmt.Println(items)
}