import express,{ Request, Response, NextFunction } from "express";
import {getFacilities,postFacilities,getAirports,postAirports,postAirportsSeeder,getAirline,postAirline,postAirlineSeeder} from "../controller/Airlines"

const router = express.Router()



router.get('/facilities',getFacilities)
router.post('/facilities',postFacilities)
router.get('/airports',getAirports)
router.post('/airports',postAirports)
router.post('/airports/seeder',postAirportsSeeder)
router.get('/airline',getAirline)
router.post('/airline',postAirline)
router.post('/airline/seeder',postAirlineSeeder)


export default router