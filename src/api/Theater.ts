import { Router, Request, Response, NextFunction } from 'express'
import Theater from '../Models/Theater'
import TheaterScreen from '../Models/TheaterScreen'
import ISeat from '../Interfaces/ISeat'

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

router.post('/addTheater',isAuth, async (req: Request, res: Response) => {
  try {
    const { Id, name} = req.body

    if (await Theater.findOne({ name:name })) {
      res.status(400).json({ message: 'Theater already exists' })
      return
    }

    const newTheater = new Theater({
        Id:Id,
        name:name,
    })

    await newTheater.save()

    res.status(201).json(newTheater)
  } catch (error) {
    res.status(500).json({ message: 'Error adding Theater', error })
  }
})


router.get('/getTheater', async (req: Request, res: Response) => {
  try {
    const theaters = await Theater.find()
    res.json(theaters)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching theaters', error })
  }
})

router.post('/addTheaterScreen', isAuth, async (req: Request, res: Response) => {
  try {
    const { theaterId, screenId, seatingLayout } = req.body;

    const theater = await Theater.findOne({ Id: theaterId });
    if (!theater) {
      res.status(500).json("Theater Doesn't Exist");
      return;
    }

    const theaterScreen = await TheaterScreen.findOne({Id: screenId})
    if(theaterScreen){
      res.status(400).json({ message: 'Theater Screen already exists' })
      return
    }

    const seating: ISeat[] = [];

    for (const row of seatingLayout) {
      const { row: rowNumber, columns } = row;

      for (let colIndex = 0; colIndex < columns; colIndex++) {
        const seat: ISeat = {
          row: rowNumber,
          column: colIndex
        };
        seating.push(seat);
      }
    }

    const newTheaterScreen = new TheaterScreen({
      theater:theater,
      Id: screenId,
      seating,
    });

    await newTheaterScreen.save();

    res.status(201).json(newTheaterScreen);
  } catch (error) {
    res.status(500).json({ message: 'Error adding TheaterScreen', error });
  }
});

router.get('/getTheaterScreen', async (req: Request, res: Response) => {
    try {
      const theaterScreens = await TheaterScreen.find()
        .populate('theater') 
        .populate('seating');
  
      res.json(theaterScreens);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching theaters', error });
    }
  });
  


export default router
