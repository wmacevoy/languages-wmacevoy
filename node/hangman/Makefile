build:
	docker compose build
up:
	docker compose up -d --build
logs:
	docker logs hangman-app -f
.PHONY: tests
tests:
	docker logs -f hangman-test-runner
down:
	docker compose down
shell:
	docker exec -it hangman-app bash -i
