import { Router, Request, Response, NextFunction } from 'express'
import ISeat from '../Interfaces/ISeat'
import TheaterScreen from '../Models/TheaterScreen'
import TimeSlot from '../Models/TimeSlot'
import Movie from '../Models/Movie'

const router = Router()

declare module 'express-session' {
  interface SessionData {
    isAuth?: boolean
  }
}

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session && req.session.isAuth) {
    return next()
  }
  res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' })
}

router.post('/book',isAuth,  async (req: Request, res: Response) =>{
    try {
        const { movieName, time:{
            hours,
            mins,
            secs,
          }, theaterScreenId, seatingLayout} =req.body

        const hasDuplicates = seatingLayout.some((seat:ISeat, index:Number) =>
          seatingLayout.findIndex((s: { row: Number; column: Number }) => s.row === seat.row && s.column === seat.column) !== index
        );
        
        if (hasDuplicates) {
          res.status(400).json({ message: 'Duplicate seats detected in the request' });
          return;
        }

        const theaterScreen = await TheaterScreen.findOne({Id:theaterScreenId})
        if(!theaterScreen){
            res.status(500).json({ message: 'Error fetching theater screen' })
            return
        }

        const movie = await Movie.findOne({name:movieName})

        if(!movie){
            res.status(500).json({ message: 'Error fetching Movie' })
            return
        }

        const timeslot = await TimeSlot.findOne({movie:movie, time:{hours,mins,secs}})
        if(!timeslot){
            res.status(500).json({ message: 'Error fetching timeslot' })
            return
        }

        const seating: ISeat[] = [];

        const existingBookedSeats = timeslot.bookedSeats || [];

        for (const row of seatingLayout) {
            const { row: rowNumber, column } = row;
            const seatExists = existingBookedSeats.some(seat => seat.row === rowNumber && seat.column === column);

            if (!seatExists) {
                if(req.signedCookies.Username){
                    seating.push({ row: rowNumber, column: column, UserName:req.signedCookies.Username });
                }else{
                    res.status(500).json({ message: 'User cookie doesnt exist' })
                    return
                }
                
            } else {
                res.status(500).json({ message: `Seat already booked: Row ${rowNumber}, Column ${column}` })
                return
            }
        }

        timeslot.bookedSeats.push(...seating);
        await timeslot.save()
        res.status(200).json({message:'Seats Booked'})

    } catch (error) {
        res.status(500).json({ message: 'Error booking seats', error })
    }
})

export default router
