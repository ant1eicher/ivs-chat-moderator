package main

import (
	"context"
	"fmt"
	"github.com/ant1eicher/moderator/lambdas/pkg/chatgpt"
	"github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
	MessageId  string
	Content    string
	Attributes map[string]string
	RoomArn    string
	Sender     Sender
}

type Response struct {
	ReviewResult string
	Content      string
	Attributes   map[string]string
}

type Sender struct {
	UserId     string
	Ip         string
	Attributes map[string]string
}

func main() {
	lambda.Start(HandleRequest)
}

func HandleRequest(ctx context.Context, request Request) (Response, error) {

	fmt.Printf("Moderating text using GPT-3.5 %s\n", request.Content)
	ans, err := chatgpt.Classifier(request.Content, chatgpt.Gpt3)

	if err != nil {
		return Response{}, err
	}

	if ans == "Neutral" {
		return Response{
			ReviewResult: "ALLOW",
			Content:      request.Content,
		}, nil
	}

	return Response{
		ReviewResult: "ALLOW",
		Content:      "Text was flagged as inappropriate: " + ans,
	}, nil
}
