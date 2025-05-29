import express from 'express';
import userRouter from './userRoutes/userRouter';
import adminRouter from './adminRoutes/adminRouter';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const indexRouter = express.Router();

indexRouter.get('/working', (req, res) => {
    res.status(200).json({
        msg: "Routing is working",
        status: "success"
    });
});

interface Sites{
    id : number,
    place: string,
    description: string,
    price: number,
    imageUrl: string,
    contactEmail: string,
    contactPhone:string
    sold: boolean,
}

indexRouter.get('/', async(req, res) => {

    try{
        let siteList:Sites[] = await prisma.site.findMany({
            where:{
                sold: false
            }
        });

        if(!siteList || siteList.length === 0) {
            res.status(404).json({
                msg: "No sites found",
                status: "error"
            });
            return;
        }

        res.status(200).json({
            msg: "Site list fetched successfully",
            status: "success",
            data: siteList
        });

        return;

    }catch(err) {
        res.status(500).json({
            msg: "Error fetching site list",
            status: "error"
        });
        return;
    }

})

indexRouter.use('/user', userRouter);
indexRouter.use('/admin', adminRouter);

export default indexRouter;