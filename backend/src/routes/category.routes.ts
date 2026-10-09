/**
 * Routes for handling category-related API endpoints.
 */

import { Router } from "express";
import {
  getCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/category.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const categoryRouter = Router();

categoryRouter.get("/", getCategoriesHandler);
categoryRouter.get("/:id", getCategoryHandler);

categoryRouter.post("/", requireAdmin, createCategoryHandler);
categoryRouter.patch("/:id", requireAdmin, updateCategoryHandler);
categoryRouter.delete("/:id", requireAdmin, deleteCategoryHandler);

export default categoryRouter;
