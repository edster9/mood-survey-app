-- Up

CREATE TABLE people (
    id INTEGER PRIMARY KEY,
    fullName TEXT NOT NULL,
    birthday DATETIME NOT NULL,
    happyScale INTEGER NOT NULL,
    happyAverage INTEGER NOT NULL,
    happyAggregate INTEGER NOT NULL,
    happyCount INTEGER NOT NULL,
    energyScale INTEGER NOT NULL,
    energyAverage INTEGER NOT NULL,
    energyAggregate INTEGER NOT NULL,
    energyCount INTEGER NOT NULL,
    hopefulnessScale INTEGER NOT NULL,
    hopefulnessAverage INTEGER NOT NULL,
    hopefulnessAggregate INTEGER NOT NULL,
    hopefulnessCount INTEGER NOT NULL,
    sleepHours INTEGER NOT NULL,
    sleepAverage INTEGER NOT NULL,
    sleepAggregate INTEGER NOT NULL,
    sleepCount INTEGER NOT NULL,
    lastSurveyTime DATETIME NOT NULL
);

CREATE UNIQUE INDEX people_name_bday_idx ON people(fullName, birthday);
CREATE INDEX people_bday_idx ON people(birthday);

CREATE TABLE survey (
    id INTEGER PRIMARY KEY,
    peopleId INTEGER NOT NULL,
    happyScale INTEGER NOT NULL,
    energyScale INTEGER NOT NULL,
    hopefulnessScale INTEGER NOT NULL,
    sleepHours INTEGER NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY(peopleId) REFERENCES people(id)    
);

CREATE INDEX survey_people_idx ON survey(peopleId);
CREATE INDEX survey_people_timestamp_idx ON survey(peopleId, timestamp);

-- Down

DROP TABLE people;