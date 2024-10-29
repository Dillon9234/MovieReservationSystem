import { Router, Request, Response, NextFunction } from 'express'
import Movie from '../Models/Movie'
import TimeSlot from '../Models/TimeSlot'
import session from 'express-session'
import Day from '../Models/Day'

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

router.post('/addMovie',isAuth, async (req: Request, res: Response) => {
  try {
    const { name,  releaseDate, duration:{
          hours,
          mins,
          secs
        },
        genre  } = req.body

    if (await Movie.findOne({ name })) {
      res.status(400).json({ message: 'Movie already exists' })
      return
    }

    const newMovie = new Movie({
      name:name,
      releaseDate:releaseDate,
      duration:{
        hours,
        mins,
        secs
      },
      genre:genre
    })

    await newMovie.save()

    res.status(201).json(newMovie)
  } catch (error) {
    res.status(500).json({ message: 'Error adding movie', error })
  }
})


router.get('/getMovies', async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find()
    res.json(movies)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error })
  }
})

router.post('/addDate',isAuth, async (req:Request, res:Response)=>{
  try {
    const { date } = req.body

    if (await Day.findOne({ date })) {
      res.status(400).json({ message: 'Day already exists' })
      return
    }

    const day = new Day({
      date:date
    })

    await day.save()

    res.status(201).json(day)
  } catch (error) {
    res.status(500).json({ message: 'Error adding day', error })
  }
})

router.post('/addtimeslot',isAuth, async (req: Request, res: Response)=>{
  try{
    const {
      date, movieName, time:{
        hours,
        mins,
        secs
      }, 
    } = req.body

    const day = await Day.findOne({date})
    if(!day){
      res.status(500).json("Date Doesnt Exist")
      return
    }

    const movie = await Movie.findOne({name:movieName})
    if(!day){
      res.status(500).json("movie Doesnt Exist")
      return
    }

    const tempTimeSlot = await TimeSlot.findOne({time:{
      hours,
      mins,
      secs
    }})
    if(tempTimeSlot){
      res.status(400).json({ message: 'TimeSlot in use' })
      return
    }
    const timeslot = new TimeSlot({
      movie:movie?.id,
      time:{
        hours,
        mins,
        secs
      }
    })

    await timeslot.save()

    day.slots.push(timeslot.id)

    await day.save()
    res.status(201).json(day)
  }catch(error){
    res.status(500).json({ message: 'Error adding timeslot', error })
  }
})

router.get('/getday/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;

    const day = await Day.findOne({ date }).populate({
      path: 'slots',
      populate: { path: 'movie', select: 'name' } 
    });

    if (!day) {
      res.status(404).json({ message: "Day not found" });
      return
    }

    const formattedDay = {
      date: day.date,
      slots: day.slots.map((slot: any) => ({
        movieName: slot.movie.name,
        time: slot.time,
      })),
    };

    res.json(formattedDay);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Day', error });
  }
});


export default router
