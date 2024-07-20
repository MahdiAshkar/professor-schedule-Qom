/**
 * @swagger
 * tags:
 *  name: Professor
 *  description: professor Module and Routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TimeSlot:
 *       type: object
 *       required:
 *         - startTime
 *         - endTime
 *         - task
 *         - duration
 *       properties:
 *         startTime:
 *           type: string
 *           description: startTime of the task
 *         endTime:
 *           type: string
 *           description: endTime of the task
 *         task:
 *           type: string
 *           description: Task description
 *         duration:
 *           type: number
 *           description: duration time Task
 *       example:
 *         startTime: "8:00"
 *         endTime: "9:00"
 *         task: "Teaching"
 *         duration: 1
 *
 *     DaySchedule:
 *       type: object
 *       required:
 *         - day
 *         - timeSlots
 *       properties:
 *         day:
 *           type: string
 *           enum:
 *                - شنبه
 *                - یکشنبه
 *                - دوشنبه
 *                - سه شنبه
 *                - چهارشنبه
 *                - پنج‌شنبه
 *           description: Day of the schedule
 *         timeSlots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimeSlot'
 *     Schedule:
 *       type: object
 *       required:
 *         - days
 *       properties:
 *         days:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DaySchedule'
 */

/**
 * @swagger
 *
 * /professor/create-schedule:
 *  post:
 *      summary: create schedule professor in this end-point
 *      tags:
 *          -   Professor
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Schedule'
 *      responses:
 *          200:
 *              description: success create schedule
 */
