-- Users Table
CREATE TABLE users (
    id BIGSERIAL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(225) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tier SMALLINT NOT NULL,
    verified SMALLINT NOT NULL DEFAULT 0 -- 0 or 1
);

-- Roles Table
CREATE TABLE roles (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(24) NOT NULL DEFAULT '#fff',
    url VARCHAR(255) DEFAULT NULL,
    can_delete_happenings SMALLINT,
    can_edit_posts SMALLINT,
    can_ban SMALLINT,
    can_create_roles SMALLINT
);

--Users Roles
CREATE TABLE users_roles (
    user_id BIGINT,
    role_id INT
);

INSERT INTO roles (name, color, can_delete_happenings, can_edit_posts, can_ban, can_create_roles) VALUES('admin', '#ff0000A1', 1, 1, 1, 1);

-- Place Enum: 0 - our servers, 1 - other place
DO $$ BEGIN
    CREATE TYPE place AS ENUM('0', '1');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Run status Enum: 0 - didnt start, 1 - happening rn, 2 - finished, 3 - canceled
DO $$ BEGIN
    CREATE TYPE run_status AS ENUM('0', '1', '2', '3'); -- i dont fucking know why i did strings and not integers :\
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;


-- Runs Table
CREATE TABLE runs (
    id BIGSERIAL,
    author_id INT NOT NULL,
    place place,
    map_name VARCHAR(255) NOT NULL,
    teamsize INT NOT NULL,
    description TEXT DEFAULT NULL,
    start_at TIMESTAMP NOT NULL,
    status run_status DEFAULT '0',
    server_id INT DEFAULT NULL
);

-- Events Table
CREATE TABLE events (
    id BIGSERIAL,
    author_id INT NOT NULL,
    place place,
    map_name VARCHAR(255) NOT NULL,
    teamsize INT NOT NULL,
    description TEXT DEFAULT NULL,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP DEFAULT NULL,
    thumbnail VARCHAR(255) DEFAULT NULL,
    status run_status DEFAULT '0',
    server_id INT DEFAULT NULL
);


-- Interested Runs Table
CREATE TABLE interested_runs (
    id BIGSERIAL,
    user_id INT NOT NULL,
    run_id INT NOT NULL,
    in_team INT NOT NULL DEFAULT 0
);

-- Interested Events Table
-- Im creating 2 absolutely same tables 🤔, maybe i can put the data in one table some how ¯\_(ツ)_/¯
CREATE TABLE interested_events (
    id BIGSERIAL,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    in_team INT NOT NULL DEFAULT 0
);

-- Game Servers Table
CREATE TABLE servers (
    id BIGSERIAL,
    pid INT DEFAULT NULL,
    file VARCHAR(255) NOT NULL,
    password VARCHAR(255) DEFAULT NULL,
    ip VARCHAR(255) NOT NULL,
    port INT NOT NULL
);