package chatgpt

import (
	"context"
	"fmt"
	"github.com/sashabaranov/go-openai"
)

type Model string

var (
	Gpt4 Model = openai.GPT4
	Gpt3 Model = openai.GPT3Dot5Turbo
)

type ChatGpt struct {
	client *openai.Client
	model  Model
}

func NewChatGpt(apiKey string, model Model) (*ChatGpt, error) {
	client := openai.NewClient(apiKey)
	return &ChatGpt{client: client, model: model}, nil
}

func (c *ChatGpt) Ask(prompt string) (string, error) {
	resp, err := c.client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: string(c.model),
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return "", nil
	}

	return resp.Choices[0].Message.Content, nil
}
