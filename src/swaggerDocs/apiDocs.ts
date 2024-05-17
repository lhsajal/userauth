const apiDocumentation = {
    definition: {
        //openapi: '3.0.0',
        swagger: "2.0",
        info: {
            version: '1.0.0',
            title: 'User Auth APIs',
            description: "API endpoints user authentication and authorization",
            license: {
                name: "Sajal Jain",
                email: "sajal.jain@labourhomeindia.com",
                url: "https://github.com/DesmondSanctity/node-js-swagger"
            }
        },
        // servers: [
        //     {
        //         url: "http://localhost:8080/",
        //         description: "Local server"
        //     },
        //     {
        //         url: "<your live url here>",
        //         description: "Live server"
        //     },
        // ],
        // tags: [
        //     {
        //         name: 'Roles',
        //     },
        //     {
        //         name: 'Users',
        //         description: "API for users"
        //     },
        // ],
        //"basePath": "/",
        //"produces": ["application/json"],
        // paths: {
        //     "/users": {
        //         "get": {
        //             "tags": ["Users"],
        //             "summary": "Get all users",
        //             "responses": {
        //                 "200": {
        //                     "description": "ok",
        //                     "schema": {
        //                         "$ref": "#/definitions/Users"
        //                     }
        //                 }
        //             }
        //         }
        //     },
        // }
    },
    // looks for configuration in specified directories
    //apis: ['./src/routes/*.ts'],
}

export { apiDocumentation };
