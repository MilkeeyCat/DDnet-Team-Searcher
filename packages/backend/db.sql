-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(225) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tier SMALLINT NOT NULL ,
    verified SMALLINT NOT NULL DEFAULT 0 -- 0 or 1
);

-- Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(24) NOT NULL DEFAULT '#fff',
    url VARCHAR(255) DEFAULT NULL,
    can_delete_happenings SMALLINT DEFAULT 0,
    can_edit_posts SMALLINT DEFAULT 0,
    can_ban SMALLINT DEFAULT 0,
    can_create_roles SMALLINT DEFAULT 0
);

-- Game Servers Table
CREATE TABLE servers (
    id BIGSERIAL PRIMARY KEY,
    pid INT DEFAULT NULL,
    file VARCHAR(255) NOT NULL,
    password VARCHAR(255) DEFAULT NULL,
    ip VARCHAR(255) NOT NULL,
    port INT NOT NULL
);

-- Users Roles
CREATE TABLE users_roles (
    user_id BIGINT,
    role_id INT,
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

INSERT INTO roles (name, color, can_delete_happenings, can_edit_posts, can_ban, can_create_roles) VALUES('admin', '#ff0000A1', 1, 1, 1, 1);

DO $$ BEGIN
    CREATE TYPE happening_type AS ENUM('run', 'event');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Here's stored runs and events
CREATE TABLE happenings (
    id BIGSERIAL PRIMARY KEY,
    author_id INT NOT NULL,
    place SMALLINT NOT NULL, -- 0 or 1, 0 - our super puper duper custom servers, 1 - anywhere else
    map_name VARCHAR(255) NOT NULL,
    teamsize SMALLINT NOT NULL,
    description TEXT DEFAULT NULL,
    status SMALLINT DEFAULT 0, -- 0 - didnt start, 1 - happening rn, 2 - finished, 3 - canceled
    server_id SMALLINT DEFAULT NULL,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP DEFAULT NULL,
    thumbnail VARCHAR(255) DEFAULT NULL,
    type happening_type,
    FOREIGN KEY(author_id)
		REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(server_id)
        REFERENCES servers(id)
        ON DELETE SET NULL
);

-- Table to indicate interested players =]
CREATE TABLE interested_happenings (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    happening_id INT NOT NULL,
    in_team SMALLINT NOT NULL DEFAULT 0, -- 0 or 1
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(happening_id)
        REFERENCES happenings(id)
        ON DELETE CASCADE
);

CREATE TABLE reviews(
    id BIGSERIAL PRIMARY KEY,
    author_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    happening_id INT NOT NULL,
    text VARCHAR(300) DEFAULT NULL,
    rate SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(reviewed_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(happening_id)
        REFERENCES happenings(id)
        ON DELETE CASCADE
);