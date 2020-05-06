drop table Leki;

create table Leki 
(
	Nazwa varchar2(2000) not null,
	Substancja_czynna varchar2(2000) not null,
	Postac  varchar2(2000) not null,
	Dawka  varchar2(2000) not null,
	Zawartosc_opakowania  varchar2(2000) not null,
	Kod_EAN varchar2(2000) not null,
	Poziom_odplatnosci varchar2(2000) not null,
	Zakres_objetych_refundacja varchar2(2000) not null,
	Wysokosc_doplaty numeric(19,4) not null
);

/*
  * Długości napisu równa 1000 to za mało, dałem 2000
  * Nie działają polskie znaki
  * Jeśli skrypt powinien inaczej wyglądać, to prześlij mi przerobiony, to wstawię
*/

