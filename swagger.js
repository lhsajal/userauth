"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'User Auth APIs',
            description: "API endpoints user authentication and authorization",
            contact: {
                name: "Sajal Jain",
                email: "sajal.jain@labourhomeindia.com",
                url: "https://github.com/DesmondSanctity/node-js-swagger"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:8080/",
                description: "Local server"
            },
            {
                url: "<your live url here>",
                description: "Live server"
            },
        ]
    },
    // looks for configuration in specified directories
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app) {
    // Swagger Page
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
exports.default = swaggerDocs;
