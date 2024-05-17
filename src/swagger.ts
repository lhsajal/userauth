import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import express from 'express';
//import YAML from 'yamljs';
import {apiDocumentation} from './swaggerDocs/apiDocs';


//const swaggerSpec = swaggerJsdoc(apiDocumentation.definition)
//const swaggerDocument = YAML.load('./swagger.yaml');

function swaggerDocs(app: express.Application) {
    // Swagger Page
    // app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    // // Documentation in JSON format
    // app.get('/docs.json', (req, res) => {
    //     res.setHeader('Content-Type', 'application/json')
    //     res.send(swaggerSpec)
    // })
}
export default swaggerDocs