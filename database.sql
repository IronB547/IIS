CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Ticket (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1023) NOT NULL,
    status VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Service_request (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1023) NOT NULL,
    solution_time VARCHAR(255) NOT NULL,
    solution_state VARCHAR(255) NOT NULL,
    time_spent VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Ticket_photo (
    id INT NOT NULL AUTO_INCREMENT,
    url VARCHAR(511) NOT NULL,
    ticket_id INT NOT NULL,
    PRIMARY KEY (id, ticket_id),
    FOREIGN KEY (ticket_id) REFERENCES Ticket(id)
);

CREATE TABLE Ticket_comment (
    id INT NOT NULL AUTO_INCREMENT,
    comment VARCHAR(1023) NOT NULL,
    created_at DATETIME NOT NULL,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ticket_id) REFERENCES Ticket(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
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

