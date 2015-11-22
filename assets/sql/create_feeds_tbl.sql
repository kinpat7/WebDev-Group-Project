create table if not exists feeds (
    id int(11) not null auto_increment,
    title varchar(20) not null,
    description text not null,
    link varchar(255) not null,
    image varchar(255) not null,
    primary key(id)
);

insert into feeds (
    title, description, link, image
) values (
    'First RSS Feed', 'This is the first dynamically generated rss feed', 'https://cipher-com.herokuapp.com/',
    'http://localhost/public/res/img/brand_logo_new.png'
);

insert into feeds (
    title, description, link, image
) values (
    'Second RSS Feed', 'This is the second dynamically generated rss feed', 'https://cipher-com.herokuapp.com/',
    'http://localhost/public/res/img/brand_logo_new.png'
);
insert into feeds (
    title, description, link, image
) values (
    'Third RSS Feed', 'This is the third dynamically generated rss feed', 'https://cipher-com.herokuapp.com/',
    'http://localhost/public/res/img/brand_logo_new.png'
);
