-- SQL SCRIPT
-- Create and Use Database
DROP DATABASE IF EXISTS auth;
CREATE DATABASE auth;
USE auth;

-- Create Table user
DROP TABLE IF EXISTS user;
CREATE TABLE user (id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                   username VARCHAR(255) UNIQUE NOT NULL,
                   first_name VARCHAR(255),
                   last_name VARCHAR(255));

-- Create Table user_auth
DROP TABLE IF EXISTS user_auth;
CREATE TABLE user_auth (username VARCHAR(255) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        active TINYINT(1) DEFAULT 1,
                        FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE);

-- Create User auth_user
DROP USER IF EXISTS auth_user;
CREATE USER IF NOT EXISTS 'auth_user'@'localhost' IDENTIFIED BY 'p@$sw0rd';

-- Grant All Privileges On user_auth Database to New User
-- You should only grant necessary privileges to this user but I got lazy
GRANT ALL ON `auth`.* TO 'auth_user'@'localhost';

-- Flush Privileges
FLUSH PRIVILEGES;
