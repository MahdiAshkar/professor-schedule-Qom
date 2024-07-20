/**
 * @swagger
 * tags:
 *  name: Professor
 *  description: professor Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Register:
 *              type: object
 *              required:
 *                  -   name
 *                  -   username
 *                  -   password
 *                  -   email
 *              properties:
 *                  name:
 *                      type: string
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  email:
 *                      type: string
 *                      format: email
 *                  image_profile:
 *                      type: string
 *                  phone_office:
 *                      type: string
 *          Login:
 *              type: object
 *              required:
 *                  -   username                      
 *                  -   password
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string                                                              

 */

/**
 * @swagger
 *
 * /professor/register:
 *  post:
 *      summary: register professor in this end-point
 *      tags:
 *          -   Professor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Register'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Register'
 *      responses:
 *          200:
 *              description: success register
 */
/**
 * @swagger
 *
 * /professor/login:
 *  post:
 *      summary: login professor
 *      tags:
 *          -   Professor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *              description: success login
 */
/**
 * @swagger
 *
 * /professor/logout:
 *  get:
 *      summary: logout professor
 *      tags:
 *          -   Professor
 *      responses:
 *          200:
 *              description: success logout
 */
/**
 * @swagger
 *
 * /professor/search:
 *  get:
 *      summary: Search for a professor by  name
 *      tags:
 *          -   Professor
 *      parameters:
 *          - in : query
 *            name: query
 *            required: true
 *
 *      responses:
 *          200:
 *              description: success search
 *          404:
 *              description: Professor not found
 *          400:
 *              description: Bad request
 */
