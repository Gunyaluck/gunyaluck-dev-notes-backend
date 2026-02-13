import * as statusService from "../services/statusService.mjs";

export const getAllStatuses = async (req, res) => {
  try {
    const statuses = await statusService.getAllStatuses();
    res.status(200).json(statuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server could not read statuses because database issue",
      error: err.message || "Internal server error",
    });
  }
};
