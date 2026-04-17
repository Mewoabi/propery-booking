import 'reflect-metadata';
import apicache from 'apicache';
import cors from 'cors';
import express from 'express';
import { AppDataSource } from './data-source';
import { Booking, Property, User } from './entities/entities';
import { errorMiddleware } from './error-middleware';
import { createBookingRouter } from './routes/booking.routes';
import { createPropertyRouter } from './routes/property.routes';
import { createUserRouter } from './routes/user.routes';
import { BookingService } from './services/booking.service';
import { PropertyService } from './services/property.service';
import { UserService } from './services/user.service';

async function bootstrap() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const propertyRepo = AppDataSource.getRepository(Property);
  const bookingRepo = AppDataSource.getRepository(Booking);

  const userService = new UserService(userRepo);
  const propertyService = new PropertyService(propertyRepo);
  const bookingService = new BookingService(bookingRepo, userService, propertyService);

  const app = express();
  app.use(cors());
  app.use(express.json());

  const cacheGet = apicache.middleware('1 minute');
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      return cacheGet(req, res, next);
    }
    next();
  });

  app.get('/', (_req, res) => {
    res.type('text/plain').send('Hello World!');
  });

  app.use('/user', createUserRouter(userService));
  app.use('/property', createPropertyRouter(propertyService));
  app.use('/booking', createBookingRouter(bookingService));

  app.use(errorMiddleware);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
