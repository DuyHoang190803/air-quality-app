# Task Assignment

The goal of this test is to prepare a web application (frontend only), which will display air quality measurements from selected meteorological stations in the Hradec Králové Region either on a map background or in a table. The application should be written simply, the source code should be carefully documented, and emphasis should also be placed on design and user interface. The choice of technology and architecture is entirely up to the developer. When evaluating the task, attention will be paid to processing speed, the chosen technology, readability of source code, and implementation of the user interface.

## Specification:

- Design the application so that it is possible to switch between the map view of stations and the tabular view of data  
- Load data from an external REST API, derive the meaning of the data from the JSON structure  
- For the map background use the Mapbox solution (see www.mapbox.com)  
- On the map background, display the individual measurement sites (according to the given GPS positions), station name, and current values (on click)  
- When clicking on a specific site, display a detail dialog with the measured values  
- In the table, display historical data and create a simple form for searching the data  

## REST API:

- Call all endpoints using the `POST` method  
- For authentication, include the HTTP header `Authorization: Token 2795185a-cd5a-11e8-a8d5-f2801f1b9fd1` in each request  
- Dates must be provided in ISO string format  
- Endpoint for current measured values: `https://invipo.idshk.cz/query?name=CityDashboard.Environment.Tile`  
- Endpoint for list of meteo stations: `https://invipo.idshk.cz/query?name=CityDashboard.Environment.List`  
- Endpoint for measurement history: `https://invipo.idshk.cz/query?name=CityDashboard.Environment.History` (parameters in the body: `from`, `to`, `itemId`, and `type` with value `hourly` or `daily`)  

Save the output into this repository and provide programming documentation in the README.md file.

If you have questions, text +420602568825 or write to lukas.duffek@incinity.cz.
