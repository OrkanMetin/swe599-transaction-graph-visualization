# Transaction Graph Visualization

Welcome to **transaction-graph-visualization** code repository, which includes the backend and the client applications for visualizing sample transaction graph data.

## 🚀 Quickstart

### Requirements
You will need Python 3 installed, together with Pipenv to install dependencies.

The app uses a SQL database via SQLAlchemy. It is developed with PostgreSQL,which supports JSON field type.

### Installation
- Clone the repository

- Install dependencies using 
>pipenv install

### Configuration
All configuration can be found in app.py file.

Change at least:
- SQLALCHEMY_DATABASE_URI for the db connection
- SECRET_KEY to be unique to your application

### Run the application
- Enter virtual environment using >pipenv shell
- Run database migrations using 
>flask db upgrade

> Run python run.py

Check to see if the application is running with 
>curl -XGET http://localhost:5000/ping

## Documentation
There is API specification written in OpenAPI Specification

[https://transaction-graph-viz.herokuapp.com/swagger](https://transaction-graph-viz.herokuapp.com/swagger)

**Author:** Orkan Metin

**License:** The MIT License (MIT)
