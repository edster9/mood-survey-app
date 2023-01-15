# mood-survey-app &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]

## Introduction

This project will present a user with a mood survey questionnaire, capable of capturing their state of mind and storing data on the backend.

The survey result will be compare to previous enteries by the user as well as compared to all other people in the same age group.

### Tech Stack

This project is a javascript application using the following tech stacks.

- **TypeScript:**
- **ExpressJS:**
- **Sqlite:**
- **ReactJS:**
- **Bootstrap UI:**

## Installation

### Requirements

- Any PC or MAC with NodeJS 16+ installed.
- Git command line tool

### Repo Install

The project can be cloned from GitHub for free with the following command

```bash
git clone git@github.com:edster9/mood-survey-app.git

cd mood-survey-app
yarn run install:dep
yarn dev
```

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

```mermaid
 classDiagram
      Animal <|-- Duck
      Animal <|-- Fish
      Animal <|-- Zebra
      Animal : +int age
      Animal : +String gender
      Animal: +isMammal()
      Animal: +mate()
      class Duck{
          +String beakColor
          +swim()
          +quack()
       }
      class Fish{
          -int sizeInFeet
          -canEat()
      }
      class Zebra{
          +bool is_wild
          +run()
      }

```

```mermaid
classDiagram
    survey o-- people

    class people{
        id number
    }

    note for survey "peopleId FK (people.id)"
    class survey{
        peopleId number
    }
```

### The API

#### Endpoints

- [GET|DELETE] /people/:id
- [POST] /people/survey
- [GET] /people/:id/compare/age
- [GET] /people/:id/compare/age-groups

##### **GET /people/:id**

Request:

```http
GET http://localhost:3001/people/1
```

Response:

```json
{
	"id": 1,
	"fullName": "John Smith",
	"birthday": "1971-09-22T00:00:00.000",
	"lastSurveyTime": "2023-01-15T11:08:50.915-08:00",
	"happyScale": 4,
	"happyAverage": 4,
	"energyScale": 3,
	"energyAverage": 3,
	"hopefulnessScale": 2,
	"hopefulnessAverage": 2,
	"sleepHours": 8,
	"sleepAverage": 8,
	"age": 51
}
```

##### **POST /people/survey**

Request:

```http
POST /people/survey
content-type: application/json

{
    "fullName": "John Smith",
    "birthday": "1971-09-22T00:00:00.000",
    "happyScale": 4,
    "energyScale": 3,
    "hopefulnessScale": 2,
    "sleepHours": 8
}
```

Response:

```json
{
	"person": {
		"id": 1,
		"fullName": "John Smith",
		"birthday": "1971-09-22T00:00:00.000",
		"lastSurveyTime": "2023-01-15T11:10:57.797-08:00",
		"happyScale": 4,
		"happyAverage": 4,
		"energyScale": 3,
		"energyAverage": 3,
		"hopefulnessScale": 2,
		"hopefulnessAverage": 2,
		"sleepHours": 8,
		"sleepAverage": 8,
		"age": 51
	},
	"previousSurvey": {
		"id": 1,
		"peopleId": 1,
		"happyScale": 4,
		"energyScale": 3,
		"hopefulnessScale": 2,
		"sleepHours": 8,
		"timestamp": "2023-01-15T11:08:50.915-08:00"
	},
	"otherAgeGroups": []
}
```
