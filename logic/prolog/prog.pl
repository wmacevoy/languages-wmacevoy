:- dynamic likes/2.
:- dynamic food/1.
:- dynamic activity/1.

likes(mike,cheese).
likes(mike,kites).
likes(mike,bikes).

likes(mary,bikes).
likes(mary,grapes).

food(cheese).
food(grapes).

activity(kites).
activity(bikes).

dislike(Person,Thing) :- retract(likes(Person,Thing)).
like(Person,Thing) :- assert(likes(Person,Thing)).


play(Thing) :- activity(Thing),likes(mike,Thing),likes(mary,Thing).
cook(Thing) :- food(Thing),likes(mike,Thing),likes(mary,Thing).
