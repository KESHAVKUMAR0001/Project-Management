//To define Healthcheck route containing route and method

import {Router} from "express"  //Importing router package of expressJS
import { healthcheck } from "../controllers/healthcheck.controllers.js"

const router=Router()   //Creating object of router class

router.route("/").get(healthcheck)  // / route m get request aye toh healthcheck controller serve krna h

export default router