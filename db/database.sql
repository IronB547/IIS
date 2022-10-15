CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM ('admin', 'user', 'city manager', 'technician') NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_num VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

#trigger to hash password
CREATE TRIGGER hash_password
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    SET NEW.password = SHA2(NEW.password, 256);
END;

CREATE TABLE Ticket (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    location,
    description VARCHAR(1023) NOT NULL,
    status ENUM ('open', 'waiting', 'solved', 'rejected') NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Service_request (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1023) NOT NULL,
    solution_time VARCHAR(255) DEFAULT '0',
    solution_state ENUM ('unsolved', 'solved') NOT NULL DEFAULT 'unsolved',
    time_spent VARCHAR(255) DEFAULT '0',
    technician_id INT NOT NULL,
    city_manager_id INT NOT NULL,
    PRIMARY KEY (id),
    ticket_id INT,
    FOREIGN KEY (ticket_id) REFERENCES Ticket(id)
);

CREATE TABLE Service_request_technician (
    service_request_id INT NOT NULL,
    technician_id INT NOT NULL,
    PRIMARY KEY (service_request_id, technician_id),
    FOREIGN KEY (service_request_id) REFERENCES Service_request(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Ticket_photo (
    id INT NOT NULL AUTO_INCREMENT,
    url VARCHAR(511) NOT NULL,
    ticket_id INT NOT NULL,
    PRIMARY KEY (id, ticket_id),
    FOREIGN KEY (ticket_id) REFERENCES Ticket(id) ON DELETE CASCADE
);

CREATE TABLE Ticket_comment (
    id INT NOT NULL AUTO_INCREMENT,
    comment VARCHAR(1023) NOT NULL,
    created_at DATETIME NOT NULL,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ticket_id) REFERENCES Ticket(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Service_request_comment (
    id INT NOT NULL AUTO_INCREMENT,
    comment VARCHAR(1023) NOT NULL,
    created_at DATETIME NOT NULL,
    service_request_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (service_request_id) REFERENCES Service_request(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);


#function to drop all tables
CREATE PROCEDURE delete_all_tables()
BEGIN
    DROP TABLE IF EXISTS Ticket_comment;
    DROP TABLE IF EXISTS Ticket_photo;
    DROP TABLE IF EXISTS Service_request_comment;
    DROP TABLE IF EXISTS Service_request_technician;
    DROP TABLE IF EXISTS Service_request;
    DROP TABLE IF EXISTS Ticket;
    DROP TABLE IF EXISTS Users;
END

#run the function
CALL delete_all_tables();

DELETE FROM Users where id = 1;


#insert sample data

INSERT INTO Users (username, password, user_type) VALUES ('admin', 'admin', 'admin', 'admin@admin.cz', '666666666');
INSERT INTO Users (username, password, user_type) VALUES ('Franta', 'Frantajebest', 'Franta.Pepa@seznam.cz', '786314245');
INSERT INTO Users (username, password, user_type) VALUES ('Standa', 'Standa123', 'Stanislav.Pokorny@gmail.cz', '626425286');

INSERT INTO Ticket (title, description, status, user_id) VALUES ('Ticket 1', 'Description 1', 'Open', 1);

INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES ('Fixed the street light', '2019-01-01 00:00:00', 1, 1);
