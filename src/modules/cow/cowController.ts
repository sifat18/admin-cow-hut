import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import reponseFormat from "../../shared/responseFormat";
import { ICow } from "./cowInterface";
import {
  createCowService,
  deleteCowService,
  getAllCowService,
  getSingleCowService,
  updateCowService,
} from "./cowService";
import { pick } from "../../shared/pick";
import { cowFilterableFields } from "./cowConstant";
import { paginationFields } from "../../shared/paginationFields";
// create
export const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...cowData } = req.body;
    const result = await createCowService(cowData);
    reponseFormat<ICow>(res, {
      success: true,
      statusCode: 200,
      message: "Cow created successfully",
      data: result,
    });
  }
);
// get all
export const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await getAllCowService(filters, paginationOptions);

  reponseFormat<ICow[]>(res, {
    statusCode: 200,
    success: true,
    message: "Cows retrieved successfully !",
    meta: result.meta,
    data: result.data,
  });
});

// single get

export const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await getSingleCowService(id);

  reponseFormat<ICow>(res, {
    statusCode: 200,
    success: true,
    message: "Cow retrieved successfully",
    data: result,
  });
});
// update
export const updateCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await updateCowService(id, updatedData);

  reponseFormat<ICow>(res, {
    statusCode: 200,
    success: true,
    message: "Cow updated successfully",
    data: result,
  });
});
// delete
export const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteCowService(id);

  reponseFormat<ICow>(res, {
    statusCode: 200,
    success: true,
    message: "Cow deleted successfully",
    data: result,
  });
});
