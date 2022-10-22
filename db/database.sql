# USER_TYPE: 0,1,2,3
#            'user', 'technician', 'city_manager', 'admin'

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
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

# STATUS: 0,1,2,3
#         'open', 'waiting', 'solved', 'rejected'
CREATE TABLE Tickets (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(511),
    description VARCHAR(1023) NOT NULL,
    status INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

# SOLUTION_STATE: 0,1
#                 'unsolved', 'solved'
CREATE TABLE Service_request (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1023) NOT NULL,
    solution_time VARCHAR(255) DEFAULT '0',
    solution_state INT NOT NULL DEFAULT 0,
    time_spent VARCHAR(255) DEFAULT '0',
    city_manager_id INT NOT NULL,
    PRIMARY KEY (id),
    ticket_id INT,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(id)
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
    FOREIGN KEY (ticket_id) REFERENCES Tickets(id) ON DELETE CASCADE
);

CREATE TABLE Ticket_comment (
    id INT NOT NULL AUTO_INCREMENT,
    comment VARCHAR(1023) NOT NULL,
    created_at DATETIME NOT NULL,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ticket_id) REFERENCES Tickets(id) ON DELETE CASCADE,
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
    DROP TABLE IF EXISTS Tickets;
    DROP TABLE IF EXISTS Users;
END

#run the function
CALL delete_all_tables();

DELETE FROM Users where id = 1;


#insert sample data

# USER_TYPE: 0,1,2,3
#            'user', 'technician', 'city_manager', 'admin'
INSERT INTO Users (name, surname, password, user_type, email, phone_num) VALUES ('Zdenda', 'Holý', 'admin', 3, 'admin@admin.cz', '666666666');
INSERT INTO Users (name, surname, password, user_type, email, phone_num) VALUES ('Franta', 'Novák', 'Frantajebest', 0, 'Franta.Pepa@seznam.cz', '786314245');
INSERT INTO Users (name, surname, password, user_type, email, phone_num) VALUES ('Standa', 'Dvořák', 'Standa123', 1, 'Stanislav.Pokorny@gmail.com', '626425286');
INSERT INTO Users (name, surname, password, user_type, email, phone_num) VALUES ('Milda', 'Zeman', 'SuperManager123', 2, 'Milda.Zeman@gmail.com', '618485631');


# STATUS: 0,1,2,3
#         'open', 'waiting', 'solved', 'rejected'
INSERT INTO Tickets (title, location, description, status, user_id) VALUES ('Ticket 1', 'Location 1', 'Description 1', 0, 1);
INSERT INTO Tickets (title, location, description, status, user_id) VALUES ('Rozbitá pouliční lampa', 'U lávky nedaleko řeky', 'Je rozbitá lampa u lávky, asi dva týdny už nesvítí', 2, 2);
INSERT INTO Tickets (title, location, description, status, user_id) VALUES ('Posprejovaná zítka u hřiště', 'Fotbalové hřiště na cacovickém ostrově', 'Včera někdo v noci posprejoval zítku, mohli byste ji prosím přemalovat?', 3, 3);

# Ticket Comments
INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES ('Prosím, už je to další týden a nedostal jsem žádnou odpověď na ticket. Moje žena se tudy bojí chodit po tmě sama.', '2020-05-30 18:02:16', 2, 2);
INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES ('Nebojte, zavolal jsem na to Standu, postará se o to.', '2020-05-31 09:12:36', 2, 4);
INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES ('Ještě dnes se na to podívám, nebojte se :)', '2020-05-31 10:18:36', 2, 3);

INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES ('Promiňte, ale kdybychom ji přemalovali teď, tak by ji v nejbližší době zase někdo pomaloval, prodiskutujeme situaci a rozhodneme se jak dále postupovat.', '2020-08-10 12:02:27', 2, 4);
INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES ('Škoda no... tak to asi budeme muset udělat na vlastní pěst.', '2020-08-11 15:17:55', 2, 3);

INSERT INTO Ticket_comment (comment, created_at, ticket_id, user_id) VALUES ('Comment 1', '2019-01-01 00:00:00', 1, 1);

# SOLUTION_STATE: 0,1
#                 'unsolved', 'solved'
INSERT INTO Service_request (title, description, solution_time, time_spent, city_manager_id, ticket_id) VALUES ('Výměna žárovky v lampě', 'Nutná výměna žárovky v lampě', '' , '', 4, 2);
INSERT INTO Service_request_technician (service_request_id, technician_id) VALUES (1, 3);

INSERT INTO Service_request_comment (comment, created_at, service_request_id, user_id) VALUES ('Vyřešil jsem problém, žárovka svítí', '2020-05-31 19:51:12', 1, 3);