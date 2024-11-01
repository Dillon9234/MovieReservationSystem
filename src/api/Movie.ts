import { Router, Request, Response, NextFunction } from 'express'
import Movie from '../Models/Movie'
import TimeSlot from '../Models/TimeSlot'
import TheaterScreen from '../Models/TheaterScreen'

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

router.post('/addTimeSlot',isAuth, async (req: Request, res: Response)=>{
  try{
    const {
      date, movieName, time:{
        hours,
        mins,
        secs
      }, 
      theaterScreenId
    } = req.body

    const movie = await Movie.findOne({name:movieName})
    if(!movie){
      res.status(500).json("movie Doesnt Exist")
      return
    }

    const theaterScreen = await TheaterScreen.findOne({Id:theaterScreenId})
    if(!theaterScreen){
      res.status(500).json("Theater Screen Doesnt Exist")
      return
    }
    const tempTimeSlot = await TimeSlot.findOne({date:date, time:{
      hours,
      mins,
      secs
      },
      theaterScreen:theaterScreen
    })
    if(tempTimeSlot){
      res.status(400).json({ message: 'TimeSlot in use' })
      return
    }
    const timeslot = new TimeSlot({
      date:date,
      movie:movie,
      time:{
        hours,
        mins,
        secs
      },
      theaterScreen:theaterScreen
    })

    await timeslot.save()

    res.status(201).json(timeslot)
  }catch(error){
    res.status(500).json({ message: 'Error adding timeslot', error })
  }
})

router.get('/getDay/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;    

    const timeslots = await TimeSlot.find({ date: date })
      .populate('movie', 'name')
      .populate('theaterScreen', 'Id');

    if (!timeslots.length) {
      res.status(404).json({ message: "No timeslots found for the specified date" });
      return;
    }

    const formattedDay = {
      date,
      slots: timeslots.map((slot) => ({
        movieName: slot.movie.name,
        time: slot.time,
        theaterId: slot.theaterScreen.Id
      })),
    };

    res.json(formattedDay);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timeslots for the day', error });
  }
});

router.get('/getTimeslot', async (req: Request, res: Response) => {
  try {
    const { date, hours, mins, secs, theaterScreenId } = req.query;

    const theaterScreen = await TheaterScreen.findOne({ Id: theaterScreenId });
    if (!theaterScreen) {
      res.status(404).json({ message: 'Theater screen not found' });
      return;
    }

    const timeslot = await TimeSlot.findOne({ date:date,
      time: { hours: Number(hours), mins: Number(mins), secs: Number(secs) },
      theaterScreen: theaterScreen,
    }).populate('movie');

    if (!timeslot) {
      res.status(404).json({ message: 'Time slot not found' });
      return;
    }

    const formattedTimeslot = {
      movie: timeslot.movie,
      date:timeslot.date,
      time: timeslot.time,
      seating: theaterScreen.seating,
      bookedSeats: timeslot.bookedSeats,
    };

    res.status(200).json(formattedTimeslot);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time slot', error });
  }
});



export default router
