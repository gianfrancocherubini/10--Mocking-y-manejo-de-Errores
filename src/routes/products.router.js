import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";
import { isAdmin } from "../config/config.auten.autoriz.js";
export const router=Router();


router.post('/', isAdmin, ProductsController.createProduct);
router.put('/:pid', isAdmin, ProductsController.updateProduct);


