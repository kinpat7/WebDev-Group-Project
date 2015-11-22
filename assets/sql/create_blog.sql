create table if not exists blog (
	id int(11) not null auto_increment,
	title text not null,
	description text not null,
	primary key(id)
);

insert into blog (title, description) values ('Development Begins', 'Development begins on Cipher-com. A small scale project for encrypting text data. This app will allow you to input a phrase and encrypt it using classical ciphers. Currently the only supported cipher is the Caesar cipher. Which will encrypt the text using a simple mono alphabetic substition');

insert into blog (title, description) values ('Second Post', 'This is the second post on the blog');