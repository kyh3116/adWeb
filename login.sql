
CREATE DATABASE IF NOT EXISTS yong_database CHARACTER SET utf8 COLLATE utf8_bin;
USE yong_database;

CREATE TABLE IF NOT EXISTS user (
  id int(12) NOT NULL auto_increment primary key,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS shoppingmall (
  id int(12) NOT NULL auto_increment primary key,
  mallname varchar(50) NOT NULL,
  link varchar(255) NOT NULL,
  sales_commission varchar(50) NOT NULL,
  regular_fare varchar(50) NOT NULL,
  difficulty_level_of_entry varchar(50) NOT NULL,
  entry_tip varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

//alter table user modify id int not null auto_increment primary key;

INSERT INTO user (id, username, password, email) VALUES (1, 'test', 'test', 'test@test.com');
INSERT INTO user (username, password, email) VALUES ('test2', 'test2', 'test2@test.com');


INSERT INTO shoppingmall (id, mallname, link, sales_commission, regular_fare, difficulty_level_of_entry, entry_tip) VALUES (1, '네이버 스마트스토어', 'https://sell.smartstore.naver.com/', '기본 4.2% 네이버 쇼핑 및 카드 수수료 포함시 최대 6.4%','없음','쉬움 누구나 입점가능','무료 강의가 많음. 잘 따라하면 높은 매출 가능');
INSERT INTO shoppingmall (mallname, link, sales_commission, regular_fare, difficulty_level_of_entry, entry_tip) VALUES ('카카오 쇼핑', 'https://store-sell.kakao.com/', '4%','없음','쉬움 누구나 입점 가능','공식 블로그 등 교육 자료가 잘 되어있음');