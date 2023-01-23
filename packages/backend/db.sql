-- Users Table
CREATE TABLE users (
    id BIGSERIAL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(225) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tier SMALLINT
);

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


-- Interested Table
CREATE TABLE interested_runs (
    id BIGSERIAL,
    user_id INT NOT NULL,
    run_id INT NOT NULL,
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