create table if not exists comments (
    id int(11) not null auto_increment,
    header varchar(64) not null,
    body text not null,
    posted datetime not null,
    post int(11) not null,
    comment int(11),
    primary key(id),
    foreign key(post) references blog(id),
    foreign key(comment) references comments(id)
);