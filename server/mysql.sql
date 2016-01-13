drop table message; 
create table message
(
	id int PRIMARY KEY AUTO_INCREMENT,
	message TEXT,
    timeMessage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fromName TEXT,
    channel TEXT
)
