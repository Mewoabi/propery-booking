import { Router } from 'express';
import { asyncHandler } from '../async-handler';
import { parseIdParam } from '../parse-params';
import type { BookingService } from '../services/booking.service';

export function createBookingRouter(bookingService: BookingService) {
  const router = Router();

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const created = await bookingService.create(req.body);
      res.status(201).json(created);
    }),
  );

  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      res.json(await bookingService.findAll());
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      res.json(await bookingService.findOne(id));
    }),
  );

  router.patch(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      const result = await bookingService.update(id, req.body);
      res.json(result);
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      await bookingService.remove(id);
      res.status(200).send();
    }),
  );

  return router;
}
