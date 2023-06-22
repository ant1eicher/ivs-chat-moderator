.DEFAULT_GOAL := build

fmt:
	go fmt ./lambdas/...
.PHONY:fmt

lint: fmt
	golint ./lambdas/...
.PHONY:lint

vet: fmt
	go vet ./lambdas/...
	shadow ./lambdas/...
.PHONY: vet

review-handler: vet
	GOARCH=amd64 GOOS=linux go build -o ./lambdas/cmd/review-handler/main ./lambdas/cmd/review-handler
.PHONY: review-handler

fix:
	npm run fix

build-ts:
	npm run check

build: review-handler build-ts
	cdk synth

deploy-cdk: build
	cdk deploy --all
.PHONY: deploy-cdk

deploy-yolo: build
	cdk deploy --all --require-approval never
.PHONY: deploy-yolo

deploy-hotswap: build
	cdk deploy --all --hotswap
.PHONY: deploy-cdk
