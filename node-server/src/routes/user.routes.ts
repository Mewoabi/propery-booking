import { Router } from 'express';
import { asyncHandler } from '../async-handler';
import { parseIdParam } from '../parse-params';
import type { UserService } from '../services/user.service';

export function createUserRouter(userService: UserService) {
  const router = Router();

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const created = await userService.create(req.body);
      res.status(201).json(created);
    }),
  );

  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      res.json(await userService.findAll());
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      res.json(await userService.findOne(id));
    }),
  );

  router.patch(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      res.json(await userService.update(id, req.body));
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = parseIdParam(req.params.id);
      await userService.remove(id);
      res.status(200).send();
    }),
  );

  return router;
}
