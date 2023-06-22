package chatgpt

import (
	"fmt"
	"os"
	"strings"
)

const prompt = "Classify the following chat message as Neutral, Violent, Hate Speech or Sexual in nature. Provide just the classification as your answer.\n"

func Classifier(text string, model Model) (string, error) {
	apiKey := os.Getenv("API_KEY")

	// sanitise the input text
	text = strings.Trim(text, "`")

	if len(text) > 255 {
		text = text[:255]
	}

	q := fmt.Sprintf("%s\n```\n%s\n```\n", prompt, text)
	c, err := NewChatGpt(apiKey, model)
	answer, err := c.Ask(q)

	if err != nil {
		fmt.Printf("Error happened: %v\n", err)
		return "", err
	}
	answer, _ = strings.CutSuffix(answer, ".")
	return answer, nil
}
