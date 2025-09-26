create database voice;
use voice;
CREATE TABLE url (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) UNIQUE   -- url 컬럼 중복 허용 안 함
);
select * from url;

create table users(
	id int auto_increment primary key,
    name varchar(50),
    email varchar(50) unique,
    phone varchar(50) unique,
    passwd varchar(200)
);
select * from users;

CREATE TABLE refresh_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(200) NOT NULL UNIQUE,
    expiry_date DATETIME NOT NULL,
    user_id INT NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE social_account (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,
    userid INT,
    FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE summary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    summary_text TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

select * from refresh_token;
select * from social_account;
select * from summary;

drop table summary;