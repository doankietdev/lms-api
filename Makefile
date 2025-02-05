.PHONY: help up down restart

help:
	@grep -E '^[1-9a-zA-Z_-]+:.*?## .*$$|(^#--)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-43s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

#-- Docker

up: ## Up the container images
	docker compose --env-file .env --env-file .env.local --env-file .env.development.local up -d

down: ## Down the container images
	docker compose down

restart: down up ## Restart the container images
