# USER_TYPE: 0,1,2,3
#            'user', 'technician', 'city_manager', 'admin'

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    userType INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNum VARCHAR(255) NOT NULL,
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
    userID INT NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userID) REFERENCES Users(id) ON DELETE CASCADE
);

# SOLUTION_STATE: 0,1
#                 'unsolved', 'solved'
CREATE TABLE Service_request (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1023) NOT NULL,
    solutionTime VARCHAR(255) DEFAULT '0',
    solutionState INT NOT NULL DEFAULT 0,
    timeSpent VARCHAR(255) DEFAULT '0',
    cityManagerID INT NOT NULL,
    createdAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    ticketID INT,
    FOREIGN KEY (ticketID) REFERENCES Tickets(id)
);

CREATE TABLE Service_request_technician (
    serviceRequestID INT NOT NULL,
    technicianID INT NOT NULL,
    PRIMARY KEY (serviceRequestID, technicianID),
    FOREIGN KEY (serviceRequestID) REFERENCES Service_request(id) ON DELETE CASCADE,
    FOREIGN KEY (technicianID) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Ticket_photo (
    id INT NOT NULL AUTO_INCREMENT,
    url VARCHAR(511) NOT NULL,
    ticketID INT NOT NULL,
    PRIMARY KEY (id, ticketID),
    FOREIGN KEY (ticketID) REFERENCES Tickets(id) ON DELETE CASCADE
);

CREATE TABLE Ticket_comment (
    id INT NOT NULL AUTO_INCREMENT,
    comment VARCHAR(1023) NOT NULL,
    createdAt DATETIME NOT NULL,
    ticketID INT NOT NULL,
    userID INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ticketID) REFERENCES Tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Service_request_comment (
    id INT NOT NULL AUTO_INCREMENT,
    comment VARCHAR(1023) NOT NULL,
    createdAt DATETIME NOT NULL,
    serviceRequestID INT NOT NULL,
    userID INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (serviceRequestID) REFERENCES Service_request(id),
    FOREIGN KEY (userID) REFERENCES Users(id)
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

#insert sample data

# USER_TYPE: 0,1,2,3
#            'user', 'technician', 'city_manager', 'admin'
INSERT INTO Users (name, surname, password, userType, email, phoneNum) VALUES ('Zdenda', 'Holý', 'admin', 3, 'admin@admin.cz', '666666666');
INSERT INTO Users (name, surname, password, userType, email, phoneNum) VALUES ('Franta', 'Novák', 'Frantajebest', 0, 'Franta.Pepa@seznam.cz', '786314245');
INSERT INTO Users (name, surname, password, userType, email, phoneNum) VALUES ('Standa', 'Dvořák', 'Standa123', 1, 'Stanislav.Dvořák@gmail.com', '626425286');
INSERT INTO Users (name, surname, password, userType, email, phoneNum) VALUES ('Pepa', 'Franta', 'Standasmrdi', 1, 'Pepa.Franta@gmail.com', '775416283');
INSERT INTO Users (name, surname, password, userType, email, phoneNum) VALUES ('Milda', 'Zeman', 'SuperManager123', 2, 'Milda.Zeman@gmail.com', '618485631');
INSERT INTO Users (name, surname, password, userType, email, phoneNum) VALUES ('Zuzana', 'Čaputová', 'SuperManagerka321', 2, 'Caputova.zuzka@seznam.com', '624984853');


# STATUS: 0,1,2,3
#         'open', 'waiting', 'solved', 'rejected'
INSERT INTO Tickets (title, location, description, status, userID, createdAt) VALUES ('Ticket 1', 'Location 1', 'Description 1', 0, 1, '2019-01-01 00:00:00');
INSERT INTO Tickets (title, location, description, status, userID, createdAt) VALUES ('Rozbitá pouliční lampa', 'U lávky nedaleko řeky', 'Je rozbitá lampa u lávky, asi dva týdny už nesvítí', 2, 2, '2020-05-22 10:02:16');
INSERT INTO Tickets (title, location, description, status, userID, createdAt) VALUES ('Posprejovaná zítka u hřiště', 'Fotbalové hřiště na cacovickém ostrově', 'Včera někdo v noci posprejoval zítku, mohli byste ji prosím přemalovat?', 3, 3, '2020-08-8 15:37:11');

# Ticket Comments
INSERT INTO Ticket_comment (comment, createdAt, ticketID, userID) VALUES ('Comment 1', '2019-01-01 00:00:00', 1, 1);

INSERT INTO Ticket_comment (comment, createdAt, ticketID, userID) VALUES ('Prosím, už je to další týden a nedostal jsem žádnou odpověď na ticket. Moje žena se tudy bojí chodit po tmě sama.', '2020-05-30 18:02:16', 2, 2);
INSERT INTO Ticket_comment (comment, createdAt, ticketID, userID) VALUES ('Nebojte, zavolal jsem na to Standu, postará se o to.', '2020-05-31 09:12:36', 2, 4);
INSERT INTO Ticket_comment (comment, createdAt, ticketID, userID) VALUES ('Ještě dnes se na to podívám, nebojte se :)', '2020-05-31 10:18:36', 2, 3);

INSERT INTO Ticket_comment (comment, createdAt, ticketID, userID) VALUES ('Promiňte, ale kdybychom ji přemalovali teď, tak by ji v nejbližší době zase někdo pomaloval, prodiskutujeme situaci a rozhodneme se jak dále postupovat.', '2020-08-10 12:02:27', 3, 4);
INSERT INTO Ticket_comment (comment, createdAt, ticketID, userID) VALUES ('Škoda no... tak to asi budeme muset udělat na vlastní pěst.', '2020-08-11 15:17:55', 3, 3);

INSERT INTO Ticket_photo (url, ticketID) VALUES ('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg', 1);
INSERT INTO Ticket_photo (url, ticketID) VALUES ('https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-674010.jpg&fm=jpg', 1);

# SOLUTION_STATE: 0,1
#                 'unsolved', 'solved'
INSERT INTO Service_request (title, description, solutionTime, timeSpent, cityManagerID, ticketID, createdAt) VALUES ('Title 1', 'Description 1', '0', '0', 5, 1, '2020-01-23 12:14:50');
INSERT INTO Service_request (title, description, solutionState, solutionTime, timeSpent, cityManagerID, ticketID, createdAt) VALUES ('Title 2', 'Description 2', 1, '0', '0', 6, 1, '2021-01-01 00:00:00');

INSERT INTO Service_request (title, description, solutionTime, timeSpent, cityManagerID, ticketID, createdAt) VALUES ('Výměna žárovky v lampě', 'Nutná výměna žárovky v lampě', '0', '0', 6, 2, '2020-05-31 08:50:12');
INSERT INTO Service_request (title, description, solutionTime, timeSpent, cityManagerID, ticketID, createdAt) VALUES ('Kontrola kabelů v lampě', 'Je potřeba rutinní prohlídka kabelů, zda li nejsou steřelé nebo vypadené', '0', '0', 5, 2, '2020-05-31 08:53:55');
INSERT INTO Service_request (title, description, solutionState, solutionTime, timeSpent, cityManagerID, ticketID, createdAt) VALUES ('Výměna sloupu', 'Je potřeba vyměnit rezavý sloup', 1, '0', '0', 5, 2, '2019-08-20 15:23:14');

SELECT title, solutionState, description, cityManagerID, createdAt FROM Service_request ORDER BY solutionState, createdAt DESC;
INSERT INTO Service_request_technician (serviceRequestID, technicianID) VALUES (1, 3);
INSERT INTO Service_request_technician (serviceRequestID, technicianID) VALUES (2, 4);

INSERT INTO Service_request_comment (comment, createdAt, serviceRequestID, userID) VALUES ('Vyřešil jsem problém, žárovka svítí', '2020-05-31 19:51:12', 1, 3);
