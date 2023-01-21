create table users (
    id UUID primary key not null default gen_random_uuid(),
    username varchar(255) unique not null,
    email varchar(255) unique not null,
    password varchar(255) not null
);

create table projects (
    id UUID primary key not null default gen_random_uuid(),
    name varchar(255) not null,
    user_id UUID not null references users(id)
);

create table allowlist (
    user_id UUID not null references users(id),
    project_id UUID not null references projects(id)
);

create table rooms (
    id serial primary key,
    name varchar(255) not null,
    project_id UUID not null references projects(id)
);

create table boxes (
    id serial primary key,
    name varchar(255) not null,
    room_id int not null references rooms(id)
);

create table items (
    id serial primary key,
    name varchar(255) not null,
    qty int not null,
    photo_url varchar(255) not null,
    box_id int not null references boxes(id)
);