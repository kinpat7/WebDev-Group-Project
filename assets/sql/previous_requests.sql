drop table if exists requests;

create table if not exists requests (
  id int(11) not null auto_increment,
  original text not null,
  encrypted text not null,
  requested datetime not null,
  ip varchar(32) not null,
  primary key(id)
);