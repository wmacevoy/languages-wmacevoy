build:
	docker compose build
up:
	docker compose up -d --build
logs:
	docker logs hangman-app -f
down:
	docker compose down
shell:
	docker exec -it hangman-app bash -i
reset:
	docker compose down -v
	/bin/rm -rf node_modules
	docker compose build --no-cache
hello.o : hello.c hello.h
	gcc -o hello.o hello.c
hello : hello.o
	gcc -c -o hello hello.o