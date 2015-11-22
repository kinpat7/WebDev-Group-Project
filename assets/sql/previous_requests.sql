drop table if exists requests;

create table if not exists requests (
  id int(11) not null auto_increment,
  original text not null,
  encrypted text not null,
  requested datetime not null,
  ip varchar(32) not null,
  primary key(id)
);

insert into requests ("original", "encrypted", "requested", "ip") values ('blah', 'blah', '2015/11/15', '46.25.64.89');

insert into requests ("original", "encrypted", "requested", "ip") values ('blah', 'blah', '15/11/2015', '46.25.64.89');