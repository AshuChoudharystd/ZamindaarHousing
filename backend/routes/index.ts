import express from "express";
import userRouter from "./userRoutes/userRouter";
import adminRouter from "./adminRoutes/adminRouter";
import { PrismaClient } from "../generated/prisma";
import path from "path";

const prisma = new PrismaClient();

const indexRouter = express.Router();

indexRouter.use("/uploads",express.static(path.join(__dirname, "../uploads")));

indexRouter.get("/working", (req, res) => {
  res.status(200).json({
    msg: "Routing is working",
    status: "success",
  });
});

interface Sites {
  id: number;
  place: string;
  description: string;
  price: number;
  imageUrl: string;
  contactEmail: string;
  contactPhone: string;
  sold: boolean;
}

indexRouter.get("/", async (req, res) => {
  try {
    let siteList: Sites[] = await prisma.site.findMany({});

    if (!siteList || siteList.length === 0) {
      res.status(404).json({
        msg: "No sites found",
        status: "error",
      });
      return;
    }

    res.status(200).json({
      msg: "Site list fetched successfully",
      status: "success",
      data: siteList,
    });

    return;
  } catch (err) {
    res.status(500).json({
      msg: "Error fetching site list",
      status: "error",
    });
    return;
  }
});

indexRouter.get("/images", async (req, res) => {
  try {
    let siteList: Sites[] = await prisma.site.findMany({});

    if (!siteList || siteList.length === 0) {
      res.status(404).json({
        msg: "No sites found",
        status: "error",
      });
      return;
    }
    const imageUrls = siteList.map(
      (site) => `http://localhost:3000/api/v1/uploads/${site.imageUrl}`
    );
    res.json({ imageUrls });
    return;
  } catch (err) {
    res.status(500).json({
      error: err,
      status: "failure",
    });
    return;
  }
});

indexRouter.use("/user", userRouter);
indexRouter.use("/admin", adminRouter);

export default indexRouter;
