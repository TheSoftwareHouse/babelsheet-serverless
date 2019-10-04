# Babelsheet-node

BabelsheetJS service allows you to translate the user interface and application content to a specific language. As a user interface we use Google Spreadsheets which gives us a lot of features out of the box, e.g. multiple users working on translations at the same time and automatic translations to other languages. Internally, it also contains a scheduler to synchronise translations, a web server allowing you to fetch them, and a CLI tools which can generate translations in various formats on your local environment. What's more there is a cache layer for better performance.

BabelsheetJS consists of two services, producer and API. The first one is responsible for fetching Google Spreadsheet files containing translations every few minutes, then transforming them to a JSON format and storing in a Redis cache storage. On the other hand, the API service is a standard Express.js based web server which handles requests for translations in various formats and serves the output. It uses cached data stored in Redis for performance optimization.

This project is based on earlier version of BabelsheetJS (https://github.com/TheSoftwareHouse/babelsheet-js) You can find more information about translations management system there.

This project is a proof of concept of using serverless architecture for translations service.

Both API and producer services are stateless, can be easily parametrized and injected with different storage implementation. For that purpose we use DynamoDB storage implementation and all needed parameters are provided with AWS Systems Manager Parameter Store.

Function handler for API is created using a simple wrapper called "serverless-http" which wraps entire Express.js based app into a big function handler. For this small app this is a good enough solution, for bigger ones you might consider separating endpoints into more function handlers.

Function handler for producer is done the standard way, it just wraps the logic and responds accordingly.

Stack provisioning is done with use of Serverless Framework. Take a look at serverless.yml file. With this framework we can create AWS CloudWatch scheduler easily, just by defining proper schedule event triggering out producer function. AWS API Gateway is created through properly configured http event. Additional stuff, such as DynamoDB table, is defined in resources section. Check Serverless Framework docs at https://serverless.com/framework/docs/ to learn its commands.




