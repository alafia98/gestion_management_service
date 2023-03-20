CREATE DATABASE IF NOT EXISTS testing;
USE testing;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id          INT NOT NULL AUTO_INCREMENT,
    full_name   VARCHAR(50) DEFAULT NULL,
    email       VARCHAR(100) DEFAULT NULL,
    password    VARCHAR(255) DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT UQ_users_Email UNIQUE (email)
);

CREATE TABLE data (
    id              INT NOT NULL AUTO_INCREMENT,
    departement     VARCHAR(255) DEFAULT NULL,
    user            VARCHAR(50) DEFAULT NULL,
    materiel        VARCHAR(255) DEFAULT NULL,
    desc_materiel   VARCHAR(255) DEFAULT NULL,
    address_ip      VARCHAR(20) DEFAULT NULL,
    needs           TEXT DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
); 