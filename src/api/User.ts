import { Router, Request, Response, NextFunction } from 'express'
import User from '../Models/User'
import bcrypt from 'bcrypt'
import session from 'express-session'

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

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (await User.findOne({ email })) {
      res.status(400).json({ message: 'Email is already in use' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, hashedPassword })
    await user.save()

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error })
  }
})

router.post('/signin', async (req:Request, res:Response): Promise<void> => {
    try{
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            res.status(400).json({ message: 'Email doesnt exist' })
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser?.hashedPassword as string)
        if (!isPasswordCorrect) {
            res.status(400).json({ message: 'Incorrect password' })
            return
        }
        req.session.isAuth = true
        res.cookie("Username",existingUser.name,{maxAge:60000*60*5, signed:true})
        res.status(200).json({ message: 'Sign-in successful' })

    } catch (error) {
        res.status(500).json({ message: 'Error when signing up', error })
    }
})

router.get('/users',isAuth, async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error })
  }
})

export default router
