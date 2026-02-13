import * as statusRepository from "../repositories/statusRepository.mjs";

export const getAllStatuses = async () => {
  return await statusRepository.getAllStatuses();
};
