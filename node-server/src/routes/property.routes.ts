import { Router } from 'express';
import { asyncHandler } from '../async-handler';
import { parseIdParam, parseQueryDate } from '../parse-params';
import type { PropertyService } from '../services/property.service';

export function createPropertyRouter(propertyService: PropertyService) {
  const router = Router();

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const created = await propertyService.create(req.body);
      res.status(201).json(created);
    }),
  );

  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      res.json(await propertyService.findAll());
    }),
  );

  router.get(
    '/availiability/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      const startDate = parseQueryDate(req.query.startDate, 'startDate');
      const endDate = parseQueryDate(req.query.endDate, 'endDate');
      res.json(await propertyService.getAvailability(id, startDate, endDate));
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      res.json(await propertyService.findOne(id));
    }),
  );

  router.patch(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      res.json(await propertyService.update(id, req.body));
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      await propertyService.remove(id);
      res.status(200).send();
    }),
  );

  return router;
}
